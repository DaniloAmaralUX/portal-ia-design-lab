import { create } from "zustand";
import { writeStorage } from "@/lib/storage";
import { THEME_KEY } from "@/shared/theme";

type Theme = "light" | "dark";

type UiState = {
  theme: Theme;
  paletteOpen: boolean;
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  syncTheme: () => void;
  setPaletteOpen: (open: boolean) => void;
};

// Starts light on both the build and the browser so hydration matches; the layout syncs the real theme (the html class) right after.
export const useUi = create<UiState>((set, get) => ({
  theme: "light",
  paletteOpen: false,
  activeSection: null,
  setActiveSection: (activeSection) => set({ activeSection }),
  setTheme: (theme) => {
    const html = document.documentElement;
    html.dataset.switchingTheme = "";
    html.classList.toggle("dark", theme === "dark");
    requestAnimationFrame(() => requestAnimationFrame(() => delete html.dataset.switchingTheme));
    writeStorage("localStorage", THEME_KEY, theme);
    set({ theme });
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
  syncTheme: () => set({ theme: document.documentElement.classList.contains("dark") ? "dark" : "light" }),
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
}));
