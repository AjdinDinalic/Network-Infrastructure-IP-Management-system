package com.niipm.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.List;

public final class Dto {

    private Dto() {}

    // ---------- responses ----------
    public record NetworkView(long id, String name, String cidr, int vlanId, String vlanName, String gateway,
                              String location, long totalAddresses, long usedAddresses, int utilizationPct,
                              String status) {}

    public record IpView(String address, String state, String assignmentType, String hostname, String deviceName,
                         OffsetDateTime lastSeen) {}

    public record DeviceView(long id, String name, String type, String ipAddress, String mac, String portName,
                             String portMode, Integer vlanId, String status, OffsetDateTime lastSeen) {}

    public record AlertView(long id, String type, String severity, String status, String message,
                            OffsetDateTime createdAt) {}

    public record AlertRuleView(String key, String label, boolean enabled, Integer threshold) {}

    public record HealthView(String label, String targetIp, String status, Integer latencyMs,
                             OffsetDateTime checkedAt) {}

    public record AuditView(long id, String actor, String category, String action, String description,
                            OffsetDateTime createdAt) {}

    public record DashboardTotals(long totalAddresses, long allocatedAddresses, long activeNetworks,
                                  long networksAdded30d, long onlineDevices, long totalDevices, long openAlerts,
                                  long criticalAlerts) {}

    public record SeriesPoint(OffsetDateTime capturedDay, long used) {}

    public record DashboardView(DashboardTotals totals, List<SeriesPoint> series) {}

    public record UserView(long id, String fullName, String email, String role, String timezone,
                           boolean notifyCapacity, boolean notifySecurity) {}

    public record OverlapResult(boolean overlaps, String with) {}

    public record ConfigPreview(String config, int lineCount) {}

    public record ConfigJob(long jobId, String status) {}

    // ---------- requests ----------
    public record CreateNetwork(@NotBlank String name, @NotBlank String cidr, @Min(1) @Max(4094) int vlanId,
                                @NotBlank String vlanName, String gateway, @NotBlank String location) {}

    public record ReserveIp(@NotBlank String address, String hostname) {}

    public record CreateDevice(@NotBlank String name, @NotBlank String type, String mac, String portName,
                               String portMode, Integer vlanId, String ipAddress) {}

    public record UpdateRule(boolean enabled, Integer threshold) {}

    public record UpdateUser(@NotBlank String fullName, @NotBlank @Email String email, @NotBlank String timezone,
                             boolean notifyCapacity, boolean notifySecurity) {}

    public record ConfigRequest(@NotNull Long networkId, Integer vlanId, String vlanName, String gateway,
                                Long deviceId, String interfaceName) {}
}
