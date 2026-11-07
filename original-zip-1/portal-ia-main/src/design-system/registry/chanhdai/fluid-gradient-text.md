# Fluid Gradient Text

Render text with a fluid gradient that shifts with pointer movement.

```tsx
import { FluidGradientText } from "@/components/fluid-gradient-text"

export default function FluidGradientTextDemo() {
  return (
    <div className="relative w-full text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 text-center text-xs text-muted-foreground select-none">
        <span className="hidden pointer-fine:inline-block">
          Move your cursor within the text below
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Press anywhere within the text below
        </span>
      </div>

      <FluidGradientText text="shadcn" />
    </div>
  )
}

```

Dependencies: motion

## Features

* Gradient shifts with horizontal pointer movement for an interactive text effect.
* Smooth transitions keep the effect natural while moving across the text.
* `svgViewBoxWidth` and `svgViewBoxHeight` let you tune text scale for different layouts.

## Use cases

* Headline in a landing page hero.
* Large wordmark in a footer or splash screen.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/fluid-gradient-text
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install motion
      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/fluid-gradient-text.tsx" 
      "use client"

      import { motion, useMotionValue, useSpring, useTransform } from "motion/react"

      export type FluidGradientTextProps = {
        /** Text content rendered inside the SVG. */
        text: string
        /**
         * SVG viewBox width used to scale the gradient and text layout.
         * @default 1200
         * */
        svgViewBoxWidth?: number
        /**
         * SVG viewBox height used as the base text size.
         * @default 300
         * */
        svgViewBoxHeight?: number
      }

      export function FluidGradientText({
        text,
        svgViewBoxWidth = 1200,
        svgViewBoxHeight = 300,
      }: FluidGradientTextProps) {
        const gradientX1Raw = useMotionValue(0.5)
        const gradientX1 = useSpring(
          useTransform(gradientX1Raw, [0, 1], [0, svgViewBoxWidth]),
          {
            stiffness: 150,
            damping: 25,
          }
        )

        const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
          const containerRect = event.currentTarget.getBoundingClientRect()
          gradientX1Raw.set(
            (event.clientX - containerRect.left) / containerRect.width
          )
        }

        const handleMouseLeave = () => {
          gradientX1Raw.set(0.5)
        }

        return (
          <div
            className="relative size-full overflow-hidden after:absolute after:bottom-0 after:h-px after:w-full after:bg-current/15"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              className="size-full translate-y-[37.5%] select-none"
              viewBox={`0 0 ${svgViewBoxWidth} ${svgViewBoxHeight}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="2"
                fill="url(#fluid_gradient_text_linear)"
                style={{
                  fontFamily: "Helvetica",
                  fontSize: svgViewBoxHeight,
                  fontWeight: "bold",
                }}
              >
                {text}
              </text>
              <defs>
                <motion.linearGradient
                  id="fluid_gradient_text_linear"
                  x1={gradientX1}
                  y1="0"
                  x2={svgViewBoxWidth / 2}
                  y2={svgViewBoxHeight}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.625" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="1" stopColor="currentColor" />
                </motion.linearGradient>
              </defs>
            </svg>
          </div>
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { FluidGradientText } from "@/components/fluid-gradient-text"
```

```tsx
<FluidGradientText text="shadcn" />
```

## API reference

### FluidGradientText

<TypeTable
  id="type-table-fluid-gradient-text.tsx-FluidGradientTextProps"
  type={{
  "id": "fluid-gradient-text.tsx-FluidGradientTextProps",
  "name": "FluidGradientTextProps",
  "description": "",
  "entries": [
    {
      "name": "text",
      "description": "Text content rendered inside the SVG.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "svgViewBoxWidth",
      "description": "SVG viewBox width used to scale the gradient and text layout.",
      "tags": [
        {
          "name": "default",
          "text": "1200"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "svgViewBoxHeight",
      "description": "SVG viewBox height used as the base text size.",
      "tags": [
        {
          "name": "default",
          "text": "300"
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

## Credits

* [Vercel](https://vercel.com/design)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on May 3, 2026