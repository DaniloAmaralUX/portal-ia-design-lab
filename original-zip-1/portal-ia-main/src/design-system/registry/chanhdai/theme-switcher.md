# Theme Switcher

Toggle between system, light, and dark themes in Next.js apps.

```tsx
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function ThemeSwitcherDemo() {
  return <ThemeSwitcher />
}

```

Dependencies: next-themes, motion, lucide-react

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/theme-switcher
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install next-themes lucide-react motion
      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/theme-switcher.tsx" 
      "use client"

      import type { JSX } from "react"
      import { useSyncExternalStore } from "react"
      import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
      import { motion } from "motion/react"
      import { useTheme } from "next-themes"

      function ThemeOption({
        icon,
        value,
        isActive,
        onClick,
      }: {
        icon: JSX.Element
        value: string
        isActive?: boolean
        onClick: (value: string) => void
      }) {
        return (
          <button
            data-active={isActive}
            className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color] hover:text-foreground data-[active=true]:text-foreground [&_svg]:size-4"
            role="radio"
            aria-checked={isActive}
            aria-label={`Switch to ${value} theme`}
            onClick={() => onClick(value)}
          >
            {icon}

            {isActive && (
              <motion.span
                layoutId="theme-option"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="absolute inset-0 rounded-full border"
              />
            )}
          </button>
        )
      }

      const THEME_OPTIONS = [
        {
          icon: <MonitorIcon />,
          value: "system",
        },
        {
          icon: <SunIcon />,
          value: "light",
        },
        {
          icon: <MoonIcon />,
          value: "dark",
        },
      ]

      function ThemeSwitcher() {
        const { theme, setTheme } = useTheme()

        const isMounted = useSyncExternalStore(
          () => () => {},
          () => true,
          () => false
        )

        if (!isMounted) {
          return <div className="flex h-8 w-24" />
        }

        return (
          <motion.div
            key={String(isMounted)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center overflow-clip rounded-full bg-background inset-ring-1 inset-ring-border"
            role="radiogroup"
          >
            {THEME_OPTIONS.map((option) => (
              <ThemeOption
                key={option.value}
                icon={option.icon}
                value={option.value}
                isActive={theme === option.value}
                onClick={setTheme}
              />
            ))}
          </motion.div>
        )
      }

      export { ThemeSwitcher }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { ThemeSwitcher } from "@/components/theme-switcher"
```

```tsx
<ThemeSwitcher />
```

## References

* [Registry](https://ui.shadcn.com/docs/registry)
* [Dark Mode with Next.js](https://ui.shadcn.com/docs/dark-mode/next)
* [next-themes](https://github.com/pacocoursey/next-themes)
* [Motion component](https://motion.dev/docs/react-motion-component)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on February 12, 2026