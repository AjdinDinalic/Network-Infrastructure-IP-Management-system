package com.niipm.repository;

import com.niipm.api.Dto.AlertRuleView;
import com.niipm.api.Dto.AlertView;
import com.niipm.api.Dto.HealthView;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.NoSuchElementException;

@Repository
public class OperationsRepository {

    private final JdbcClient jdbc;

    public OperationsRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<AlertView> alerts(String status) {
        return jdbc.sql("""
                select id, type, severity, status, message, created_at
                from alerts
                where cast(:status as text) is null or status = cast(:status as text)
                order by case severity when 'CRITICAL' then 0 when 'WARNING' then 1 else 2 end, created_at desc
                limit 200
                """)
                .param("status", status == null || status.isBlank() ? null : status.toUpperCase())
                .query(AlertView.class)
                .list();
    }

    public void resolve(long id, long actorId) {
        int rows = jdbc.sql("""
                update alerts set status = 'RESOLVED', resolved_at = now(), resolved_by = :actorId
                where id = :id and status <> 'RESOLVED'
                """)
                .param("id", id)
                .param("actorId", actorId)
                .update();
        if (rows == 0) {
            throw new NoSuchElementException("Alert " + id + " was not found or is already resolved.");
        }
    }

    public List<AlertRuleView> rules() {
        return jdbc.sql("select rule_key as key, label, enabled, threshold from alert_rules order by rule_key")
                .query(AlertRuleView.class)
                .list();
    }

    public void updateRule(String key, boolean enabled, Integer threshold) {
        int rows = jdbc.sql("update alert_rules set enabled = :enabled, threshold = :threshold where rule_key = :key")
                .param("key", key)
                .param("enabled", enabled)
                .param("threshold", threshold)
                .update();
        if (rows == 0) {
            throw new NoSuchElementException("Alert rule " + key + " not found.");
        }
    }

    public List<HealthView> latestHealth() {
        return jdbc.sql("""
                select label, target_ip, status, latency_ms, checked_at
                from (
                    select distinct on (target_ip)
                           label, host(target_ip) as target_ip, status, latency_ms, checked_at
                    from health_checks
                    order by target_ip, checked_at desc
                ) latest
                order by label
                """)
                .query(HealthView.class)
                .list();
    }
}
