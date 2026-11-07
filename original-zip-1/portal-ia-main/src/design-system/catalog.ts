import craft from "./craft-manifest.json";
import chanhdai from "./chanhdai-manifest.json";
import wigggle from "./wigggle-manifest.json";

export type LibraryItem = {
  id: string;
  title: string;
  description: string;
  collection: "chanhdai" | "wigggle" | "devl" | "motion-primitives";
  family: string;
  source: string;
  install: string;
  asset: string;
  status: string;
};
const assets = import.meta.glob<string>("./registry/*/*.json", { query: "?url", import: "default", eager: true });
const families: Record<string, string> = {
  "copy-button": "Clipboard / CopyButton",
  "code-block-command": "Code / CodeBlock",
  "icon-swap": "Feedback / StateIcon",
  "text-swap": "Feedback / Text",
  "shimmering-text": "Feedback / Text",
  "theme-switcher": "Theme / ThemeToggle",
  "theme-toggle-effect": "Theme / ThemeToggle",
  "line-nav": "Navigation / Sidebar",
  "react-wheel-picker": "Input / WheelPicker",
  "chevrons-up-down-icon": "Feedback / StateIcon",
  "toc-minimap": "Navigation / TOC",
  "scroll-fade-effect": "Content / Scroll",
};
export const libraryItems: LibraryItem[] = [
  ...craft.map(item => ({ ...item, collection: item.collection as LibraryItem["collection"], asset: assets[`./registry/${item.collection}/${item.id}.json`] ?? "" })),
  ...chanhdai.map(item => ({
    id: item.id, title: item.title, description: item.description,
    collection: "chanhdai" as const, family: families[item.id] ?? item.title,
    source: item.source,
    install: item.status === "recipe" ? "Receitas CSS: consulte os arquivos e escolha o efeito." : `npx shadcn@latest add @ncdai/${"installName" in item ? item.installName : item.id}`,
    asset: assets[`./registry/chanhdai/${item.id}.json`] ?? "",
    status: item.status === "recipe" ? "Receita original" : "Fonte original disponível",
  })),
  ...wigggle.filter(item => item.type === "registry:component").map(item => ({
    id: item.id, title: item.title, description: `Widget ${item.category} · variante ${item.id}`,
    collection: "wigggle" as const, family: `Widget / ${item.category}`,
    source: item.source,
    install: `npx shadcn@latest add @wigggleui/${item.id}`,
    asset: assets[`./registry/wigggle/${item.id}.json`] ?? "",
    status: "Fonte original disponível",
  })),
];
