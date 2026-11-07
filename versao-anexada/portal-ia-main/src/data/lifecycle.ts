import type { LifecycleId } from "./types";

// The state each plugin and skill declares in the skills repository, with what it means for whoever decides to install. A retired
// plugin has no state: it leaves the marketplace, as the CONTRIBUTING.md of the skills repository says, so it is not in the catalog.
export const LIFECYCLES: Record<LifecycleId, { label: string; means: string }> = {
  experimental: { label: "Experimental", means: "Ainda não passou por um time piloto. Pode mudar ou sair sem aviso." },
  incubating: { label: "Em incubação", means: "Está em piloto com times, com linha de base. Pode mudar entre versões." },
  supported: { label: "Com suporte", means: "Tem dono e manutenção, e mudança grande vem avisada nas novidades." },
  deprecated: { label: "Em descontinuação", means: "Ainda instala, mas vai sair. Procure a substituta antes de adotar." },
};
