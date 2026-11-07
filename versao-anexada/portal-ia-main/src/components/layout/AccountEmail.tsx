import { cn } from "@/lib/utils";

// The e-mail whole, never cut: when it does not fit, it breaks before the @ ("joao.vitor.albuquerque" / "@pitang.com"), and only a
// part longer than the line breaks at a letter.
export function AccountEmail({ email, className }: { email: string; className?: string }) {
  const at = email.lastIndexOf("@");
  return (
    <p className={cn("text-caption text-muted-foreground [overflow-wrap:anywhere]", className)}>
      {at > 0 ? (
        <>
          {email.slice(0, at)}
          <wbr />
          {email.slice(at)}
        </>
      ) : (
        email
      )}
    </p>
  );
}
