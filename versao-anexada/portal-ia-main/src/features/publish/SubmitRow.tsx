import { Button } from "@/components/ui/button";

export function SubmitRow({ problems, sending }: { problems: number; sending: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
      <Button type="submit" aria-disabled={sending || undefined} className="aria-disabled:cursor-default aria-disabled:opacity-60">
        {sending ? "Enviando…" : "Enviar"}
      </Button>
      <p aria-live="polite" className="text-small font-medium text-brand-red-ink">
        {problems === 1 && "Corrija o campo marcado."}
        {problems > 1 && `Corrija os ${problems} campos marcados.`}
      </p>
    </div>
  );
}
