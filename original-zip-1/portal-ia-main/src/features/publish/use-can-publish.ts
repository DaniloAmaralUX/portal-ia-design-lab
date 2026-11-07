import { useSyncExternalStore } from "react";
import { useAccount } from "@/hooks/use-account";
import { accountLoaded, subscribeToAccount } from "@/lib/account";

export type PublishAccess = "checking" | "allowed" | "denied";

export function useCanPublish(): PublishAccess {
  const account = useAccount();
  const loaded = useSyncExternalStore(subscribeToAccount, accountLoaded, () => false);
  if (!loaded) return "checking";
  return account?.canPublish ? "allowed" : "denied";
}
