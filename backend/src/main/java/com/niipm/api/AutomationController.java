package com.niipm.api;

import com.niipm.api.Dto.ConfigJob;
import com.niipm.api.Dto.ConfigPreview;
import com.niipm.api.Dto.ConfigRequest;
import com.niipm.service.AutomationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/automation")
public class AutomationController {

    private final AutomationService automation;

    public AutomationController(AutomationService automation) {
        this.automation = automation;
    }

    @PostMapping("/preview")
    public ConfigPreview preview(@Valid @RequestBody ConfigRequest request) {
        return automation.preview(request);
    }

    @PostMapping("/jobs")
    @ResponseStatus(HttpStatus.CREATED)
    public ConfigJob queue(@Valid @RequestBody ConfigRequest request) {
        return automation.queue(request);
    }
}
