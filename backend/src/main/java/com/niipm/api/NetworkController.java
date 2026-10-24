package com.niipm.api;

import com.niipm.api.Dto.CreateNetwork;
import com.niipm.api.Dto.IpView;
import com.niipm.api.Dto.NetworkView;
import com.niipm.api.Dto.OverlapResult;
import com.niipm.api.Dto.ReserveIp;
import com.niipm.config.Actor;
import com.niipm.repository.AuditRepository;
import com.niipm.repository.IpRepository;
import com.niipm.repository.NetworkRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/networks")
public class NetworkController {

    private final NetworkRepository networks;
    private final IpRepository ips;
    private final AuditRepository audit;
    private final Actor actor;

    public NetworkController(NetworkRepository networks, IpRepository ips, AuditRepository audit, Actor actor) {
        this.networks = networks;
        this.ips = ips;
        this.audit = audit;
        this.actor = actor;
    }

    @GetMapping
    public List<NetworkView> list(@RequestParam(required = false) String q,
                                  @RequestParam(required = false) String status) {
        return networks.search(q, status);
    }

    @GetMapping("/{id}")
    public NetworkView get(@PathVariable long id) {
        return networks.find(id).orElseThrow(() -> new NoSuchElementException("Network " + id + " not found."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NetworkView create(@Valid @RequestBody CreateNetwork request) {
        long id = networks.create(request);
        audit.log(actor.id(), "NETWORK", "NETWORK_CREATED",
                "Created network " + request.name() + " (" + request.cidr() + ")", "network", id);
        return get(id);
    }

    @GetMapping("/check-overlap")
    public OverlapResult checkOverlap(@RequestParam String cidr) {
        return networks.findOverlap(cidr.trim())
                .map(existing -> new OverlapResult(true, existing))
                .orElse(new OverlapResult(false, null));
    }

    @GetMapping("/{id}/ips")
    public List<IpView> listIps(@PathVariable long id,
                                @RequestParam(required = false) String within,
                                @RequestParam(defaultValue = "512") int limit) {
        get(id);
        return ips.list(id, within == null || within.isBlank() ? null : within.trim(), Math.max(1, Math.min(limit, 2048)));
    }

    @PostMapping("/{id}/ips/reserve")
    @ResponseStatus(HttpStatus.CREATED)
    public IpView reserve(@PathVariable long id, @Valid @RequestBody ReserveIp request) {
        get(id);
        String address = request.address().trim();
        ips.reserve(id, address, request.hostname(), actor.id());
        audit.log(actor.id(), "IP_ALLOCATION", "IP_RESERVED", "Reserved " + address, "network", id);
        return ips.list(id, address + "/32", 1).get(0); // IPv4 only
    }

    @DeleteMapping("/{id}/ips/{address}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void release(@PathVariable long id, @PathVariable String address) {
        ips.release(id, address);
        audit.log(actor.id(), "IP_ALLOCATION", "IP_RELEASED", "Released " + address, "network", id);
    }
}
