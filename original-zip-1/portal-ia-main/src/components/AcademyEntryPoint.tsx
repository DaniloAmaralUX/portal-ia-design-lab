import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ROLES } from "@/data/roles";
import { EntryPoint } from "./EntryPoint";
import { entryLink, entryLinkSecondary } from "./entry-point-class";

export function AcademyEntryPoint() {
  return (
    <EntryPoint
      label="Aprender"
      title="Academy"
      text={`${ROLES.length} trilhas de capacitação, uma por papel, com cursos gratuitos da Anthropic, da OpenAI e da Microsoft em três fases.`}
    >
      <Link to="/academy" className={entryLink}>
        Abrir a Academy
        <ArrowRight aria-hidden className="size-4" />
      </Link>
      <Link to="/academy" hash="comece" className={entryLinkSecondary}>
        Novo em IA?
      </Link>
    </EntryPoint>
  );
}
