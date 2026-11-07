import { CommandLine } from "@/components/CommandLine";
import type { Plugin, Skill } from "@/data/types";
import { invokeStandalone, removeFolders, unzipCommand } from "@/lib/commands";
import { DownloadButton } from "./DownloadButton";
import { skillZip } from "./downloads";
import { commandCodeClass, noteClass } from "./install-classes";

export function SkillZip({ skill, plugin }: { skill: Skill; plugin: Plugin }) {
  const zip = skillZip(skill, plugin);
  const bundled = skill.requires.length;
  return (
    <div className="space-y-3">
      <p className="max-w-measure text-small leading-relaxed text-foreground/85">
        Descompacte em <code className={commandCodeClass}>~/.claude/skills/</code>, para todos os seus projetos, ou em{" "}
        <code className={commandCodeClass}>.claude/skills/</code> do projeto, para o time. A skill fica como{" "}
        <code className={commandCodeClass}>{invokeStandalone(skill)}</code>, sem o nome do plugin na frente.
        {bundled > 0 && ` O .zip já traz ${bundled === 1 ? "a skill de que ela depende" : `as ${bundled} skills de que ela depende`}.`}
        {" "}No mesmo projeto, use uma porta só: o plugin ou a skill avulsa.
      </p>
      <DownloadButton download={zip} size="sm" />
      <CommandLine command={unzipCommand(zip.name)} prompt="$" />
      <p className={noteClass}>
        Para atualizar, apague as pastas que o .zip trouxe e descompacte o novo.
        {bundled === 0 && " Para desinstalar, basta apagar."} No projeto, o caminho é <code className={commandCodeClass}>.claude/skills/</code>.
      </p>
      <CommandLine command={removeFolders([skill.slug, ...skill.requires])} prompt="$" />
      {bundled > 0 && (
        <>
          <p className={noteClass}>
            Para desinstalar, apague só a pasta da skill.{" "}
            {bundled === 1 ? `A ${skill.requires[0]} veio junto e fica` : `As ${bundled} que vieram junto ficam`}, porque outra
            skill sua pode precisar.
          </p>
          <CommandLine command={removeFolders([skill.slug])} prompt="$" />
        </>
      )}
    </div>
  );
}
