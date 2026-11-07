import type { EffectKind } from "./types";

// Ordered by risk: what leaves the machine or changes the team's files first, what only reads last. The skill page and its Markdown use this order.
export const EFFECT_KINDS: { kind: EffectKind; label: string; means: string }[] = [
  { kind: "credential", label: "Usa credencial", means: "Usa uma credencial que você guarda no ambiente, como um token." },
  { kind: "network", label: "Acessa a rede", means: "Faz chamadas a serviços fora da sua máquina." },
  { kind: "git", label: "Mexe no git", means: "Cria commits ou mexe em branches do repositório local." },
  { kind: "code", label: "Altera código", means: "Edita o código-fonte do seu projeto." },
  { kind: "runs", label: "Roda comandos", means: "Roda comandos na sua máquina, como build, testes ou scripts." },
  { kind: "writes", label: "Grava arquivos", means: "Grava arquivos no seu projeto." },
  { kind: "read-only", label: "Só lê e responde", means: "Só lê o que você aponta e responde na conversa." },
];
