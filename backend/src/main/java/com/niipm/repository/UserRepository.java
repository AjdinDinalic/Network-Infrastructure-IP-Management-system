package com.niipm.repository;

import com.niipm.api.Dto.UpdateUser;
import com.niipm.api.Dto.UserView;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcClient jdbc;

    public UserRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public Optional<UserView> find(long id) {
        return jdbc.sql("""
                select id, full_name, email, role, timezone, notify_capacity, notify_security
                from users where id = :id
                """)
                .param("id", id)
                .query(UserView.class)
                .optional();
    }

    public int update(long id, UpdateUser r) {
        return jdbc.sql("""
                update users
                   set full_name = :fullName, email = :email, timezone = :timezone,
                       notify_capacity = :notifyCapacity, notify_security = :notifySecurity
                 where id = :id
                """)
                .param("id", id)
                .param("fullName", r.fullName().trim())
                .param("email", r.email().trim())
                .param("timezone", r.timezone())
                .param("notifyCapacity", r.notifyCapacity())
                .param("notifySecurity", r.notifySecurity())
                .update();
    }
}
