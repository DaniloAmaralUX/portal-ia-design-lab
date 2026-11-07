import { DocsLayout } from "@/components/DocsLayout";
import { AcademyNav } from "./AcademyNav";

export function AcademyLayout() {
  return <DocsLayout title="Academy" label="Menu da Academy" Menu={AcademyNav} />;
}
