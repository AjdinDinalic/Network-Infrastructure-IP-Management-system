import { DeviceTable } from "@/components/devices/DeviceTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { QueryBoundary } from "@/components/ui/States";
import { useDevices } from "@/hooks/useDevices";

export default function DevicesPage() {
  const devices = useDevices();
  return (
    <>
      <PageHeader title="Devices" description="Manage, automate, and audit your network infrastructure from one workspace." />
      <QueryBoundary query={devices}>{(items) => <DeviceTable devices={items} />}</QueryBoundary>
    </>
  );
}
