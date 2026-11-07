# Spinning Circular Text

Text arranged in a circle with a continuous spinning animation.

```tsx
import { SpinningCircularText } from "@/components/spinning-circular-text"

export default function SpinningCircularTextDemo() {
  return (
    <SpinningCircularText
      className="text-foreground"
      text="Built with care by ncdai • "
    />
  )
}

```

## Features

* Adjustable character spacing and font size.
* Container size scales automatically to fit the text ring.

## Use cases

* Badge in a site footer.
* Decorative stamp around a logo or call to action.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/spinning-circular-text
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

      <Step>Add the animation to your global CSS</Step>

      ```css title="globals.css"
      @theme inline {
        --animate-spin-ccw: spin-ccw
          var(--tw-animation-duration, var(--tw-duration, 6s)) linear infinite;

        @keyframes spin-ccw {
          to {
            rotate: -360deg;
          }
        }
      }
      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/spinning-circular-text.tsx" 
      import { cn } from "@/lib/utils"

      export type SpinningCircularTextProps = Omit<
        React.ComponentProps<"div">,
        "children"
      > & {
        text: string

        /**
         * @defaultValue 1
         * */
        charSpacing?: number

        /**
         * @defaultValue 1rem
         * */
        fontSize?: string

        /**
         * Class names applied to the spinning ring, e.g. to override the
         * animation duration (`duration-[10s]`) or easing.
         * */
        spinClassName?: string

        /**
         * Customize how each character is rendered, e.g. to wrap it in a
         * `motion.span` for per-character effects. The returned node is placed
         * inside a positioned wrapper, so positioning is handled for you.
         * */
        renderChar?: (char: string, index: number) => React.ReactNode
      }

      export function SpinningCircularText({
        text,
        charSpacing = 1,
        fontSize = "1rem",
        spinClassName,
        renderChar,
        className,
        style,
        ...props
      }: SpinningCircularTextProps) {
        return (
          <div
            className={cn(
              "grid size-(--sc-container-size) place-items-center font-mono font-medium uppercase select-none",
              className
            )}
            style={
              {
                "--sc-size": fontSize,
                "--sc-char-count": text.length,
                "--sc-char-spacing": charSpacing,
                "--sc-inner-angle": "calc((360 / var(--sc-char-count)) * 1deg)",
                "--sc-radius-factor":
                  "calc(var(--sc-char-spacing) / sin(var(--sc-inner-angle)))",
                "--sc-radius": "calc(var(--sc-radius-factor) * -1ch)",
                "--sc-container-size":
                  "calc(var(--sc-radius-factor) * var(--sc-size) * 2)",
                ...style,
              } as React.CSSProperties
            }
            {...props}
          >
            <div
              className={cn(
                "relative animate-spin-ccw text-(size:--sc-size) leading-none",
                "*:absolute *:top-1/2 *:left-1/2 *:inline-block",
                "*:[--sc-char-rotate:calc(var(--sc-inner-angle)*var(--sc-char-index))]",
                "*:transform-[translate(-50%,-50%)_rotate(var(--sc-char-rotate))_translateY(var(--sc-radius))]",
                spinClassName
              )}
              aria-hidden
            >
              {text.split("").map((char, index) => (
                <span
                  key={index}
                  style={{ "--sc-char-index": index } as React.CSSProperties}
                >
                  {renderChar ? renderChar(char, index) : char}
                </span>
              ))}
            </div>
            <span className="sr-only">{text}</span>
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
import { SpinningCircularText } from "@/components/spinning-circular-text"
```

```tsx
<SpinningCircularText text="Built with care by ncdai • " />
```

## Examples

### Shimmering text

```tsx
"use client"

import { motion, useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"

import { SpinningCircularText } from "@/components/spinning-circular-text"

const TEXT = "Built with care by ncdai • "
const DURATION = 4

export function SpinningCircularTextDemo2() {
  const shouldReduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()

  return (
    <SpinningCircularText
      text={TEXT}
      charSpacing={1.2}
      className="size-[round(up,var(--sc-container-size),var(--spacing))] [--color:var(--muted-foreground)] [--shimmering-color:var(--foreground)]"
      spinClassName="duration-[12s] motion-reduce:animate-none"
      renderChar={(char, index) =>
        shouldReduceMotion ? (
          <span className="text-(--shimmering-color)">{char}</span>
        ) : (
          <motion.span
            // Re-render the character when the theme changes to restart the animation with the new colors
            key={resolvedTheme}
            animate={{
              color: [
                "var(--color)",
                "var(--shimmering-color)",
                "var(--color)",
              ],
            }}
            transition={{
              duration: DURATION,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: TEXT.length * 0.03,
              delay: (index * DURATION) / TEXT.length,
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        )
      }
    />
  )
}

```

## API reference

### SpinningCircularText

<TypeTable
  id="type-table-props.ts-SpinningCircularTextProps"
  type={{
  "id": "props.ts-SpinningCircularTextProps",
  "name": "SpinningCircularTextProps",
  "description": "",
  "entries": [
    {
      "name": "text",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "charSpacing",
      "description": "",
      "tags": [
        {
          "name": "defaultValue",
          "text": "1"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "fontSize",
      "description": "",
      "tags": [
        {
          "name": "defaultValue",
          "text": "1rem"
        }
      ],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "spinClassName",
      "description": "Class names applied to the spinning ring, e.g. to override the\nanimation duration (`duration-[10s]`) or easing.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "renderChar",
      "description": "Customize how each character is rendered, e.g. to wrap it in a\n`motion.span` for per-character effects. The returned node is placed\ninside a positioned wrapper, so positioning is handled for you.",
      "tags": [],
      "type": "((char: string, index: number) => React.ReactNode) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Accessibility

* Screen readers announce the full text, and the spinning ring stays hidden.

## Credits

* [@jh3yy](https://x.com/jh3yy/status/1618297458752368640)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on May 30, 2026