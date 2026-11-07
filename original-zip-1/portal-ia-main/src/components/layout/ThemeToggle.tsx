import { Moon, Sun } from "lucide";
import { StateIcon, usePointerFeedback } from "@/components/craft/StateIcon";
import { useUi } from "@/store/ui";
import { press } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useUi((s) => s.theme);
  const toggleTheme = useUi((s) => s.toggleTheme);
  const dark = theme === "dark";
  const { instant, record } = usePointerFeedback();
  return (
    <button
      type="button"
      onClick={(event) => { record(event); toggleTheme(); }}
      aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
      title={dark ? "Usar tema claro" : "Usar tema escuro"}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground",
        press,
        className,
      )}
    >
      <StateIcon icon={dark ? Sun : Moon} instant={instant} className="size-[18px]" />
    </button>
  );
}
