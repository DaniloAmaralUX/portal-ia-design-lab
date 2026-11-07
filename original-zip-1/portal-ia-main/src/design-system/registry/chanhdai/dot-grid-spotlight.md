# Dot Grid Spotlight

Interactive dot grid with a cursor-tracking spotlight effect.

```tsx
"use client"

import { useTheme } from "next-themes"

import { DotGridSpotlight } from "@/components/dot-grid-spotlight"

const DOT_COLOR = {
  light: {
    default: "rgba(0, 0, 0, 0.08)",
    active: "rgba(0, 0, 0, 0.16)",
  },
  dark: {
    default: "rgba(255, 255, 255, 0.06)",
    active: "rgba(255, 255, 255, 0.12)",
  },
} as const

export default function DotGridSpotlightDemo() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <div className="relative aspect-square w-xs max-w-full overflow-hidden rounded-xl border bg-black/1 dark:bg-white/5">
      <DotGridSpotlight
        dotColor={DOT_COLOR[theme]?.default}
        activeDotColor={DOT_COLOR[theme]?.active}
      />
    </div>
  )
}

```

## Use cases

* Cover area at the top of a profile page.
* Background behind a hero section.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/dot-grid-spotlight
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install cn
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/dot-grid-spotlight.tsx" 
      "use client"

      import React, { useEffect, useRef } from "react"

      import { cn } from "@/lib/utils"

      export type DotGridSpotlightProps = {
        /**
         * The base color of the default/inactive dots.
         * @default "rgba(255, 255, 255, 0.05)"
         */
        dotColor?: string

        /**
         * The color of the active dots when illuminated by the cursor's spotlight.
         * @default "rgba(255, 255, 255, 0.1)"
         */
        activeDotColor?: string

        /**
         * The distance (in pixels) between each dot in the grid.
         * @default 10
         */
        spacing?: number

        /**
         * The default radius of the dots when they are outside the interaction area.
         * @default 1
         */
        baseRadius?: number

        /**
         * The maximum radius of a dot when it is at the exact center of the cursor.
         * @default 2
         */
        activeRadius?: number

        /**
         * The radius (in pixels) of the interaction area (spotlight) around the cursor.
         * @default 128
         */
        interactionRadius?: number

        /**
         * The maximum opacity (alpha) at the exact center of the spotlight.
         * Accepts a value between `0` and `1` (e.g., `1` for full opacity).
         * @default 1.0
         */
        activeMaxAlpha?: number

        /**
         * The minimum opacity (alpha) at the outer edge of the spotlight.
         * Accepts a value between `0` and `1` (e.g., a low value for a soft, subtle fade).
         * @default 0.5
         */
        activeMinAlpha?: number

        /**
         * Optional CSS class name to apply to the canvas or its wrapper.
         */
        className?: string
      }

      export function DotGridSpotlight({
        dotColor = "rgba(255, 255, 255, 0.05)",
        activeDotColor = "rgba(255, 255, 255, 0.1)",
        spacing = 10,
        baseRadius = 1,
        activeRadius = 2,
        interactionRadius = 128,
        activeMaxAlpha = 1.0,
        activeMinAlpha = 0.5,
        className,
      }: DotGridSpotlightProps) {
        const canvasRef = useRef<HTMLCanvasElement>(null)
        const mouse = useRef({ x: -1000, y: -1000, isActive: false })

        useEffect(() => {
          const canvas = canvasRef.current
          if (!canvas) return

          const ctx = canvas.getContext("2d")
          if (!ctx) return

          let width = 0
          let height = 0
          let renderFrameId: number | null = null

          const draw = () => {
            ctx.clearRect(0, 0, width, height)

            const offsetX = (width % spacing) / 2
            const offsetY = (height % spacing) / 2

            for (let x = offsetX; x <= width; x += spacing) {
              for (let y = offsetY; y <= height; y += spacing) {
                const dx = x - mouse.current.x
                const dy = y - mouse.current.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                let currentRadius = baseRadius
                let currentColor = dotColor
                let currentAlpha = 1.0

                if (mouse.current.isActive && distance < interactionRadius) {
                  const factor = 1 - distance / interactionRadius
                  currentRadius = baseRadius + (activeRadius - baseRadius) * factor
                  currentColor = activeDotColor
                  currentAlpha =
                    activeMinAlpha + (activeMaxAlpha - activeMinAlpha) * factor
                }

                ctx.globalAlpha = currentAlpha
                ctx.beginPath()
                ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
                ctx.fillStyle = currentColor
                ctx.fill()
              }
            }
            ctx.globalAlpha = 1.0
          }

          const resizeCanvas = () => {
            const parent = canvas.parentElement
            if (!parent) return

            const dpr = window.devicePixelRatio || 1
            width = parent.clientWidth
            height = parent.clientHeight

            if (width === 0 || height === 0) return

            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.scale(dpr, dpr)

            draw()

            requestAnimationFrame(() => {
              canvas.dataset.ready = "true"
            })
          }

          const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouse.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
              isActive: true,
            }

            if (renderFrameId === null) {
              renderFrameId = requestAnimationFrame(() => {
                draw()
                renderFrameId = null
              })
            }
          }

          const handleMouseLeave = () => {
            mouse.current.isActive = false
            if (renderFrameId === null) {
              renderFrameId = requestAnimationFrame(() => {
                draw()
                renderFrameId = null
              })
            }
          }

          canvas.addEventListener("mousemove", handleMouseMove)
          canvas.addEventListener("mouseleave", handleMouseLeave)

          const resizeObserver = new ResizeObserver(() => resizeCanvas())
          if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

          resizeCanvas()

          return () => {
            canvas.removeEventListener("mousemove", handleMouseMove)
            canvas.removeEventListener("mouseleave", handleMouseLeave)
            resizeObserver.disconnect()
            if (renderFrameId !== null) cancelAnimationFrame(renderFrameId)
          }
        }, [
          spacing,
          baseRadius,
          activeRadius,
          interactionRadius,
          dotColor,
          activeDotColor,
          activeMaxAlpha,
          activeMinAlpha,
        ])

        const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
          const rect = canvasRef.current?.getBoundingClientRect()
          if (rect) {
            mouse.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
              isActive: true,
            }
          }
        }

        const handleMouseLeave = () => {
          mouse.current.isActive = false
        }

        return (
          <canvas
            ref={canvasRef}
            data-ready="false"
            className={cn(
              "pointer-events-auto absolute inset-0 block opacity-0 transition-opacity! duration-500 data-[ready=true]:opacity-100",
              className
            )}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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
import { DotGridSpotlight } from "@/components/dot-grid-spotlight"
```

```tsx
<div className="relative aspect-square w-xs">
  <DotGridSpotlight />
</div>
```

## API reference

### DotGridSpotlight

<TypeTable
  id="type-table-dot-grid-spotlight.tsx-DotGridSpotlightProps"
  type={{
  "id": "dot-grid-spotlight.tsx-DotGridSpotlightProps",
  "name": "DotGridSpotlightProps",
  "description": "",
  "entries": [
    {
      "name": "dotColor",
      "description": "The base color of the default/inactive dots.",
      "tags": [
        {
          "name": "default",
          "text": "\"rgba(255, 255, 255, 0.05)\""
        }
      ],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "activeDotColor",
      "description": "The color of the active dots when illuminated by the cursor's spotlight.",
      "tags": [
        {
          "name": "default",
          "text": "\"rgba(255, 255, 255, 0.1)\""
        }
      ],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "spacing",
      "description": "The distance (in pixels) between each dot in the grid.",
      "tags": [
        {
          "name": "default",
          "text": "10"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "baseRadius",
      "description": "The default radius of the dots when they are outside the interaction area.",
      "tags": [
        {
          "name": "default",
          "text": "1"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "activeRadius",
      "description": "The maximum radius of a dot when it is at the exact center of the cursor.",
      "tags": [
        {
          "name": "default",
          "text": "2"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "interactionRadius",
      "description": "The radius (in pixels) of the interaction area (spotlight) around the cursor.",
      "tags": [
        {
          "name": "default",
          "text": "128"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "activeMaxAlpha",
      "description": "The maximum opacity (alpha) at the exact center of the spotlight.\nAccepts a value between `0` and `1` (e.g., `1` for full opacity).",
      "tags": [
        {
          "name": "default",
          "text": "1.0"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "activeMinAlpha",
      "description": "The minimum opacity (alpha) at the outer edge of the spotlight.\nAccepts a value between `0` and `1` (e.g., a low value for a soft, subtle fade).",
      "tags": [
        {
          "name": "default",
          "text": "0.5"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "className",
      "description": "Optional CSS class name to apply to the canvas or its wrapper.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Credits

* [ChatGPT](https://chatgpt.com)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on May 22, 2026