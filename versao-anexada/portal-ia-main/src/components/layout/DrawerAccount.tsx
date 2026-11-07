import { Link } from "@tanstack/react-router";
import { LogOut, SquarePen } from "lucide-react";
import { useAccount } from "@/hooks/use-account";
import { useLogout } from "@/hooks/use-logout";
import { AccountAvatar } from "./AccountAvatar";
import { AccountEmail } from "./AccountEmail";

export function DrawerAccount() {
  const account = useAccount();
  const { leaving, leave } = useLogout();
  if (!account) return null;
  return (
    <div className="mt-12">
      <p className="mb-3 text-small font-semibold text-foreground">Sua conta</p>
      <div className="flex items-center gap-3">
        <AccountAvatar name={account.name} />
        <div className="min-w-0">
          <p className="text-body">{account.name}</p>
          {account.email && <AccountEmail email={account.email} />}
        </div>
      </div>
      {account.canPublish && (
        <Link to="/publicar" className="mt-4 flex items-center gap-2 text-small font-medium text-foreground/90 hover:text-foreground">
          <SquarePen strokeWidth={1.5} aria-hidden className="size-4 text-muted-foreground" />
          Publicar no Academy
        </Link>
      )}
      <button
        type="button"
        onClick={leave}
        aria-disabled={leaving || undefined}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-small font-medium transition-colors hover:bg-accent aria-disabled:cursor-default aria-disabled:opacity-70 aria-disabled:hover:bg-transparent"
      >
        <LogOut strokeWidth={1.5} aria-hidden className="size-4 text-muted-foreground" />
        {leaving ? "Saindo…" : "Sair"}
      </button>
    </div>
  );
}
