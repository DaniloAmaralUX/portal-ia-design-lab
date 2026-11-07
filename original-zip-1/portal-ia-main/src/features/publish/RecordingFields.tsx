import type { ReactNode } from "react";
import { Field } from "./Field";
import { areaControl, lineControl } from "./field-class";
import type { Problems, Recording } from "./files";
import { MarkdownField } from "./MarkdownField";

export function RecordingFields({
  value,
  problems,
  onChange,
  titleLabel = "Título",
  titleHint,
  afterTitle,
}: {
  value: Recording;
  problems: Problems<keyof Recording>;
  onChange: (field: keyof Recording, value: string) => void;
  titleLabel?: string;
  titleHint?: string;
  afterTitle?: ReactNode;
}) {
  return (
    <>
      <Field id="recording-title" label={titleLabel} hint={titleHint} problem={problems.title}>
        {(c) => <input {...c} value={value.title} onChange={(e) => onChange("title", e.target.value)} className={lineControl} />}
      </Field>
      {afterTitle}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="recording-date" label="Data da gravação" problem={problems.date}>
          {(c) => <input {...c} type="date" value={value.date} onChange={(e) => onChange("date", e.target.value)} className={lineControl} />}
        </Field>
        <Field id="recording-minutes" label="Duração em minutos" optional problem={problems.minutes}>
          {(c) => <input {...c} inputMode="numeric" value={value.minutes} onChange={(e) => onChange("minutes", e.target.value)} className={lineControl} />}
        </Field>
      </div>
      <Field id="recording-summary" label="Resumo" hint="Uma ou duas frases. Aparecem no cartão da lista e na busca." problem={problems.summary}>
        {(c) => <textarea {...c} rows={2} value={value.summary} onChange={(e) => onChange("summary", e.target.value)} className={areaControl} />}
      </Field>
      <Field
        id="recording-video"
        label="Gravação"
        hint="No Stream, abra a gravação, escolha Compartilhar e depois Incorporar, e cole aqui o código inteiro ou só o endereço do src."
        problem={problems.video}
      >
        {(c) => <textarea {...c} rows={3} value={value.video} onChange={(e) => onChange("video", e.target.value)} className={`${areaControl} font-mono`} />}
      </Field>
      <MarkdownField
        id="recording-text"
        label="Texto da página"
        hint="O que foi mostrado, em Markdown: ## para os subtítulos e - para as listas. Ele aparece embaixo do vídeo, como na aba Visualizar."
        value={value.text}
        problem={problems.text}
        onChange={(text) => onChange("text", text)}
      />
    </>
  );
}
