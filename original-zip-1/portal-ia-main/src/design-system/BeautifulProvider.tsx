import type { ReactNode } from "react";
import "./beautiful/reference.css";
export function BeautifulProvider({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <div className={dark ? "dark" : undefined}><div className="beautiful-catalog">{children}</div></div>;
}
