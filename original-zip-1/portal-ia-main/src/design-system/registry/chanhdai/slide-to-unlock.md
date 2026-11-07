# Slide to Unlock

Interactive slider inspired by the classic iPhone “slide to unlock” gesture.

```tsx
"use client"

import { toast } from "@/components/ui/toast"
import { ShimmeringText } from "@/components/shimmering-text"
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from "@/components/slide-to-unlock"
import { useSound } from "@/hooks/sound/use-sound"

export default function SlideToUnlockDemo() {
  const [play] = useSound("https://assets.chanhdai.com/sounds/ios/unlock.mp3", {
    volume: 0.5,
  })

  return (
    <SlideToUnlock
      onUnlock={() => {
        play()
        toast.add({ type: "success", title: "Unlocked" })
      }}
    >
      <SlideToUnlockTrack>
        <SlideToUnlockText>
          {({ isDragging }) => (
            <ShimmeringText text="slide to unlock" isStopped={isDragging} />
          )}
        </SlideToUnlockText>
        <SlideToUnlockHandle />
      </SlideToUnlockTrack>
    </SlideToUnlock>
  )
}

```

<DocPullQuote authorName="Guillermo Rauch" authorTagline="CEO at Vercel" url="https://x.com/rauchg/status/1978913158514237669" quote="awesome. Love the components, especially slide-to-unlock. Great job" />

Dependencies: motion

Registry dependencies: shimmering-text

## Features

* Smooth drag interaction with spring physics via Motion.
* Composable compound components (track, handle, text).
* Customizable handle and colors.
* Built-in shimmering text effect.

