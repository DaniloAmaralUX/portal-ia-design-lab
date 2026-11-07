# Logos Swap

Swap logos one at a time in a scattered order.

```tsx
import { LogosSwap } from "@/components/logos-swap"
import { SPONSORS } from "@/features/sponsor/data"

export default function LogosSwapDemo() {
  return (
    <LogosSwap
      columnCount={6}
      className="w-full max-w-2xl gap-x-2 gap-y-4 text-foreground [--column-count:2] sm:[--column-count:3]"
    >
      {SPONSORS.map((sponsor) => (
        <sponsor.logo key={sponsor.name} className="size-full" />
      ))}
    </LogosSwap>
  )
}

```

Dependencies: motion

## Features

* Pauses while the page is hidden or the logos are off screen.

## Use cases

* Customer logos beside a sign-in form.
* Trusted-by row under a landing page hero.
* Sponsor row with more logos than fit at once.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/logos-swap
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install motion cn
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/logos-swap.tsx" 
      "use client"

      import { Children, useEffect, useRef, useState } from "react"
      import type { ReactNode } from "react"
      import {
        AnimatePresence,
        motion,
        useInView,
        usePageInView,
        useReducedMotion,
      } from "motion/react"
      import type { Transition, Variants } from "motion/react"

      import { cn } from "@/lib/utils"

      const DEFAULT_COLUMN_COUNT = 4

      const SWAP_INTERVAL = 1500

      const GOLDEN_RATIO = 1.618

      const EASE_IN_OUT_EXPO = [0.87, 0, 0.13, 1] as const

      const TRANSITION: Transition = { duration: 0.9, ease: EASE_IN_OUT_EXPO }

      const LOGO_VARIANTS: Variants = {
        initial: { opacity: 0, transform: "translateY(50%)" },
        animate: {
          opacity: 1,
          transform: "translateY(0%)",
          transition: { ...TRANSITION, delay: 0.1 },
        },
        exit: {
          opacity: 0,
          transform: "translateY(-50%)",
          transition: TRANSITION,
        },
      }

      export type LogosSwapProps = Omit<React.ComponentProps<"div">, "ref"> & {
        /** Logo elements to cycle through. Each child is rendered as a single logo. */
        children: ReactNode
        /**
         * Number of logos shown at once. Capped at the number of logos. They sit in
         * one row by default; set `--column-count` to wrap them onto fewer columns.
         * @defaultValue 4
         */
        columnCount?: number
      }

      export function LogosSwap({
        children,
        columnCount = DEFAULT_COLUMN_COUNT,
        className,
        style,
        ...props
      }: LogosSwapProps) {
        const logos = Children.toArray(children)
        const logoCount = logos.length
        const slotCount = Math.min(columnCount, logoCount)

        const swapOrder = getSwapOrder(slotCount)
        // Queued in swap order so the slots start in `children` order. Each slot then
        // takes the next logo on its turn, which rules out duplicates on screen.
        const queue = [
          ...swapOrder.map((slot) => logos[slot]),
          ...logos.slice(slotCount),
        ]

        const containerRef = useRef<HTMLDivElement>(null)
        const isPageInView = usePageInView()
        const isInView = useInView(containerRef, { margin: "100px" })
        const shouldReduceMotion = useReducedMotion()

        const shouldPlay =
          isPageInView && isInView && logoCount > slotCount && !shouldReduceMotion

        const [step, setStep] = useState(0)

        useEffect(() => {
          if (!shouldPlay) return

          const intervalId = window.setInterval(
            () => setStep((prev) => prev + 1),
            SWAP_INTERVAL
          )

          return () => window.clearInterval(intervalId)
        }, [shouldPlay])

        if (logoCount === 0) return null

        return (
          <div
            ref={containerRef}
            data-slot="logos-swap"
            className={cn("grid", className)}
            style={{
              gridTemplateColumns: `repeat(var(--column-count,${slotCount}), minmax(0, 1fr))`,
              ...style,
            }}
            {...props}
          >
            {Array.from({ length: slotCount }, (_, slot) => {
              const turn = swapOrder.indexOf(slot)
              const swapCount = Math.ceil((step - turn) / slotCount)
              const queueIndex = (turn + swapCount * slotCount) % logoCount

              return (
                // The bleed holds the feathered edge, so logos at rest are never dimmed.
                <div
                  key={slot}
                  data-slot="logos-swap-slot"
                  className="-my-3 grid h-20 min-w-0 grid-cols-1 grid-rows-1 overflow-hidden mask-y-from-85% py-3"
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={queueIndex}
                      data-slot="logos-swap-logo"
                      className="col-start-1 row-start-1 flex min-h-0 min-w-0 items-center justify-center"
                      variants={LOGO_VARIANTS}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {queue[queueIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )
      }

      /** Golden ratio steps scatter the slots like a shuffle the server can match. */
      function getSwapOrder(slotCount: number) {
        const getRank = (slot: number) => (slot * GOLDEN_RATIO) % 1

        return Array.from({ length: slotCount }, (_, slot) => slot).sort(
          (a, b) => getRank(a) - getRank(b)
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { LogosSwap } from "@/components/logos-swap"
```

```tsx
<LogosSwap>
  <Logo />
  <Logo />
  <Logo />
  <Logo />
  <Logo />
  <Logo />
</LogosSwap>
```

Pass more logos than `columnCount`, otherwise nothing swaps.

Set `--column-count` to wrap the logos onto fewer columns:

```tsx
<LogosSwap
  columnCount={6}
  className="[--column-count:3] sm:[--column-count:6]"
/>
```

## API reference

### LogosSwap

<TypeTable
  id="type-table-props.ts-LogosSwapProps"
  type={{
  "id": "props.ts-LogosSwapProps",
  "name": "LogosSwapProps",
  "description": "",
  "entries": [
    {
      "name": "children",
      "description": "Logo elements to cycle through. Each child is rendered as a single logo.",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": true,
      "deprecated": false
    },
    {
      "name": "columnCount",
      "description": "Number of logos shown at once. Capped at the number of logos. They sit in\none row by default; set `--column-count` to wrap them onto fewer columns.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "4"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Accessibility

* With `prefers-reduced-motion`, swapping stops at the first `columnCount` logos, so put the most important ones first.
* Screen readers only reach the logos on screen.
* The swap auto-updates, so WCAG 2.2.2 applies: add a pause control, or set `aria-hidden` and list every logo elsewhere.

## Credits

* [Claude Platform](https://platform.claude.com/login)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on October 31, 2026