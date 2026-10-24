package com.niipm.api;

import com.niipm.api.Dto.CreateDevice;
import com.niipm.api.Dto.DeviceView;
import com.niipm.config.Actor;
import com.niipm.repository.AuditRepository;
import com.niipm.repository.DeviceRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository devices;
    private final AuditRepository audit;
    private final Actor actor;

    public DeviceController(DeviceRepository devices, AuditRepository audit, Actor actor) {
        this.devices = devices;
        this.audit = audit;
        this.actor = actor;
    }

    @GetMapping
    public List<DeviceView> list() {
        return devices.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeviceView create(@Valid @RequestBody CreateDevice request) {
        long id = devices.create(request);
        audit.log(actor.id(), "DEVICE", "DEVICE_CREATED", "Registered device " + request.name(), "device", id);
        return devices.list().stream().filter(d -> d.id() == id).findFirst().orElseThrow();
    }
}