<Callout>
  Want to build animations like Slide to Unlock? I highly recommend [Emil
  Kowalski](https://x.com/emilkowalski)’s animations.dev course. [Take the
  course](https://animations.dev)
</Callout>

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/slide-to-unlock
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

      ```tsx title="components/shimmering-text.tsx" 
      "use client"

      import * as React from "react"
      import type { Variants } from "motion/react"
      import { motion } from "motion/react"

      import { cn } from "@/lib/utils"

      export type ShimmeringTextProps = Omit<
        React.ComponentProps<typeof motion.span>,
        "children"
      > & {
        /** The text to render with the shimmering effect. */
        text: string
        /**
         * Duration in seconds for one shimmer cycle.
         * @defaultValue 1 */
        duration?: number
        /**
         * Whether the shimmer animation is paused.
         * @defaultValue false */
        isStopped?: boolean
      }

      export function ShimmeringText({
        text,
        duration = 1,
        isStopped = false,
        className,
        ...props
      }: ShimmeringTextProps) {
        const createCharVariants = React.useCallback(
          (charIndex: number): Variants => ({
            running: {
              color: ["var(--color)", "var(--shimmering-color)", "var(--color)"],
              transition: {
                duration,
                repeat: Infinity,
                repeatType: "loop" as const,
                repeatDelay: text.length * 0.05,
                delay: (charIndex * duration) / text.length,
                ease: "easeInOut",
              },
            },
            stopped: {
              color: "var(--color)",
              transition: {
                duration: duration * 0.5,
                ease: "easeOut",
              },
            },
          }),
          [duration, text.length]
        )

        return (
          <motion.span
            className={cn(
              "inline-block select-none",
              "[--color:var(--muted-foreground)] [--shimmering-color:var(--foreground)]",
              className
            )}
            {...props}
          >
            {text?.split("")?.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block whitespace-pre"
                initial="stopped"
                animate={isStopped ? "stopped" : "running"}
                variants={createCharVariants(i)}
                aria-hidden
              >
                {char}
              </motion.span>
            ))}
            <span className="sr-only">{text}</span>
          </motion.span>
        )
      }

      ```

      ````tsx title="components/slide-to-unlock.tsx" 
      "use client"

      import type { ComponentProps, ComponentPropsWithoutRef, JSX } from "react"
      import { createContext, useCallback, useContext, useRef, useState } from "react"
      import {
        animate,
        motion,
        useMotionValue,
        useTransform,
        type MotionValue,
      } from "motion/react"

      import { cn } from "@/lib/utils"

      type SlideToUnlockContextValue = {
        x: MotionValue<number>
        trackRef: React.RefObject<HTMLDivElement | null>
        isDragging: boolean
        handleWidth: number
        textOpacity: MotionValue<number>
        onDragStart: () => void
        onDragEnd: () => void
      }

      const SlideToUnlockContext = createContext<SlideToUnlockContextValue | null>(
        null
      )

      function useSlideToUnlock() {
        const context = useContext(SlideToUnlockContext)
        if (!context) {
          throw new Error(
            `SlideToUnlock components must be used within SlideToUnlock`
          )
        }
        return context
      }

      export type SlideToUnlockRootProps = ComponentProps<"div"> & {
        /**
         * Width of the drag handle in pixels.
         * @defaultValue 56
         * */
        handleWidth?: number
        /** Called when the handle is dragged fully to the end. */
        onUnlock?: () => void
      }

      export function SlideToUnlock({
        className,
        handleWidth = 56,
        children,
        onUnlock,
        ...props
      }: SlideToUnlockRootProps) {
        const trackRef = useRef<HTMLDivElement>(null)
        const [isDragging, setIsDragging] = useState(false)
        const x = useMotionValue(0)

        const fadeDistance = handleWidth
        const textOpacity = useTransform(x, [0, fadeDistance], [1, 0])

        const handleDragStart = useCallback(() => {
          setIsDragging(true)
        }, [])

        const handleDragEnd = useCallback(() => {
          setIsDragging(false)

          const trackWidth = trackRef.current?.offsetWidth || 0
          const maxX = trackWidth - handleWidth

          if (x.get() >= maxX) {
            onUnlock?.()
          } else {
            animate(x, 0, { type: "spring", bounce: 0, duration: 0.25 })
          }
        }, [x, onUnlock, handleWidth])

        return (
          <SlideToUnlockContext.Provider
            value={{
              x,
              trackRef,
              isDragging,
              handleWidth,
              textOpacity,
              onDragStart: handleDragStart,
              onDragEnd: handleDragEnd,
            }}
          >
            <div
              data-slot="slide-to-unlock"
              className={cn(
                "w-54 rounded-xl bg-muted p-1 shadow-inner inset-ring-1 inset-ring-foreground/10",
                className
              )}
              {...props}
            >
              {children}
            </div>
          </SlideToUnlockContext.Provider>
        )
      }

      export type SlideToUnlockTrackProps = ComponentProps<"div">

      export function SlideToUnlockTrack({
        className,
        children,
        ...props
      }: SlideToUnlockTrackProps) {
        const { trackRef } = useSlideToUnlock()

        return (
          <div
            ref={trackRef}
            data-slot="track"
            className={cn(
              "relative flex h-10 items-center justify-center",
              className
            )}
            {...props}
          >
            {children}
          </div>
        )
      }

      export type SlideToUnlockTextProps = Omit<
        ComponentPropsWithoutRef<typeof motion.div>,
        "children"
      > & {
        /**
         * Accepts a render function as `children` to react to the dragging state.
         *
         * @example
         * ```tsx
         * <SlideToUnlockText>
         *   {({ isDragging }) => <span>{isDragging ? "Release..." : "Slide to unlock"}</span>}
         * </SlideToUnlockText>
         * ```
         */
        children: JSX.Element | ((props: { isDragging: boolean }) => JSX.Element)
      }

      export function SlideToUnlockText({
        className,
        children,
        style,
        ...props
      }: SlideToUnlockTextProps) {
        const { handleWidth, textOpacity, isDragging } = useSlideToUnlock()

        return (
          <motion.div
            data-slot="text"
            data-dragging={isDragging}
            className={cn("pl-1 text-lg font-medium", className)}
            style={{ marginLeft: handleWidth, opacity: textOpacity, ...style }}
            {...props}
          >
            {typeof children === "function" ? children({ isDragging }) : children}
          </motion.div>
        )
      }

      export type SlideToUnlockHandleProps = ComponentPropsWithoutRef<
        typeof motion.div
      >

      export function SlideToUnlockHandle({
        className,
        children,
        style,
        ...props
      }: SlideToUnlockHandleProps) {
        const {
          x,
          trackRef,
          onDragStart,
          onDragEnd,
          handleWidth: width,
        } = useSlideToUnlock()

        return (
          <motion.div
            data-slot="handle"
            className={cn(
              "absolute top-0 left-0 flex h-10 cursor-grab items-center justify-center rounded-lg bg-white text-zinc-400 shadow-sm active:cursor-grabbing",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
              className
            )}
            style={{ width, x, ...style }}
            drag="x"
            dragConstraints={trackRef}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            {...props}
          >
            {children ?? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M24 12 12.75 3v4.696H0v8.608h12.75V21z"
                  fill="currentColor"
                />
              </svg>
            )}
          </motion.div>
        )
      }

      ````

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { ShimmeringText } from "@/components/shimmering-text"
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from "@/components/slide-to-unlock"
```

```tsx
<SlideToUnlock>
  <SlideToUnlockTrack>
    <SlideToUnlockText>
      <ShimmeringText />
    </SlideToUnlockText>
    <SlideToUnlockHandle />
  </SlideToUnlockTrack>
