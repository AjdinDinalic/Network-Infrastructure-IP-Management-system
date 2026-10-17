import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listIps, releaseIp, reserveIp } from "@/api/networks";
import { AddressPlan } from "@/components/ip/AddressPlan";
import { IpDetails } from "@/components/ip/IpDetails";
import { IpMatrix } from "@/components/ip/IpMatrix";
import { Field, inputClass } from "@/components/ui/Field";
import { PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState, QueryBoundary } from "@/components/ui/States";
import { useAsync } from "@/hooks/useAsync";
import { useNetworks } from "@/hooks/useNetworks";
import { useToast } from "@/hooks/useToast";
import { blocksOf, buildCells } from "@/lib/ip";
import type { Network } from "@/types";

function Matrix({ network }: { network: Network }) {
  const { notify } = useToast();
  const blocks = useMemo(() => blocksOf(network.cidr), [network.cidr]);
  const [chosenBlock, setBlock] = useState<string>();
  const block = chosenBlock && blocks.includes(chosenBlock) ? chosenBlock : blocks[0]!;
  const [selected, setSelected] = useState(1);
  const [busy, setBusy] = useState(false);
  const ips = useAsync((signal) => listIps(network.id, block, signal), [network.id, block]);

  const cells = useMemo(() => buildCells(block, network.cidr, ips.data ?? []), [block, network.cidr, ips.data]);
  const cell = cells[selected]!;
  const record = ips.data?.find((r) => r.address === cell.address);

  async function run(action: () => Promise<unknown>, done: string) {
    setBusy(true);
    try {
      await action();
      notify(done);
      ips.refetch();
    } catch (error) {
      notify((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <IpMatrix
        title={`${block} · ${network.name}`}
        cells={cells}
        selected={selected}
        onSelect={setSelected}
        toolbar={
          blocks.length > 1 && (
            <Field label="/24 block" className="mt-4 max-w-xs">
              <select value={block} onChange={(e) => setBlock(e.target.value)} className={inputClass}>
                {blocks.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
          )
        }
      >
        {ips.error && <div className="mt-4"><ErrorState error={ips.error} onRetry={ips.refetch} /></div>}
        {ips.loading && <LoadingState label="Loading addresses…" />}
        {!ips.error && !ips.loading && (
          <IpDetails
            cell={cell}
            record={record}
            busy={busy}
            onReserve={() => run(() => reserveIp(network.id, cell.address), `${cell.address} reserved`)}
            onRelease={() => run(() => releaseIp(network.id, cell.address), `${cell.address} released`)}
          />
        )}
      </IpMatrix>
      <AddressPlan />
    </>
  );
}

export default function IpAddressesPage() {
  const networks = useNetworks();
  const [params, setParams] = useSearchParams();

  return (
    <>
      <PageHeader title="IP addresses" description="Manage, automate, and audit your network infrastructure from one workspace." />
      <QueryBoundary query={networks}>
        {(items) => {
          const current = items.find((n) => String(n.id) === params.get("network")) ?? items[0];
          if (!current) return <p className="text-sm text-slate-500">Create a network first to see its address matrix.</p>;
          return (
            <>
              <Field label="Network" className="mb-4 max-w-sm">
                <select value={current.id} onChange={(e) => setParams({ network: e.target.value })} className={inputClass}>
                  {items.map((n) => <option key={n.id} value={n.id}>{n.name} · {n.cidr}</option>)}
                </select>
              </Field>
              <Matrix key={current.id} network={current} />
            </>
          );
        }}
      </QueryBoundary>
    </>
  );
}
