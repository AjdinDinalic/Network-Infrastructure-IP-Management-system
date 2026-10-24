package com.niipm.repository;

import com.niipm.api.Dto.CreateDevice;
import com.niipm.api.Dto.DeviceView;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class DeviceRepository {

    private final JdbcClient jdbc;

    public DeviceRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<DeviceView> list() {
        return jdbc.sql("""
                select d.id, d.name, d.type, host(i.address) as ip_address, d.mac::text as mac,
                       d.port_name, d.port_mode, d.vlan_id, d.status, d.last_seen
                from devices d
                left join lateral (
                    select address from ip_addresses where device_id = d.id order by address limit 1
                ) i on true
                order by d.name
                """)
                .query(DeviceView.class)
                .list();
    }

    @Transactional
    public long create(CreateDevice r) {
        long id = jdbc.sql("""
                insert into devices (name, type, mac, port_name, port_mode, vlan_id)
                values (:name, :type, cast(:mac as macaddr), :portName, :portMode, :vlanId)
                returning id
                """)
                .param("name", r.name().trim())
                .param("type", r.type().trim().toUpperCase())
                .param("mac", blankToNull(r.mac()))
                .param("portName", blankToNull(r.portName()))
                .param("portMode", r.portMode() == null ? null : blankToNull(r.portMode().toUpperCase()))
                .param("vlanId", r.vlanId())
                .query(Long.class)
                .single();

        String ip = blankToNull(r.ipAddress());
        if (ip != null) {
            int rows = jdbc.sql("""
                    insert into ip_addresses (network_id, address, state, assignment_type, hostname, device_id)
                    select n.id, cast(:ip as inet), 'OCCUPIED', 'STATIC', cast(:name as text), cast(:deviceId as bigint)
                    from networks n
                    where cast(:ip as inet) <<= n.cidr
                    on conflict (network_id, address) do update
                        set device_id = excluded.device_id, hostname = excluded.hostname,
                            state = 'OCCUPIED', assignment_type = 'STATIC'
                    """)
                    .param("ip", ip)
                    .param("name", r.name().trim())
                    .param("deviceId", id)
                    .update();
            if (rows == 0) {
                throw new IllegalArgumentException("No network contains " + ip + ".");
            }
        }
        return id;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
