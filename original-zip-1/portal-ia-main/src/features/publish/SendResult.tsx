import { useEffect } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { focusRegion } from "@/hooks/use-route-focus";
import type { GeneratedFile } from "./files";
import type { Submission } from "./submit";

const TITLES: Record<Submission["state"], string> = {
  sent: "Solicitação enviada para análise",
  unavailable: "O envio automático não está ligado",
  refused: "Não foi possível enviar a solicitação",
};

function FileList({ files }: { files: GeneratedFile[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-small font-semibold">{files.length > 1 ? "Os arquivos" : "O arquivo"}</h3>
      <ul className="mt-3 space-y-6">
        {files.map((file) => (
          <li key={file.path}>
            <p className="mb-2 font-mono text-caption text-muted-foreground [overflow-wrap:anywhere]">{file.path}</p>
            <CodeBlock code={file.content} language="markdown" message="Arquivo copiado" name={`Copiar o arquivo ${file.path}`} wrap />
          </li>
        ))}
      </ul>
    </div>
  );
}

// The heading takes the focus when the answer comes, so the screen reader announces it. When the send failed for a reason that is
// not the person's, the file stays on the page to copy, drawn from the form as it is now.
export function SendResult({ result, files, onAnother }: { result: Submission; files: GeneratedFile[]; onAnother: () => void }) {
  useEffect(() => focusRegion("send-result"), [result]);
  const sent = result.state === "sent";
  const copy = result.state === "unavailable" || (result.state === "refused" && result.canCopy);

  return (
    <section aria-labelledby="send-result" className="mt-12 border-t border-border pt-10">
      <h2 id="send-result" className="font-display text-heading font-bold">
        {TITLES[result.state]}
      </h2>
      {sent && (
        <>
          <p className="mt-3 max-w-measure text-small leading-relaxed text-muted-foreground">
            Sua solicitação foi enviada para análise. O time a recebe uma vez por dia útil e, depois que aprovar, o conteúdo aparece no portal.
          </p>
          <Button type="button" variant="outline" onClick={onAnother} className="mt-6">
            Publicar outro
          </Button>
        </>
      )}
      {result.state === "unavailable" && (
        <p className="mt-3 max-w-measure text-small leading-relaxed text-muted-foreground">
          O envio automático não está configurado neste ambiente. Copie o arquivo abaixo e mande para o time do portal, que publica no caminho indicado.
        </p>
      )}
      {result.state === "refused" && <p className="mt-3 max-w-measure text-small font-medium leading-relaxed text-brand-red-ink">{result.message}</p>}
      {copy && <FileList files={files} />}
    </section>
  );
}
