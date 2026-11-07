import { DEMO_PLUGIN } from "./demo-plugin";
import { WindowBar } from "./WindowBar";

export function ChatPreview() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-terminal-border bg-terminal shadow-lg">
      <WindowBar />
      <div className="flex flex-1 flex-col justify-center gap-2 px-3.5 py-2.5">
        <p className="ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-terminal-foreground px-3 py-1.5 text-micro leading-snug text-terminal">
          Transforme esta ata de reunião em histórias de usuário
        </p>
        <p className="flex items-center gap-2 font-mono text-micro">
          <span aria-hidden className="select-none text-terminal-gold">
            ●
          </span>
          <span>
            <span className="text-terminal-muted">usando a skill </span>
            <span className="text-terminal-gold">{DEMO_PLUGIN}:pg-us-create</span>
          </span>
        </p>
      </div>
    </div>
  );
}
