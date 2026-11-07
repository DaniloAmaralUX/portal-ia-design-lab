import { useState } from "react";
import { intervals } from "@/data/intervals";
import { AreaField } from "./AreaField";
import { checkInterval, emptyRecording, intervalFile, slugFor, type IntervalDraft, type Recording } from "./files";
import { PublishShell } from "./PublishShell";
import { RecordingFields } from "./RecordingFields";
import { SendResult } from "./SendResult";
import { SlugField } from "./SlugField";
import { SubmitRow } from "./SubmitRow";
import { usePublish } from "./use-publish";

const taken: ReadonlySet<string> = new Set(intervals.map((i) => i.slug));

// The key of the form changes to publish another one, which starts it empty.
export function PublishIntervalPage() {
  const [round, setRound] = useState(0);
  return <IntervalForm key={round} onAnother={() => setRound((n) => n + 1)} />;
}

function IntervalForm({ onAnother }: { onAnother: () => void }) {
  const [draft, setDraft] = useState<IntervalDraft>({ ...emptyRecording, slug: "", area: "" });
  const [slugEdited, setSlugEdited] = useState(false);
  const publish = usePublish();
  const problems = checkInterval(draft, taken);
  const count = Object.keys(problems).length;
  const shown = publish.submitted ? problems : {};

  const change = (field: keyof Recording, value: string) =>
    setDraft((d) => ({ ...d, [field]: value, ...(field === "title" && !slugEdited ? { slug: slugFor(value) } : {}) }));

  return (
    <PublishShell
      title="Publicar um intervalo técnico"
      lead="Preencha o intervalo como ele vai aparecer em Intervalos técnicos. O formulário confere cada campo e envia a solicitação para análise: depois que o time aprovar, o intervalo aparece no portal."
    >
      <form noValidate onSubmit={(e) => publish.submit(e, count, { kind: "interval", draft })} className="space-y-6">
        <RecordingFields
          value={draft}
          problems={shown}
          onChange={change}
          afterTitle={
            <SlugField
              id="interval-slug"
              base="/academy/intervalos"
              value={draft.slug}
              problem={shown.slug}
              onChange={(slug) => {
                setSlugEdited(true);
                setDraft((d) => ({ ...d, slug }));
              }}
            />
          }
        />
        <AreaField id="interval-area" value={draft.area} onChange={(area) => setDraft((d) => ({ ...d, area }))} />
        {publish.result?.state !== "sent" && <SubmitRow problems={publish.submitted ? count : 0} sending={publish.sending} />}
      </form>
      {publish.result && <SendResult result={publish.result} files={[intervalFile(draft)]} onAnother={onAnother} />}
    </PublishShell>
  );
}
