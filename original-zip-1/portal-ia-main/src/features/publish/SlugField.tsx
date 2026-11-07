import { Field } from "./Field";
import { lineControl } from "./field-class";

export function SlugField({ id, base, value, problem, onChange }: { id: string; base: string; value: string; problem?: string; onChange: (slug: string) => void }) {
  return (
    <Field id={id} label="Endereço da página" hint={`A página abre em ${base}/${value || "…"}. Ele sai do título, e você pode trocar.`} problem={problem}>
      {(c) => <input {...c} value={value} onChange={(e) => onChange(e.target.value)} autoComplete="off" spellCheck={false} className={`${lineControl} font-mono`} />}
    </Field>
  );
}
