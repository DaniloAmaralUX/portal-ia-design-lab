import { useEffect, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { SkeletonText } from "@/components/ui/skeleton";
import type { Skill } from "@/data/types";
import { skillFileUrl } from "@/lib/commands";
import { BINARY_EXTENSIONS } from "./binary-extensions";

export function SkillFileContent({ skill, file }: { skill: Skill; file: string }) {
  const url = `${import.meta.env.BASE_URL}acervo/${encodeURI(`${skill.path}/${file}`.replace(/^plugins\//, ""))}`;
  const gitlab = skillFileUrl(skill, encodeURI(file));
  const binary = BINARY_EXTENSIONS.test(file);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (binary) return;
    let live = true;
    const wait = setTimeout(() => setWaiting(true), 150);
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((t) => live && setText(t))
      .catch(() => live && setError(true))
      .finally(() => clearTimeout(wait));
    return () => {
      live = false;
      clearTimeout(wait);
    };
  }, [url, binary]);

  const extension = file.includes(".") ? file.slice(file.lastIndexOf(".") + 1) : "texto";
  const links = (
    <p className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-small">
      <a href={url} download={file.split("/").pop()} className="inline-flex items-center gap-1 link">
        <Download aria-hidden className="size-3.5" />
        Baixar o arquivo
      </a>
      <a href={gitlab} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 link">
        Ver no GitLab
        <ArrowUpRight aria-hidden className="size-3.5" />
        <span className="sr-only">(abre em outra aba)</span>
      </a>
    </p>
  );

  if (binary) {
    return (
      <>
        {links}
        <p className="text-small leading-relaxed text-foreground/85">
          Este arquivo é binário e não tem texto para mostrar aqui. Baixe para abrir no programa dele.
        </p>
      </>
    );
  }
  return (
    <>
      {links}
      {error ? (
        <p className="text-small text-foreground/85">Não deu para ler o arquivo. Tente de novo, ou baixe.</p>
      ) : text === null ? (
        waiting && <SkeletonText lines={10} />
      ) : (
        <CodeBlock code={text} language={extension} message="Arquivo copiado" name="Copiar o arquivo" wrap />
      )}
    </>
  );
}
