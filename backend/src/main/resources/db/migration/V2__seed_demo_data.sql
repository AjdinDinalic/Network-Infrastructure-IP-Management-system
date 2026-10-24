-- Demo data matching the original design mock-up. Delete this migration (or ship it only in dev) for production.

insert into users (full_name, email, role, timezone) values
    ('Ajdin Dinalic', 'ajdindinalic@gmail.com', 'ADMIN',    'America/New_York'),
    ('Ajdin Djinalic',  'ajdin.dinalic@gmail.com',  'OPERATOR', 'Europe/London');

insert into locations (name) values ('US East'), ('London'), ('US West'), ('Global'), ('Frankfurt');

insert into networks (name, cidr, vlan_id, vlan_name, gateway, dns_servers, location_id) values
    ('Production Network', '10.24.0.0/16',    100, 'PRODUCTION',     '10.24.0.1',   '{10.10.0.10}', (select id from locations where name = 'US East')),
    ('Corporate LAN',      '172.16.10.0/24',  210, 'CORPORATE',      '172.16.10.1', '{10.10.0.10}', (select id from locations where name = 'London')),
    ('Development',        '10.32.0.0/20',    120, 'DEVELOPMENT',    '10.32.0.1',   '{10.10.0.10}', (select id from locations where name = 'US West')),
    ('Guest Wireless',     '192.168.50.0/24', 400, 'GUEST',          '192.168.50.1','{10.10.0.10}', (select id from locations where name = 'Global')),
    ('Infrastructure',     '10.10.0.0/22',     10, 'INFRASTRUCTURE', '10.10.0.1',   '{10.10.0.10}', (select id from locations where name = 'Frankfurt'));

-- Allocate the first N host addresses of every demo network (51,118 + 162 + 1,721 + 231 + 358 rows).
insert into ip_addresses (network_id, address, state, assignment_type, last_seen)
select n.id,
       s.base + g,
       'OCCUPIED',
       case when g <= 99 then 'STATIC' else 'DHCP' end,
       now() - (g % 600) * interval '1 second'
from (values
        ('Production Network', '10.24.0.0'::inet,    51118),
        ('Corporate LAN',      '172.16.10.0'::inet,    162),
        ('Development',        '10.32.0.0'::inet,     1721),
        ('Guest Wireless',     '192.168.50.0'::inet,   231),
        ('Infrastructure',     '10.10.0.0'::inet,      358)
     ) as s(net_name, base, cnt)
join networks n on n.name = s.net_name
cross join lateral generate_series(1, s.cnt) as g;

update ip_addresses
   set state = 'RESERVED', assignment_type = 'STATIC', hostname = 'gateway'
 where network_id = (select id from networks where name = 'Guest Wireless') and address = '192.168.50.1';

update ip_addresses
   set state = 'CONFLICT', assignment_type = null
 where network_id = (select id from networks where name = 'Guest Wireless') and address = '192.168.50.73';

insert into devices (name, type, mac, port_name, port_mode, vlan_id, status, last_seen) values
    ('SW1',    'SWITCH',      '00:1B:44:11:3A:B7', 'Gi0/1',  'TRUNK',  null, 'ONLINE',  now()),
    ('RTR1',   'ROUTER',      'B4:2E:99:0C:11:28', 'Gi0/0',  'ROUTED', null, 'ONLINE',  now()),
    ('SRV1',    'SERVER',      '3C:52:82:91:AA:10', 'Gi0/18', 'ACCESS', 100,  'ONLINE',  now()),
    ('PC1', 'WORKSTATION', '84:7B:EB:42:11:CF', 'Gi0/22', 'ACCESS', 210,  'OFFLINE', now() - interval '2 hours');

update ip_addresses i
   set device_id = d.id, hostname = d.name, assignment_type = 'STATIC'
  from (values ('Core-SW-01', '10.10.0.2'), ('Edge-RTR-01', '10.10.0.1'),
               ('APP-SRV-04', '10.24.12.44'), ('FINANCE-WS-18', '172.16.10.87')) as m(dev, ip)
  join devices d on d.name = m.dev
 where i.address = cast(m.ip as inet);

insert into alert_rules (rule_key, label, description, enabled, threshold) values
    ('GATEWAY_REACHABILITY', 'Gateway reachability',   'Alert when a gateway stops answering probes',          true, null),
    ('CAPACITY_THRESHOLD',   'Capacity above',         'Alert when subnet utilisation exceeds the threshold',  true, 90),
    ('ROGUE_IP',             'Rogue IP detected',      'Alert when an unregistered host appears on a subnet',  true, null),
    ('CONFIG_CHANGE',        'Configuration changes',  'Alert when a configuration push is queued or applied', true, null);

insert into alerts (type, severity, message, network_id, device_id, address, created_at) values
    ('CAPACITY',       'WARNING',  'Guest Wireless is at 91% capacity',
        (select id from networks where name = 'Guest Wireless'), null, null, now() - interval '35 minutes'),
    ('ROGUE_IP',       'CRITICAL', 'Unregistered host detected on 192.168.50.73',
        (select id from networks where name = 'Guest Wireless'), null, '192.168.50.73', now() - interval '8 minutes'),
    ('DEVICE_OFFLINE', 'WARNING',  'FINANCE-WS-18 is not responding to ping',
        null, (select id from devices where name = 'FINANCE-WS-18'), '172.16.10.87', now() - interval '2 hours');

insert into health_checks (label, target_ip, device_id, status, latency_ms) values
    ('Core gateway',        '10.10.0.1',     (select id from devices where name = 'Edge-RTR-01'),    'ONLINE',  2),
    ('Production gateway',  '10.24.0.1',     null,                                                   'ONLINE',  8),
    ('Finance workstation', '172.16.10.87',  (select id from devices where name = 'FINANCE-WS-18'),  'OFFLINE', null),
    ('Unknown device',      '192.168.50.73', null,                                                   'ROGUE',   4);

insert into audit_log (actor_id, category, action, description, created_at) values
    ((select id from users where full_name = 'Alex Morgan'), 'IP_ALLOCATION', 'IP_RESERVED',      'Reserved 10.24.12.48 for APP-SRV-05',       now() - interval '2 minutes'),
    (null,                                                    'SECURITY',      'ROGUE_DETECTED',   'Detected unregistered host 192.168.50.73',  now() - interval '8 minutes'),
    ((select id from users where full_name = 'Jamie Chen'),  'NETWORK',       'DHCP_SCOPE_UPDATED','Updated VLAN 210 DHCP scope',              now() - interval '42 minutes'),
    ((select id from users where full_name = 'Alex Morgan'), 'AUTOMATION',    'CONFIG_PUSHED',    'Pushed configuration to Core-SW-01',        now() - interval '1 hour');

insert into network_utilization_snapshots (network_id, captured_at, used_addresses)
select u.network_id,
       now() - (11 - i) * interval '60 hours',
       round(u.used_addresses * (0.65 + 0.35 * i / 11.0))
from v_network_utilization u
cross join generate_series(0, 11) as i;
