import { CommandLine } from "@/components/CommandLine";
import type { Plugin } from "@/data/types";
import { removeFolders, unzipCommand } from "@/lib/commands";
import { DownloadButton } from "./DownloadButton";
import { pluginZip } from "./downloads";
import { commandCodeClass, noteClass } from "./install-classes";

export function PluginZip({ plugin }: { plugin: Plugin }) {
  const zip = pluginZip(plugin);
  return (
    <div className="space-y-3">
      <p className="max-w-measure text-small leading-relaxed text-muted-foreground">
        Descompacte o .zip em <code className={commandCodeClass}>~/.claude/skills/</code>. O Claude Code carrega o plugin em toda sessão,
        com as skills em <code className={commandCodeClass}>/{plugin.name}:…</code>. Ele fica na versão {plugin.version} até você trocar
        a pasta pela de um .zip novo.
      </p>
      <DownloadButton download={zip} size="sm" />
      <CommandLine command={unzipCommand(zip.name)} prompt="$" />
      <p className={noteClass}>
        Para atualizar, apague a pasta antes de descompactar o .zip novo: sem isso, o unzip pergunta arquivo por arquivo, e o
        que a versão nova tirou continua lá. Para desinstalar, só apague.
      </p>
      <CommandLine command={removeFolders([plugin.name])} prompt="$" />
    </div>
  );
}
