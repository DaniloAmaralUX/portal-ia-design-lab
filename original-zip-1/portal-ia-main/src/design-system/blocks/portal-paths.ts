import { BookOpen, Route, Blocks } from "lucide-react";
export const portalPaths = [
  { id: "academy", title: "Academy", description: "Aprenda no seu ritmo, com uma trilha para o seu papel.", detail: "Capacitação em IA", href: "/academy", icon: BookOpen },
  { id: "metodo", title: "Método", description: "Da primeira pergunta à entrega. Um jeito de trabalhar com IA.", detail: "Guias de trabalho", href: "/metodo", icon: Route },
  { id: "skills", title: "Skills", description: "Conhecimento do time, pronto para usar no Claude Code.", detail: "Ferramentas do time", href: "/explorar", icon: Blocks },
] as const;
