import { useSyncExternalStore } from "react";
import { subscribeToAccount, currentAccount, type Account } from "@/lib/account";

export function useAccount(): Account | null {
  return useSyncExternalStore(subscribeToAccount, currentAccount, () => null);
}
