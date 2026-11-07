export const MODES = {
  auto: {
    label: "Dispara sozinha",
    term: "dispara-sozinha",
    hint: "O Claude usa sozinho quando o seu pedido combina com a skill.",
  },
  manual: {
    label: "Só manual",
    term: "so-manual",
    hint: "Roda só quando alguém chama pela barra, como /plugin:skill.",
  },
} as const;

export type Mode = keyof typeof MODES;

export function modeOf(skill: { manual: boolean }): Mode {
  return skill.manual ? "manual" : "auto";
}
