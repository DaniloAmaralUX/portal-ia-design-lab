# Text Swap

Animated text that swaps through items with a fade transition.

```tsx
"use client"

import { useRef } from "react"
import { motion, useInView, usePageInView } from "motion/react"

import { TextSwap } from "@/components/text-swap"

const WORDS = ["Developer", "Designer", "Creator", "Builder"]

export default function TextSwapDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(ref)
  const play = isPageInView && isInView

  return (
    <div
      ref={ref}
      className="flex items-center gap-1.5 text-2xl font-medium text-muted-foreground"
    >
      <span>I am a</span>
      <span className="inline-grid">
        {/* Placeholder for the tallest word */}
        <span className="invisible col-start-1 row-start-1" aria-hidden>
          {WORDS.reduce((a, b) => (a.length >= b.length ? a : b))}
        </span>
        <TextSwap
          as={motion.span}
          className="col-start-1 row-start-1 text-foreground"
          play={play}
        >
          {WORDS.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </TextSwap>
      </span>
    </div>
  )
}

```

Dependencies: motion

## Use cases

* Rotating roles or taglines in a hero section.
* Changing word inside a headline.
* Cycling commands or keywords in a product demo.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/text-swap
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

      ```tsx title="components/text-swap.tsx" 
      "use client"

      import { Children, useEffect, useState } from "react"
      import type { Transition, Variants } from "motion/react"
      import { AnimatePresence, motion, useReducedMotion } from "motion/react"

      import { cn } from "@/lib/utils"

      const defaultTransition: Transition = {
        type: "spring",
        visualDuration: 0.35,
        bounce: 0,
      }

      const exitTransition: Transition = { duration: 0.2, ease: "easeOut" }

      const defaultVariants: Variants = {
        initial: { y: "-0.25em", opacity: 0, filter: "blur(2px)" },
        animate: { y: "0em", opacity: 1, filter: "blur(0px)" },
        exit: {
          y: "0.25em",
          opacity: 0,
          filter: "blur(2px)",
          transition: exitTransition,
        },
      }

      // `animate` stays shared: it is what the server renders with `initial={false}`,
      // and the client reads the media query before hydrating.
      const reducedMotionVariants: Variants = {
        ...defaultVariants,
        initial: { opacity: 0 },
        exit: { opacity: 0, transition: exitTransition },
      }

      type MotionElement = typeof motion.p | typeof motion.span | typeof motion.code

      export type TextSwapProps = {
        /**
         * Motion element to render.
         * @defaultValue motion.p
         * */
        as?: MotionElement
        className?: string
        /** Array of children to cycle through. */
        children: React.ReactNode[]

        /**
         * Time in seconds between each swap.
         * @defaultValue 2
         * */
        interval?: number
        /**
         * Motion transition for the enter animation. The default exit is faster and
         * sets its own transition.
         * @defaultValue { type: "spring", visualDuration: 0.35, bounce: 0 }
         * */
        transition?: Transition
        /**
         * Motion variants for enter/exit animations. Replaces the defaults, including
         * their reduced motion fallback.
         * */
        variants?: Variants

        /** Controls whether the swap animation runs. */
        play?: boolean

        /** Called with the new index after each swap. */
        onIndexChange?: (index: number) => void
      }

      export function TextSwap({
        as: Component = motion.p,
        className,
        children,

        interval = 2,
        transition = defaultTransition,
        variants,
        play = true,

        onIndexChange,
      }: TextSwapProps) {
        const [currentIndex, setCurrentIndex] = useState(0)
        const shouldReduceMotion = useReducedMotion()

        const items = Children.toArray(children)

        useEffect(() => {
          if (!play) return

          const timer = setInterval(() => {
            setCurrentIndex((prev) => {
              const next = (prev + 1) % items.length
              onIndexChange?.(next)
              return next
            })
          }, interval * 1000)

          return () => clearInterval(timer)
        }, [play, interval, items.length, onIndexChange])

        return (
          <AnimatePresence mode="wait" initial={false}>
            <Component
              key={currentIndex}
              className={cn("inline-block", className)}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              variants={
                variants ??
                (shouldReduceMotion ? reducedMotionVariants : defaultVariants)
              }
            >
              {items[currentIndex]}
            </Component>
          </AnimatePresence>
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { TextSwap } from "@/components/text-swap"
```

```tsx
<TextSwap>
  <span>Developer</span>
  <span>Designer</span>
  <span>Creator</span>
</TextSwap>
```

## API reference

### TextSwap

<TypeTable
  id="type-table-text-swap.tsx-TextSwapProps"
  type={{
  "id": "text-swap.tsx-TextSwapProps",
  "name": "TextSwapProps",
  "description": "",
  "entries": [
    {
      "name": "as",
      "description": "Motion element to render.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "motion.p"
        }
      ],
      "type": "MotionElement | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    },
    {
      "name": "className",
      "description": "",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "children",
      "description": "Array of children to cycle through.",
      "tags": [],
      "type": "ReactNode[]",
      "simplifiedType": "array",
      "required": true,
      "deprecated": false
    },
    {
      "name": "interval",
      "description": "Time in seconds between each swap.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "2"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "transition",
      "description": "Motion transition for the enter animation. The default exit is faster and\nsets its own transition.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "{ type: \"spring\", visualDuration: 0.35, bounce: 0 }"
        }
      ],
      "type": "Transition | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    },
    {
      "name": "variants",
      "description": "Motion variants for enter/exit animations. Replaces the defaults, including\ntheir reduced motion fallback.",
      "tags": [],
      "type": "Variants | undefined",
      "simplifiedType": "object",
      "required": false,
      "deprecated": false
    },
    {
      "name": "play",
      "description": "Controls whether the swap animation runs.",
      "tags": [],
      "type": "boolean | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onIndexChange",
      "description": "Called with the new index after each swap.",
      "tags": [],
      "type": "((index: number) => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Accessibility

* With `prefers-reduced-motion`, items still cycle but fade in place, without moving or blurring.
* Passing `variants` replaces this fallback, so custom variants need their own.

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on November 1, 2026