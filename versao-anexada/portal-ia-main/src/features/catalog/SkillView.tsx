import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ExamplePrompt } from "@/components/ExamplePrompt";
import { InlineCode } from "@/components/InlineCode";
import { SkillLinkedText } from "@/components/SkillLinkedText";
import { Term } from "@/components/Term";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getPlugin, pluginOf, skillsOf } from "@/data/catalog";
import type { Skill } from "@/data/types";
import { InstallPanel } from "@/features/install";
import { LearnInMethod } from "@/features/method";
import { invokeFromPlugin, skillFolderUrl } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { SiblingSkills } from "./SiblingSkills";
import type { SkillDocText } from "./skill-loader";
import { SkillEffects } from "./SkillEffects";
import { SkillFiles } from "./SkillFiles";
import { SkillHeader } from "./SkillHeader";
import { SkillLinks } from "./SkillLinks";
import { SkillMd } from "./SkillMd";
import { SkillSection } from "./SkillSection";
import { SkillSheet } from "./SkillSheet";
import { StickyAside } from "./StickyAside";

export function SkillView({ skill, doc }: { skill: Skill; doc: SkillDocText }) {
  const plugin = pluginOf(skill);
  const siblings = skillsOf(plugin.name).filter((s) => s.slug !== skill.slug);
  const invoke = invokeFromPlugin(skill);
  const folders = [...new Set(skill.files.filter((f) => f.includes("/")).map((f) => f.split("/")[0]))];
  const blocks = [
    { title: "O que você recebe", text: <InlineCode text={skill.output} /> },
    skill.whenToUse ? { title: "Quando usar", text: skill.whenToUse } : null,
    skill.whenNotToUse ? { title: "Quando não usar", text: <SkillLinkedText text={skill.whenNotToUse} /> } : null,
  ].filter((b) => b !== null);

  return (
    <>
      <SkillHeader skill={skill} />

      <Container className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-14">
          <SkillSection id="como-pedir" title={skill.manual ? "Como chamar" : "Como pedir ao Claude"}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ExamplePrompt text={skill.example} />
            </div>
            <p className="mt-4 max-w-measure text-small leading-relaxed text-muted-foreground">
              {skill.manual ? (
                <>
                  Esta skill só roda quando alguém chama pela barra. Fica manual o que configura o projeto, importa itens em
                  lote ou é difícil de desfazer.
                </>
              ) : (
                <>
                  Quando o seu pedido combina com a skill, o Claude usa sozinho. Para chamar direto, digite{" "}
                  <code className="font-mono text-[0.92em] text-foreground">{invoke}</code>.
                </>
              )}
            </p>
          </SkillSection>

          <SkillSection id="para-que-serve" title="Para que serve">
            <dl className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {blocks.map((b, i) => (
                <div key={b.title} className={cn(blocks.length === 3 && i === 0 && "md:col-span-2")}>
                  <dt className="text-small font-semibold">{b.title}</dt>
                  <dd className="mt-1.5 max-w-measure text-body leading-relaxed text-foreground/85">{b.text}</dd>
                </div>
              ))}
            </dl>
            {skill.seeAlsoPlugins.length > 0 && (
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {skill.seeAlsoPlugins.map((name) => {
                  const other = getPlugin(name);
                  return other ? (
                    <Link
                      key={name}
                      to="/plugins/$plugin"
                      params={{ plugin: name }}
                      className="text-small link"
                    >
                      Ver o plugin {other.displayName}
                    </Link>
                  ) : null;
                })}
              </p>
            )}
          </SkillSection>

          <LearnInMethod slugs={[skill.slug]} />

          <div className="space-y-14 pt-14">
            <SkillSection id="efeitos" title="O que ela faz no seu projeto">
              <p className="-mt-1 mb-5 max-w-measure text-small leading-relaxed text-muted-foreground">
                Os tipos de efeito que a skill declara. O que ela faz em cada um, passo a passo, está no{" "}
                <a href="#skill-md" className="link">
                  SKILL.md
                </a>
                , e vale conferir antes de rodar num projeto sensível.
              </p>
              <SkillEffects kinds={skill.effects} />
            </SkillSection>

            <SkillSection id="instalar" title="Instalação">
              <p className="-mt-1 mb-5 max-w-measure text-small leading-relaxed text-foreground/85">
                No Claude Code, instale o{" "}
                <Term id="plugin">plugin</Term> {plugin.displayName}, que traz esta skill
                {siblings.length === 1 ? " e a outra dele" : siblings.length > 1 ? ` e as outras ${siblings.length} dele` : ""}. Para
                ter só esta, abra "Só esta skill", nas outras formas.
              </p>
              <Card className="p-5 sm:p-6">
                <InstallPanel plugin={plugin} skill={skill} />
              </Card>
            </SkillSection>

            {(skill.requires.length > 0 || skill.requiredBy.length > 0) && (
              <SkillSection id="dependencias" title="Dependências">
                <div className="space-y-5">
                  {skill.requires.length > 0 && (
                    <div>
                      <p className="mb-2.5 text-small text-muted-foreground">
                        <strong className="font-semibold text-foreground">Depende de.</strong> Rode antes, uma vez. O .zip de
                        "Só esta skill" já traz essas skills junto.
                      </p>
                      <SkillLinks slugs={skill.requires} />
                    </div>
                  )}
                  {skill.requiredBy.length > 0 && (
                    <div>
                      <p className="mb-2.5 text-small text-muted-foreground">
                        <strong className="font-semibold text-foreground">É usada por.</strong> Estas skills pedem que esta rode
                        antes.
                      </p>
                      <SkillLinks slugs={skill.requiredBy} />
                    </div>
                  )}
                </div>
              </SkillSection>
            )}

            <SkillMd doc={doc} />

            <SkillSection id="arquivos" title={`Arquivos (${skill.files.length})`}>
              <p className="-mt-1 mb-4 text-small text-muted-foreground">
                O que vem junto quando você instala.
                {folders.includes("assets") && " Em assets/ ficam os modelos que a skill copia para o projeto."}
                {folders.includes("references") && " Em references/ ficam os guias que ela consulta quando precisa."}
              </p>
              <SkillFiles skill={skill} />
              <a
                href={skillFolderUrl(skill)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-small link"
              >
                Ver a pasta no GitLab
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(abre em outra aba)</span>
              </a>
            </SkillSection>
          </div>
        </div>

        <StickyAside>
          <SkillSheet skill={skill} />
          <SiblingSkills plugin={plugin} siblings={siblings} />
        </StickyAside>
      </Container>
    </>
  );
}
