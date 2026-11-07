import { Link } from "@tanstack/react-router";
import { LogOut, SquarePen } from "lucide-react";
import { useAccount } from "@/hooks/use-account";
import { useLogout } from "@/hooks/use-logout";
import { press } from "@/lib/motion";
import { cn, initials } from "@/lib/utils";
import { AccountAvatar } from "./AccountAvatar";
import { AccountEmail } from "./AccountEmail";

export function HeaderAccount() {
  const account = useAccount();
  const { leaving, leave } = useLogout();
  if (!account) return null;
  return (
    <>
      <button
        type="button"
        popoverTarget="account-menu"
        aria-label={`Conta de ${account.name}`}
        className={cn(
          "hidden size-9 items-center justify-center rounded-full bg-accent font-display text-caption font-bold text-foreground ring-1 ring-border hover:ring-foreground/30 sm:inline-flex [&:has(+#account-menu:popover-open)]:ring-2 [&:has(+#account-menu:popover-open)]:ring-foreground/25",
          press,
        )}
      >
        {initials(account.name)}
      </button>
      <div
        id="account-menu"
        popover="auto"
        role="dialog"
        aria-labelledby="account-name"
        className="account-card fixed inset-auto right-[max(1.25rem,calc((100%_-_1200px)/2_+_2rem))] top-[4.25rem] m-0 w-72 max-w-[calc(100%_-_2.5rem)] origin-top-right rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
      >
        <div className="flex items-center gap-3 px-2.5 pb-3 pt-2.5">
          <AccountAvatar name={account.name} />
          <div className="min-w-0">
            <p id="account-name" className="text-small font-semibold [overflow-wrap:anywhere]">
              {account.name}
            </p>
            {account.email && <AccountEmail email={account.email} />}
          </div>
        </div>
        <div className="mx-1 border-t border-border" />
        {account.canPublish && (
          <Link
            to="/publicar"
            onClick={() => document.getElementById("account-menu")?.hidePopover()}
            className="mt-1.5 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-small font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-foreground"
          >
            <SquarePen strokeWidth={1.5} aria-hidden className="size-4 text-muted-foreground" />
            Publicar no Academy
          </Link>
        )}
        <button
          type="button"
          onClick={leave}
          aria-disabled={leaving || undefined}
          className="mt-1.5 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-small font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-foreground aria-disabled:cursor-default aria-disabled:opacity-70 aria-disabled:hover:bg-transparent"
        >
          <LogOut strokeWidth={1.5} aria-hidden className="size-4 text-muted-foreground" />
          {leaving ? "Saindo…" : "Sair"}
        </button>
      </div>
    </>
  );
}
