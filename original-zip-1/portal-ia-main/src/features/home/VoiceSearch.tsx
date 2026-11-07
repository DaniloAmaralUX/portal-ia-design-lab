import type { FormEvent } from "react";
import { PromptSearch } from "@/components/beautiful-ui/PromptSearch";

export function VoiceSearch({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: (event: FormEvent) => void }) {
  return (
    <div className="w-full max-w-[680px]">
      <PromptSearch value={value} onChange={onChange} onSubmit={onSubmit} />
      <p className="mt-3 text-center text-caption leading-relaxed text-muted-foreground">Busque skills e referências do Método pela tarefa que precisa realizar.</p>
    </div>
  );
}
