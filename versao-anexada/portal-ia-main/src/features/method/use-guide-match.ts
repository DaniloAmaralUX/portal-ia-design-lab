import { useMatch } from "@tanstack/react-router";

// The guide open on the page, in the Method or in Ferramentas, and the chapter of it, when one is open. The two sections draw the
// same pages of a guide, each under its own address.
export function useGuideMatch() {
  const method = useMatch({ from: "/metodo/$guide", shouldThrow: false });
  const tool = useMatch({ from: "/ferramentas/$guide", shouldThrow: false });
  const methodChapter = useMatch({ from: "/metodo/$guide/$chapter", shouldThrow: false });
  const toolChapter = useMatch({ from: "/ferramentas/$guide/$chapter", shouldThrow: false });
  return { guide: (method ?? tool)?.loaderData, chapter: methodChapter ?? toolChapter };
}
