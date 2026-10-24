package com.niipm.api;

import com.niipm.api.Dto.DashboardView;
import com.niipm.repository.DashboardRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardRepository dashboard;

    public DashboardController(DashboardRepository dashboard) {
        this.dashboard = dashboard;
    }

    @GetMapping
    public DashboardView get(@RequestParam(defaultValue = "30") int days) {
        return new DashboardView(dashboard.totals(), dashboard.series(Math.max(1, Math.min(days, 365))));
    }
}
