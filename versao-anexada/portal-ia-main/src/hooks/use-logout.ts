import { useState } from "react";
import { logout } from "@/lib/account";

// The logout asks the server before it leaves the page, so the button says it is leaving and takes no second click meanwhile.
export function useLogout() {
  const [leaving, setLeaving] = useState(false);
  function leave() {
    if (leaving) return;
    setLeaving(true);
    void logout();
  }
  return { leaving, leave };
}
