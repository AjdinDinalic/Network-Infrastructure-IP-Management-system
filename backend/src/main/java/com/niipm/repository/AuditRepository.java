package com.niipm.repository;

import com.niipm.api.Dto.AuditView;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AuditRepository {

    private final JdbcClient jdbc;

    public AuditRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public void log(Long actorId, String category, String action, String description, String entityType, Long entityId) {
        jdbc.sql("""
                insert into audit_log (actor_id, category, action, description, entity_type, entity_id)
                values (:actorId, :category, :action, :description, :entityType, :entityId)
                """)
                .param("actorId", actorId)
                .param("category", category)
                .param("action", action)
                .param("description", description)
                .param("entityType", entityType)
                .param("entityId", entityId)
                .update();
    }

    public List<AuditView> recent(String category, int limit) {
        return jdbc.sql("""
                select a.id, coalesce(u.full_name, 'System') as actor, a.category, a.action, a.description, a.created_at
                from audit_log a
                left join users u on u.id = a.actor_id
                where cast(:category as text) is null or a.category = cast(:category as text)
                order by a.created_at desc, a.id desc
                limit :limit
                """)
                .param("category", category)
                .param("limit", limit)
                .query(AuditView.class)
                .list();
    }
}
