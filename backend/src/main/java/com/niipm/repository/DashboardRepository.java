package com.niipm.repository;

import com.niipm.api.Dto.DashboardTotals;
import com.niipm.api.Dto.SeriesPoint;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DashboardRepository {

    private final JdbcClient jdbc;

    public DashboardRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public DashboardTotals totals() {
        return jdbc.sql("""
                select
                    coalesce((select sum(total_addresses) from v_network_utilization), 0) as total_addresses,
                    coalesce((select sum(used_addresses) from v_network_utilization), 0)  as allocated_addresses,
                    (select count(*) from networks)                                       as active_networks,
                    (select count(*) from networks where created_at > now() - interval '30 days') as networks_added30d,
                    (select count(*) from devices where status = 'ONLINE')                as online_devices,
                    (select count(*) from devices)                                        as total_devices,
                    (select count(*) from alerts where status = 'OPEN')                   as open_alerts,
                    (select count(*) from alerts where status = 'OPEN' and severity = 'CRITICAL') as critical_alerts
                """)
                .query(DashboardTotals.class)
                .single();
    }

    public List<SeriesPoint> series(int days) {
        return jdbc.sql("""
                select date_trunc('day', captured_at) as captured_day, sum(used_addresses)::bigint as used
                from network_utilization_snapshots
                where captured_at >= now() - (:days * interval '1 day')
                group by 1
                order by 1
                """)
                .param("days", days)
                .query(SeriesPoint.class)
                .list();
    }
}
