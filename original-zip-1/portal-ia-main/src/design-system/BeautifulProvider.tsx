import type { ReactNode } from "react";
import "./beautiful/adapter.css";
export function BeautifulProvider({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <div className={dark ? "dark" : undefined}><div className="beautiful-catalog">{children}</div></div>;
}
