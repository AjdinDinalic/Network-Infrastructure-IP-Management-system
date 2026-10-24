package com.niipm.api;

import com.niipm.api.Dto.AlertRuleView;
import com.niipm.api.Dto.AlertView;
import com.niipm.api.Dto.AuditView;
import com.niipm.api.Dto.HealthView;
import com.niipm.api.Dto.UpdateRule;
import com.niipm.config.Actor;
import com.niipm.repository.AuditRepository;
import com.niipm.repository.OperationsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OperationsController {

    private final OperationsRepository operations;
    private final AuditRepository audit;
    private final Actor actor;

    public OperationsController(OperationsRepository operations, AuditRepository audit, Actor actor) {
        this.operations = operations;
        this.audit = audit;
        this.actor = actor;
    }

    @GetMapping("/alerts")
    public List<AlertView> alerts(@RequestParam(required = false) String status) {
        return operations.alerts(status);
    }

    @PostMapping("/alerts/{id}/resolve")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resolve(@PathVariable long id) {
        operations.resolve(id, actor.id());
        audit.log(actor.id(), "SECURITY", "ALERT_RESOLVED", "Resolved alert #" + id, "alert", id);
    }

    @GetMapping("/alert-rules")
    public List<AlertRuleView> rules() {
        return operations.rules();
    }

    @PutMapping("/alert-rules/{key}")
    public List<AlertRuleView> updateRule(@PathVariable String key, @RequestBody UpdateRule request) {
        operations.updateRule(key, request.enabled(), request.threshold());
        audit.log(actor.id(), "SECURITY", "ALERT_RULE_UPDATED", "Updated alert rule " + key, "alert_rule", null);
        return operations.rules();
    }

    @GetMapping("/monitoring/health")
    public List<HealthView> health() {
        return operations.latestHealth();
    }

    @GetMapping("/audit")
    public List<AuditView> audit(@RequestParam(required = false) String category,
                                 @RequestParam(defaultValue = "50") int limit) {
        return audit.recent(category == null || category.isBlank() ? null : category.toUpperCase(),
                Math.max(1, Math.min(limit, 500)));
    }
}
