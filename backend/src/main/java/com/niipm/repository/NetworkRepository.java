package com.niipm.repository;

import com.niipm.api.Dto.CreateNetwork;
import com.niipm.api.Dto.NetworkView;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class NetworkRepository {

    private static final String SELECT = """
            select n.id, n.name, n.cidr::text as cidr, n.vlan_id, n.vlan_name, host(n.gateway) as gateway,
                   l.name as location, u.total_addresses, u.used_addresses, u.utilization_pct, u.status
            from networks n
            join locations l on l.id = n.location_id
            join v_network_utilization u on u.network_id = n.id
            """;

    private final JdbcClient jdbc;

    public NetworkRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<NetworkView> search(String q, String status) {
        return jdbc.sql(SELECT + """
                where (cast(:status as text) is null or u.status = cast(:status as text))
                  and (cast(:q as text) is null
                       or concat_ws(' ', n.name, n.cidr::text, 'VLAN ' || n.vlan_id, l.name) ilike '%' || cast(:q as text) || '%')
                order by n.name
                """)
                .param("q", blankToNull(q))
                .param("status", blankToNull(status))
                .query(NetworkView.class)
                .list();
    }

    public Optional<NetworkView> find(long id) {
        return jdbc.sql(SELECT + " where n.id = :id")
                .param("id", id)
                .query(NetworkView.class)
                .optional();
    }

    @Transactional
    public long create(CreateNetwork r) {
        long locationId = jdbc.sql("""
                insert into locations (name) values (:name)
                on conflict (name) do update set name = excluded.name
                returning id
                """)
                .param("name", r.location().trim())
                .query(Long.class)
                .single();

        return jdbc.sql("""
                insert into networks (name, cidr, vlan_id, vlan_name, gateway, location_id)
                values (:name, cast(:cidr as cidr), :vlanId, :vlanName, cast(:gateway as inet), :locationId)
                returning id
                """)
                .param("name", r.name().trim())
                .param("cidr", r.cidr().trim())
                .param("vlanId", r.vlanId())
                .param("vlanName", r.vlanName().trim())
                .param("gateway", blankToNull(r.gateway()))
                .param("locationId", locationId)
                .query(Long.class)
                .single();
    }

    public Optional<String> findOverlap(String cidr) {
        return jdbc.sql("""
                select name || ' (' || cidr::text || ')'
                from networks
                where cidr && cast(:cidr as cidr)
                limit 1
                """)
                .param("cidr", cidr)
                .query(String.class)
                .optional();
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
