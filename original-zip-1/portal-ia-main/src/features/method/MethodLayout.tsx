import { DocsLayout } from "@/components/DocsLayout";
import { MethodNav } from "./MethodNav";

export function MethodLayout() {
  return <DocsLayout title="Método" label="Menu do Método" Menu={MethodNav} />;
}