</SlideToUnlock>
```

## Composition

Use the following composition to build a `SlideToUnlock`

```text
SlideToUnlock
└── SlideToUnlockTrack
    ├── SlideToUnlockText
    │   └── ShimmeringText
    └── SlideToUnlockHandle
```

## API reference

### SlideToUnlock

<TypeTable
  id="type-table-props.ts-SlideToUnlockRootProps"
  type={{
  "id": "props.ts-SlideToUnlockRootProps",
  "name": "SlideToUnlockRootProps",
  "description": "",
  "entries": [
    {
      "name": "handleWidth",
      "description": "Width of the drag handle in pixels.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "56"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onUnlock",
      "description": "Called when the handle is dragged fully to the end.",
      "tags": [],
      "type": "(() => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

### SlideToUnlockText

<TypeTable
  id="type-table-props.ts-SlideToUnlockTextProps"
  type={{
  "id": "props.ts-SlideToUnlockTextProps",
  "name": "SlideToUnlockTextProps",
  "description": "",
  "entries": [
    {
      "name": "children",
      "description": "Accepts a render function as `children` to react to the dragging state.",
      "tags": [
        {
          "name": "example",
          "text": "```tsx\n<SlideToUnlockText>\n  {({ isDragging }) => <span>{isDragging ? \"Release...\" : \"Slide to unlock\"}</span>}\n</SlideToUnlockText>\n```"
        }
      ],
      "type": "JSX.Element | ((props: { isDragging: boolean; }) => JSX.Element)",
      "simplifiedType": "union",
      "required": true,
      "deprecated": false
    }
  ]
}}
/>

## Examples

### Custom color

```tsx
"use client"

import { toast } from "@/components/ui/toast"
import { ShimmeringText } from "@/components/shimmering-text"
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from "@/components/slide-to-unlock"

export default function SlideToUnlockDemo2() {
  return (
    <>
      <SlideToUnlock
        className="bg-linear-to-b from-zinc-800 to-zinc-900"
        onUnlock={() => {
          const myPromise = new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 1000)
          })

          toast.promise(myPromise, {
            loading: "Connecting...",
            success: () => `Connected`,
            error: ({ message }) => `Error: ${message}`,
          })
        }}
      >
        <SlideToUnlockTrack>
          <SlideToUnlockText>
            {({ isDragging }) => (
              <ShimmeringText
                className="[--color:var(--color-zinc-600)] [--shimmering-color:var(--color-zinc-50)]"
                text="slide to answer"
                isStopped={isDragging}
              />
            )}
          </SlideToUnlockText>

          <SlideToUnlockHandle className="bg-linear-to-b from-emerald-500 to-emerald-700 text-white" />
        </SlideToUnlockTrack>
      </SlideToUnlock>
    </>
  )
}

```

### Custom handle

```tsx
"use client"

import { toast } from "@/components/ui/toast"
import { ShimmeringText } from "@/components/shimmering-text"
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from "@/components/slide-to-unlock"

export default function SlideToUnlockDemo3() {
  return (
    <SlideToUnlock
      className="w-45 rounded-full ring-0"
      handleWidth={40}
      onUnlock={() => toast.add({ type: "success", title: "Stopped" })}
    >
      <SlideToUnlockTrack>
        <SlideToUnlockText className="pl-0">
          {({ isDragging }) => (
            <ShimmeringText text="slide to stop" isStopped={isDragging} />
          )}
        </SlideToUnlockText>

        <SlideToUnlockHandle className="w-10 rounded-full dark:bg-zinc-700">
          <svg
            className="size-5 dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          >
            <path
              d="M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z"
              fill="currentColor"
            />
          </svg>
        </SlideToUnlockHandle>
      </SlideToUnlockTrack>
    </SlideToUnlock>
  )
}

```

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on February 20, 2026