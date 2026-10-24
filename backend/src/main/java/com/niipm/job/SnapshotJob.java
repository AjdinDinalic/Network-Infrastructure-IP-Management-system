package com.niipm.job;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SnapshotJob {

    private final JdbcClient jdbc;

    public SnapshotJob(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void capture() {
        jdbc.sql("""
                insert into network_utilization_snapshots (network_id, captured_at, used_addresses)
                select network_id, now(), used_addresses from v_network_utilization
                """).update();
    }
}
