import { AccountCard } from "@/components/settings/AccountCard";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PasswordForm } from "@/components/settings/PasswordForm";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { SessionCard } from "@/components/settings/SessionCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function SettingsPage() {
  const { user, loading, error } = useCurrentUser();
  return (
    <>
      <PageHeader title="Settings" description="Manage, automate, and audit your network infrastructure from one workspace." />
      {!user ? (
        loading ? <LoadingState /> : <ErrorState error={error ?? new Error("Could not load your profile.")} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <ProfileForm user={user} />
            <PasswordForm />
          </div>
          <div className="space-y-5">
            <NotificationSettings user={user} />
            <SessionCard />
            <AccountCard />
          </div>
        </div>
      )}
    </>
  );
}
