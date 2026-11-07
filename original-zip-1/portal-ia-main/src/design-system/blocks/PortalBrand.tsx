import { PitangLogo } from "../primitives";
export function PortalBrand({ compact = false }: { compact?: boolean }) {
  return <a href="/" className="proto-brand" aria-label="Portal IA da Pitang, início"><PitangLogo />{!compact && <span>portal ia</span>}</a>;
}
