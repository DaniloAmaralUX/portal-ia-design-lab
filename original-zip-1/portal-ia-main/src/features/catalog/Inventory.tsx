import type { Plugin } from "@/data/types";
import { plural } from "@/lib/utils";

export function Inventory({ components }: { components: Plugin["components"] }) {
  const { skills, agents, hooks, mcpServers } = components;
  const others = [
    agents ? plural(agents, "agente", "agentes") : null,
    hooks ? plural(hooks, "hook", "hooks") : null,
    mcpServers ? plural(mcpServers, "servidor MCP", "servidores MCP") : null,
  ].filter((x) => x !== null);
  return (
    <span className="block">
      {plural(skills, "skill", "skills")}
      <span className="block font-normal text-muted-foreground">{others.length ? others.join(", ") : "sem agentes, hooks nem MCP"}</span>
    </span>
  );
}
