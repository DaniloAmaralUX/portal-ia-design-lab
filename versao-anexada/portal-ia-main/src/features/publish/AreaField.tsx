import { areas } from "@/data/areas";
import type { AreaId } from "@/data/types";
import { Field } from "./Field";
import { lineControl } from "./field-class";

const isArea = (value: string): value is AreaId => areas.some((a) => a.id === value);

export function AreaField({ id, value, onChange }: { id: string; value: AreaId | ""; onChange: (area: AreaId | "") => void }) {
  return (
    <Field id={id} label="Área" optional hint="O filtro da lista usa a área. Sem área, o conteúdo vale para todas.">
      {(c) => (
        <select {...c} value={value} onChange={(e) => onChange(isArea(e.target.value) ? e.target.value : "")} className={lineControl}>
          <option value="">Todas as áreas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
