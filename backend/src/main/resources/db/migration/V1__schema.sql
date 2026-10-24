create table users (
    id              bigint generated always as identity primary key,
    full_name       text        not null,
    email           text        not null,
    role            text        not null default 'OPERATOR' check (role in ('ADMIN', 'OPERATOR', 'VIEWER')),
    timezone        text        not null default 'UTC',
    notify_capacity boolean     not null default true,
    notify_security boolean     not null default true,
    password_hash   text,
    created_at      timestamptz not null default now()
);
create unique index users_email_uq on users (lower(email));

create table locations (
    id   bigint generated always as identity primary key,
    name text not null unique
);

create table networks (
    id          bigint generated always as identity primary key,
    name        text        not null unique,
    cidr        cidr        not null,
    vlan_id     integer     not null unique check (vlan_id between 1 and 4094),
    vlan_name   text        not null,
    gateway     inet,
    dns_servers inet[]      not null default '{}',
    location_id bigint      not null references locations (id),
    created_at  timestamptz not null default now(),
    constraint networks_gateway_in_cidr check (gateway is null or gateway <<= cidr),
    constraint networks_no_overlap exclude using gist (cidr inet_ops with &&)
);

create table devices (
    id         bigint generated always as identity primary key,
    name       text        not null unique,
    type       text        not null check (type in ('SWITCH', 'ROUTER', 'FIREWALL', 'SERVER', 'WORKSTATION', 'ACCESS_POINT', 'OTHER')),
    mac        macaddr unique,
    port_name  text,
    port_mode  text check (port_mode in ('ACCESS', 'TRUNK', 'ROUTED')),
    vlan_id    integer references networks (vlan_id),
    status     text        not null default 'ONLINE' check (status in ('ONLINE', 'OFFLINE')),
    last_seen  timestamptz,
    created_at timestamptz not null default now()
);

create table ip_addresses (
    id              bigint generated always as identity primary key,
    network_id      bigint      not null references networks (id) on delete cascade,
    address         inet        not null,
    state           text        not null check (state in ('OCCUPIED', 'RESERVED', 'CONFLICT')),
    assignment_type text check (assignment_type in ('STATIC', 'DHCP')),
    hostname        text,
    device_id       bigint references devices (id) on delete set null,
    reserved_by     bigint references users (id),
    last_seen       timestamptz,
    created_at      timestamptz not null default now(),
    unique (network_id, address)
);
create index ip_addresses_device_idx on ip_addresses (device_id);

create function ip_addresses_validate() returns trigger language plpgsql as $$
declare
    net cidr;
begin
    select n.cidr into net from networks n where n.id = new.network_id;
    if not (new.address <<= net) then
        raise exception 'Address % is outside network %', host(new.address), net using errcode = '23514';
    end if;
    if masklen(net) < 31 and host(new.address) in (host(network(net)), host(broadcast(net))) then
        raise exception 'Address % is the network or broadcast address of %', host(new.address), net using errcode = '23514';
    end if;
    return new;
end
$$;

create trigger ip_addresses_validate_trg
    before insert or update of address, network_id on ip_addresses
    for each row execute function ip_addresses_validate();

create view v_network_utilization as
select n.id                                                   as network_id,
       t.total                                                as total_addresses,
       coalesce(c.used, 0)                                    as used_addresses,
       round(100.0 * coalesce(c.used, 0) / t.total)::int      as utilization_pct,
       case when 100.0 * coalesce(c.used, 0) / t.total > 85
            then 'WARNING' else 'HEALTHY' end                 as status
from networks n
cross join lateral (
    select (power(2, 32 - masklen(n.cidr))::bigint - case when masklen(n.cidr) >= 31 then 0 else 2 end) as total
) t
left join (select network_id, count(*) as used from ip_addresses group by network_id) c on c.network_id = n.id;

create table network_utilization_snapshots (
    network_id      bigint      not null references networks (id) on delete cascade,
    captured_at     timestamptz not null,
    used_addresses  bigint      not null,
    primary key (network_id, captured_at)
);

create table alerts (
    id          bigint generated always as identity primary key,
    type        text        not null check (type in ('GATEWAY_DOWN', 'CAPACITY', 'ROGUE_IP', 'DEVICE_OFFLINE', 'IP_CONFLICT', 'CONFIG_CHANGE')),
    severity    text        not null check (severity in ('INFO', 'WARNING', 'CRITICAL')),
    status      text        not null default 'OPEN' check (status in ('OPEN', 'ACKNOWLEDGED', 'RESOLVED')),
    message     text        not null,
    network_id  bigint references networks (id) on delete set null,
    device_id   bigint references devices (id) on delete set null,
    address     inet,
    created_at  timestamptz not null default now(),
    resolved_at timestamptz,
    resolved_by bigint references users (id)
);
create index alerts_status_idx on alerts (status, created_at desc);

create table alert_rules (
    rule_key    text primary key,
    label       text    not null,
    description text    not null,
    enabled     boolean not null default true,
    threshold   integer
);

create table health_checks (
    id         bigint generated always as identity primary key,
    label      text        not null,
    target_ip  inet        not null,
    device_id  bigint references devices (id) on delete set null,
    status     text        not null check (status in ('ONLINE', 'OFFLINE', 'ROGUE')),
    latency_ms integer,
    checked_at timestamptz not null default now()
);
create index health_checks_target_idx on health_checks (target_ip, checked_at desc);

create table audit_log (
    id          bigint generated always as identity primary key,
    actor_id    bigint references users (id),               -- null = the system itself
    category    text        not null check (category in ('IP_ALLOCATION', 'NETWORK', 'SECURITY', 'AUTOMATION', 'DEVICE', 'ACCOUNT')),
    action      text        not null,
    description text        not null,
    entity_type text,
    entity_id   bigint,
    details     jsonb,
    created_at  timestamptz not null default now()
);
create index audit_log_created_idx on audit_log (created_at desc);

create function audit_log_immutable() returns trigger language plpgsql as $$
begin
    raise exception 'audit_log is append-only' using errcode = '55000';
end
$$;
create trigger audit_log_immutable_trg before update or delete on audit_log
    for each row execute function audit_log_immutable();

create table config_jobs (
    id             bigint generated always as identity primary key,
    network_id     bigint not null references networks (id),
    device_id      bigint references devices (id),
    interface_name text   not null,
    config_text    text   not null,
    status         text   not null default 'GENERATED' check (status in ('GENERATED', 'QUEUED', 'PUSHED', 'FAILED')),
    requested_by   bigint references users (id),
    created_at     timestamptz not null default now()
);
