export const NAV = [
  { to: "/manifesto", label: "Manifesto", match: ["/manifesto"] },
  { to: "/academy", label: "Academy", match: ["/academy"] },
  { to: "/metodo", label: "Método", match: ["/metodo"] },
  { to: "/ferramentas", label: "Ferramentas", match: ["/ferramentas", "/catalyst"] },
  { to: "/explorar", label: "Catálogo", match: ["/explorar", "/plugins", "/primeiros-passos", "/novidades"] },
  { to: "/contribuir", label: "Contribuir", match: ["/contribuir"] },
] as const;

export function isCurrent(pathname: string, match: readonly string[]): boolean {
  return match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

