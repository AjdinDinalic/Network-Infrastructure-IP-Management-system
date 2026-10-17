import { useEffect, useMemo, useState } from "react";
import { previewConfig, queueConfigJob } from "@/api/automation";
import { ConfigForm } from "@/components/automation/ConfigForm";
import { ConfigPreview } from "@/components/automation/ConfigPreview";
import { PageHeader } from "@/components/ui/PageHeader";
import { QueryBoundary } from "@/components/ui/States";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { useDevices } from "@/hooks/useDevices";
import { useNetworks } from "@/hooks/useNetworks";
import { useToast } from "@/hooks/useToast";
import type { Device, Network } from "@/types";

function Generator({ networks, devices }: { networks: Network[]; devices: Device[] }) {
  const { notify } = useToast();
  const targets = useMemo(() => devices.filter((d) => d.type === "SWITCH" || d.type === "ROUTER"), [devices]);
  const [networkId, setNetworkId] = useState<number | undefined>(networks[0]?.id);
  const [deviceId, setDeviceId] = useState<number | undefined>(targets[0]?.id);
  const [vlan, setVlan] = useState("");
  const [vlanName, setVlanName] = useState("");
  const [gateway, setGateway] = useState("");
  const [queueing, setQueueing] = useState(false);

  // Prefill the editable fields from the selected network.
  useEffect(() => {
    const n = networks.find((item) => item.id === networkId);
    if (n) { setVlan(String(n.vlanId)); setVlanName(n.vlanName); setGateway(n.gateway ?? ""); }
  }, [networkId, networks]);

  const dVlan = useDebounce(vlan, 300);
  const dName = useDebounce(vlanName, 300);
  const dGateway = useDebounce(gateway, 300);
  const request = { networkId: networkId!, vlanId: Number(dVlan), vlanName: dName, gateway: dGateway || undefined };
  const preview = useAsync((signal) => (networkId ? previewConfig(request, signal) : Promise.resolve(undefined)), [networkId, dVlan, dName, dGateway]);

  async function queue() {
    if (!networkId || !deviceId) return;
    setQueueing(true);
    try {
      const job = await queueConfigJob({ ...request, vlanId: Number(vlan), vlanName, gateway: gateway || undefined, deviceId });
      notify(`Configuration job #${job.jobId} queued`);
    } catch (error) {
      notify((error as Error).message);
    } finally {
      setQueueing(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <ConfigForm
        networks={networks} networkId={networkId} onNetworkChange={setNetworkId}
        vlan={vlan} onVlan={setVlan} vlanName={vlanName} onVlanName={setVlanName} gateway={gateway} onGateway={setGateway}
        devices={targets} deviceId={deviceId} onDeviceChange={setDeviceId} onQueue={queue} queueing={queueing}
      />
      <ConfigPreview
        config={preview.data?.config}
        lineCount={preview.data?.lineCount}
        error={preview.error}
        loading={preview.loading}
        onCopy={() => { navigator.clipboard?.writeText(preview.data?.config ?? ""); notify("CLI copied to clipboard"); }}
      />
    </div>
  );
}

export default function AutomationPage() {
  const networks = useNetworks();
  const devices = useDevices();
  return (
    <>
      <PageHeader title="Automation" description="Manage, automate, and audit your network infrastructure from one workspace." />
      <QueryBoundary query={networks}>
        {(n) => <QueryBoundary query={devices}>{(d) => <Generator networks={n} devices={d} />}</QueryBoundary>}
      </QueryBoundary>
    </>
  );
}
