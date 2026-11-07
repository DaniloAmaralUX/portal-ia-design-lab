# Icon Swap

Animate icon swaps with scale, blur, and fade transitions.

```tsx
"use client"

import { useState } from "react"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IconSwap, IconSwapItem } from "@/components/icon-swap"

const ICONS = {
  sun: SunIcon,
  moon: MoonIcon,
  monitor: MonitorIcon,
} as const

type IconKey = keyof typeof ICONS

export default function IconSwapDemo() {
  const [icon, setIcon] = useState<IconKey>("sun")

  const Icon = ICONS[icon]

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        className="relative will-change-transform"
        variant="outline"
        size="icon-sm"
        aria-label={icon}
      >
        <IconSwap>
          <IconSwapItem key={icon}>
            <Icon />
          </IconSwapItem>
        </IconSwap>
      </Button>

      <div className="flex gap-0.5 rounded-lg p-0.5 ring-1 ring-line">
        {Object.keys(ICONS).map((key) => (
          <Button
            key={key}
            className="rounded-md border-none capitalize"
            size="xs"
            variant={icon === key ? "secondary" : "ghost"}
            onClick={() => setIcon(key as IconKey)}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  )
}

```

Dependencies: motion

## Use cases

* Copy buttons that switch to a check on success.
* Toggle buttons such as play and pause.
* Icons that follow the selected tab or option.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/icon-swap
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install motion
      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/icon-swap.tsx" 
      "use client"

      import type { AnimatePresenceProps, HTMLMotionProps } from "motion/react"
      import { AnimatePresence, motion } from "motion/react"

      export function IconSwap(props: React.PropsWithChildren<AnimatePresenceProps>) {
        return <AnimatePresence mode="popLayout" initial={false} {...props} />
      }

      type MotionElement = typeof motion.div | typeof motion.span

      export function IconSwapItem({
        as: Component = motion.div,
        ...props
      }: HTMLMotionProps<"div"> & {
        as?: MotionElement
      }) {
        return (
          <Component
            initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              duration: 0.3,
              bounce: 0,
            }}
            {...props}
          />
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { IconSwap, IconSwapItem } from "@/components/icon-swap"
```

```tsx
<IconSwap>
  <IconSwapItem key={isCopied ? "check" : "copy"}>
    {isCopied ? <CheckIcon /> : <CopyIcon />}
  </IconSwapItem>
</IconSwap>
```

Change the `key` on `IconSwapItem` whenever the icon should swap.

## Composition

Use the following composition to build an `IconSwap`

```text
IconSwap
└── IconSwapItem
    └── {icon}
```

## Credits

* [Emil Kowalski](https://emilkowal.ski/ui/7-practical-animation-tips#7.-use-blur-when-nothing-else-works)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on May 18, 2026