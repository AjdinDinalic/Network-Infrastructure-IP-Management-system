package com.niipm.repository;

import com.niipm.api.Dto.IpView;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class IpRepository {

    private final JdbcClient jdbc;

    public IpRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }


    public List<IpView> list(long networkId, String within, int limit) {
        return jdbc.sql("""
                select host(i.address) as address, i.state, i.assignment_type, i.hostname,
                       d.name as device_name, i.last_seen
                from ip_addresses i
                left join devices d on d.id = i.device_id
                where i.network_id = :networkId
                  and (cast(:within as cidr) is null or i.address <<= cast(:within as cidr))
                order by i.address
                limit :limit
                """)
                .param("networkId", networkId)
                .param("within", within)
                .param("limit", limit)
                .query(IpView.class)
                .list();
    }

    public void reserve(long networkId, String address, String hostname, long actorId) {
        jdbc.sql("""
                insert into ip_addresses (network_id, address, state, assignment_type, hostname, reserved_by)
                values (:networkId, cast(:address as inet), 'RESERVED', 'STATIC', :hostname, :actorId)
                """)
                .param("networkId", networkId)
                .param("address", address)
                .param("hostname", hostname == null || hostname.isBlank() ? null : hostname.trim())
                .param("actorId", actorId)
                .update();
    }

    public void release(long networkId, String address) {
        int rows = jdbc.sql("""
                delete from ip_addresses
                where network_id = :networkId and address = cast(:address as inet)
                  and state = 'RESERVED' and device_id is null
                """)
                .param("networkId", networkId)
                .param("address", address)
                .update();
        if (rows == 0) {
            throw new IllegalArgumentException("Only reserved addresses that are not assigned to a device can be released.");
        }
    }
}
