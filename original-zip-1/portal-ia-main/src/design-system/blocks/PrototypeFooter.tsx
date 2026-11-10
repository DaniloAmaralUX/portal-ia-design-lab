import { PortalBrand } from "./PortalBrand";
export function PrototypeFooter({ current }: { current: "craft" | "chanhdai" | "nove" }) {
  return <footer className="proto-footer"><PortalBrand /><p>Feito para quem constrói na Pitang.</p><nav aria-label="Comparar versões">{["craft", "chanhdai", "nove"].map((name, index) => <a key={name} href={`/prototipos/${name}`} aria-current={current === name ? "page" : undefined}>{index + 1}. {name === "craft" ? "Shadcncraft" : name === "chanhdai" ? "Chanh Dai" : "Nove"}</a>)}</nav></footer>;
}
