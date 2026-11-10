import { Moon, Sun } from "lucide-react";
import { useUi } from "@/store/ui";
import { iconHidden, iconShown, iconSwap, press } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useUi((s) => s.theme);
  const toggleTheme = useUi((s) => s.toggleTheme);
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
      title={dark ? "Usar tema claro" : "Usar tema escuro"}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground",
        press,
        className,
      )}
    >
      <Sun className={cn("size-[18px]", iconSwap, iconHidden, "dark:scale-100 dark:opacity-100 dark:blur-none")} />
      <Moon className={cn("absolute size-[18px]", iconSwap, iconShown, "dark:scale-[0.25] dark:opacity-0 dark:blur-[4px]")} />
    </button>
  );
}
