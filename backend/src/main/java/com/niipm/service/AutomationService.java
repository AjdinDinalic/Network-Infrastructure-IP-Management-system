package com.niipm.service;

import com.niipm.api.Dto.ConfigJob;
import com.niipm.api.Dto.ConfigPreview;
import com.niipm.api.Dto.ConfigRequest;
import com.niipm.config.Actor;
import com.niipm.repository.AuditRepository;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;


@Service
public class AutomationService {

    private static final Pattern IPV4 =
            Pattern.compile("^((25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1?\\d?\\d)$");
    private static final Pattern VLAN_NAME = Pattern.compile("^[A-Za-z0-9_-]{1,32}$");
    private static final Pattern INTERFACE = Pattern.compile("^[A-Za-z0-9/._-]{1,40}$");

    record Source(int vlanId, String vlanName, String gateway, String cidr, String dns) {}

    private final JdbcClient jdbc;
    private final AuditRepository audit;
    private final Actor actor;

    public AutomationService(JdbcClient jdbc, AuditRepository audit, Actor actor) {
        this.jdbc = jdbc;
        this.audit = audit;
        this.actor = actor;
    }

    public ConfigPreview preview(ConfigRequest request) {
        List<String> lines = render(request);
        return new ConfigPreview(String.join("\n", lines), lines.size());
    }

    @Transactional
    public ConfigJob queue(ConfigRequest request) {
        if (request.deviceId() == null) {
            throw new IllegalArgumentException("deviceId is required to queue a configuration push.");
        }
        List<String> lines = render(request);
        String iface = interfaceOf(request);

        long id = jdbc.sql("""
                insert into config_jobs (network_id, device_id, interface_name, config_text, status, requested_by)
                values (:networkId, :deviceId, :iface, :config, 'QUEUED', :actorId)
                returning id
                """)
                .param("networkId", request.networkId())
                .param("deviceId", request.deviceId())
                .param("iface", iface)
                .param("config", String.join("\n", lines))
                .param("actorId", actor.id())
                .query(Long.class)
                .single();

        audit.log(actor.id(), "AUTOMATION", "CONFIG_QUEUED",
                "Queued configuration push (job #" + id + ")", "config_job", id);
        return new ConfigJob(id, "QUEUED");
    }

    private List<String> render(ConfigRequest r) {
        Source s = jdbc.sql("""
                select vlan_id, vlan_name, host(gateway) as gateway, cidr::text as cidr,
                       array_to_string(dns_servers, ' ') as dns
                from networks where id = :id
                """)
                .param("id", r.networkId())
                .query(Source.class)
                .optional()
                .orElseThrow(() -> new NoSuchElementException("Network " + r.networkId() + " not found."));

        int vlan = r.vlanId() != null ? r.vlanId() : s.vlanId();
        if (vlan < 1 || vlan > 4094) {
            throw new IllegalArgumentException("VLAN ID must be between 1 and 4094.");
        }
        String name = firstNonBlank(r.vlanName(), s.vlanName());
        if (name == null || !VLAN_NAME.matcher(name).matches()) {
            throw new IllegalArgumentException("VLAN name may only contain letters, digits, '-' and '_' (max 32).");
        }
        String gateway = firstNonBlank(r.gateway(), s.gateway());
        if (gateway == null || !IPV4.matcher(gateway).matches()) {
            throw new IllegalArgumentException("Enter a valid IPv4 gateway address.");
        }
        String iface = interfaceOf(r);

        String[] cidr = s.cidr().split("/");
        String networkAddress = cidr[0];
        String mask = maskOf(Integer.parseInt(cidr[1]));

        List<String> lines = new ArrayList<>(List.of(
                "vlan " + vlan,
                " name " + name,
                "!",
                "interface " + iface,
                " switchport mode access",
                " switchport access vlan " + vlan,
                " spanning-tree portfast",
                "!",
                "interface Vlan" + vlan,
                " description " + name + "_GATEWAY",
                " ip address " + gateway + " " + mask,
                " no shutdown",
                "!",
                "ip dhcp pool " + name,
                " network " + networkAddress + " " + mask,
                " default-router " + gateway));
        if (s.dns() != null && !s.dns().isBlank()) {
            lines.add(" dns-server " + s.dns().trim());
        }
        return lines;
    }

    private static String interfaceOf(ConfigRequest r) {
        String iface = firstNonBlank(r.interfaceName(), "GigabitEthernet0/1");
        if (!INTERFACE.matcher(iface).matches()) {
            throw new IllegalArgumentException("Invalid interface name.");
        }
        return iface;
    }

    private static String firstNonBlank(String preferred, String fallback) {
        return preferred != null && !preferred.isBlank() ? preferred.trim() : fallback;
    }

    static String maskOf(int prefix) {
        long mask = prefix == 0 ? 0 : (0xFFFFFFFFL << (32 - prefix)) & 0xFFFFFFFFL;
        return ((mask >> 24) & 255) + "." + ((mask >> 16) & 255) + "." + ((mask >> 8) & 255) + "." + (mask & 255);
    }
}
