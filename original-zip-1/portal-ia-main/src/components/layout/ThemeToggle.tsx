import { Moon, Sun } from "lucide-react";
import { useUi } from "@/store/ui";
import { iconHidden, iconShown, iconSwap } from "@/lib/motion";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useUi((s) => s.theme);
  const toggleTheme = useUi((s) => s.toggleTheme);
  const dark = theme === "dark";
  return (
    <IconButton
      onClick={toggleTheme}
      label={dark ? "Usar tema claro" : "Usar tema escuro"}
      className={className}
    >
      <Sun className={cn("size-[18px]", iconSwap, iconHidden, "dark:scale-100 dark:opacity-100 dark:blur-none")} />
      <Moon className={cn("absolute size-[18px]", iconSwap, iconShown, "dark:scale-[0.25] dark:opacity-0 dark:blur-[4px]")} />
    </IconButton>
  );
}
