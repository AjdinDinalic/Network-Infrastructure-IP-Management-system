import { createContext, useCallback, useState, type ReactNode } from "react";
import { getUser, updateUser } from "@/api/users";
import { CURRENT_USER_ID } from "@/config/navigation";
import { useAsync } from "@/hooks/useAsync";
import type { User, UserUpdate } from "@/types";

interface CurrentUserApi {
  user?: User;
  loading: boolean;
  error?: Error;
  /** Merges `patch` into the profile and persists it. */
  save: (patch: Partial<UserUpdate>) => Promise<void>;
}

export const CurrentUserContext = createContext<CurrentUserApi | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const query = useAsync((signal) => getUser(CURRENT_USER_ID, signal), []);
  const [saved, setSaved] = useState<User>();
  const user = saved ?? query.data;

  const save = useCallback(
    async (patch: Partial<UserUpdate>) => {
      if (!user) return;
      const { fullName, email, timezone, notifyCapacity, notifySecurity } = { ...user, ...patch };
      setSaved(await updateUser(user.id, { fullName, email, timezone, notifyCapacity, notifySecurity }));
    },
    [user],
  );

  return (
    <CurrentUserContext.Provider value={{ user, loading: query.loading && !user, error: query.error, save }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
