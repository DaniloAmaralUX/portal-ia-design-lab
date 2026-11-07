# Chevrons Up Down Icon

Animated chevrons icon that morphs between up and down directions.

```tsx
"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import type { ChevronsUpDownIconHandle } from "@/components/chevrons-up-down-icon"
import { ChevronsUpDownIcon } from "@/components/chevrons-up-down-icon"

export default function ChevronsUpDownIconDemo() {
  const [open, setOpen] = useState(false)
  const chevronsUpDownIconRef = useRef<ChevronsUpDownIconHandle>(null)

  useEffect(() => {
    const controls = chevronsUpDownIconRef.current
    if (!controls) return

    if (open) {
      controls.startAnimation()
    } else {
      controls.stopAnimation()
    }
  }, [open])

  return (
    <Button
      data-open={open}
      variant="outline"
      size="icon"
      onClick={() => setOpen((open) => !open)}
    >
      <ChevronsUpDownIcon
        ref={chevronsUpDownIconRef}
        duration={0.2}
        className="size-5"
      />
    </Button>
  )
}

```

Dependencies: motion

## Use cases

* Expand and collapse triggers on collapsible rows.
* Open indicator on select and combobox triggers.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/chevrons-up-down-icon
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install motion
      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/chevrons-up-down-icon.tsx" 
      "use client"

      import { useImperativeHandle } from "react"
      import { motion, useAnimation } from "motion/react"

      export type ChevronsUpDownIconHandle = {
        startAnimation: () => void
        stopAnimation: () => void
      }

      export type ChevronsUpDownIconProps = React.ComponentPropsWithoutRef<"svg"> & {
        ref?: React.Ref<ChevronsUpDownIconHandle>
        duration?: number
      }

      export function ChevronsUpDownIcon({
        ref,
        duration = 0.3,
        ...props
      }: ChevronsUpDownIconProps) {
        const controls = useAnimation()

        useImperativeHandle(ref, () => {
          return {
            startAnimation: () => controls.start("animate"),
            stopAnimation: () => controls.start("normal"),
          }
        })

        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
          >
            <motion.path
              d="M7 15L12 20L17 15"
              variants={{
                normal: {
                  d: "M7 15L12 20L17 15",
                },
                animate: {
                  d: "M7 20L12 15L17 20",
                },
              }}
              initial="normal"
              animate={controls}
              transition={{
                duration,
              }}
            />
            <motion.path
              d="M7 9L12 4L17 9"
              variants={{
                normal: {
                  d: "M7 9L12 4L17 9",
                },
                animate: {
                  d: "M7 4L12 9L17 4",
                },
              }}
              initial="normal"
              animate={controls}
              transition={{
                duration,
              }}
            />
          </svg>
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { useRef } from "react"

import {
  ChevronsUpDownIcon,
  ChevronsUpDownIconHandle,
} from "@/components/chevrons-up-down-icon"
```

```tsx
const chevronsUpDownIconRef = useRef<ChevronsUpDownIconHandle>(null)
```

```tsx
<ChevronsUpDownIcon ref={chevronsUpDownIconRef} />
```

Trigger the morph imperatively through the ref:

```tsx
chevronsUpDownIconRef.current?.startAnimation() // morph to chevrons-down-up
chevronsUpDownIconRef.current?.stopAnimation() // morph back to chevrons-up-down
```

## Credits

* [Lucide](https://lucide.dev/icons/chevrons-up-down)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on June 2, 2026