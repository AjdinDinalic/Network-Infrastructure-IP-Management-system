import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";

export function SessionCard() {
  const { notify } = useToast();
  return (
    <Card className="border-rose-200">
      <h2 className="font-semibold text-rose-700">Session</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Sign out of NIIPM on this device. Unsaved changes will be discarded.</p>
      <Button variant="danger" className="mt-5 w-full" onClick={() => notify("Sign-in isn't set up yet, so there's nothing to log out of")}>Log out</Button>
    </Card>
  );
}
