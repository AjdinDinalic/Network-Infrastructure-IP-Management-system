package com.niipm.api;

import com.niipm.api.Dto.UpdateUser;
import com.niipm.api.Dto.UserView;
import com.niipm.config.Actor;
import com.niipm.repository.AuditRepository;
import com.niipm.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository users;
    private final AuditRepository audit;
    private final Actor actor;

    public UserController(UserRepository users, AuditRepository audit, Actor actor) {
        this.users = users;
        this.audit = audit;
        this.actor = actor;
    }

    @GetMapping("/{id}")
    public UserView get(@PathVariable long id) {
        return users.find(id).orElseThrow(() -> new NoSuchElementException("User " + id + " not found."));
    }

    @PutMapping("/{id}")
    public UserView update(@PathVariable long id, @Valid @RequestBody UpdateUser request) {
        if (users.update(id, request) == 0) {
            throw new NoSuchElementException("User " + id + " not found.");
        }
        audit.log(actor.id(), "ACCOUNT", "PROFILE_UPDATED", "Updated profile settings", "user", id);
        return get(id);
    }
}
