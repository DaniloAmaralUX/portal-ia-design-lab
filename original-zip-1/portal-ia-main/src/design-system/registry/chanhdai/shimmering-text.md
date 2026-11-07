# Shimmering Text

Smooth, light-sweeping shimmer animation for text.

<Callout title="Recommended alternative">
  The Shimmering Text component uses JS-based animations. For better
  performance, consider using the CSS-based shadcn/ui
  [shimmer](https://ui.shadcn.com/docs/utils/shimmer) utilities instead.
</Callout>

```tsx
import { ShimmeringText } from "@/components/shimmering-text"

export default function ShimmeringTextDemo() {
  return (
    <ShimmeringText className="text-2xl font-medium" text="Shimmering Text" />
  )
}

```

<DocPullQuote authorName="Matt" authorTagline="Creator of ui.bklit.com" url="https://x.com/uixmat/status/2061477189506187332" quote="Using an adapted version of your Shimmer here @iamncdai" />

Dependencies: motion

## Use cases

* Thinking or generating status in an AI chat.
* Loading labels while content is on the way.
* Hint text such as slide to unlock.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/shimmering-text
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

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { ShimmeringText } from "@/components/shimmering-text"
```

```tsx
<ShimmeringText text="slide to unlock" />
```

## API reference

### ShimmeringText

<TypeTable
  id="type-table-props.ts-ShimmeringTextProps"
  type={{
  "id": "props.ts-ShimmeringTextProps",
  "name": "ShimmeringTextProps",
  "description": "",
  "entries": [
    {
      "name": "text",
      "description": "The text to render with the shimmering effect.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "duration",
      "description": "Duration in seconds for one shimmer cycle.",
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
      "name": "isStopped",
      "description": "Whether the shimmer animation is paused.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "false"
        }
      ],
      "type": "boolean | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Examples

### Custom color

```tsx
import { ShimmeringText } from "@/components/shimmering-text"

export default function ShimmeringTextDemo2() {
  return (
    <ShimmeringText
      className="font-medium [--color:#fbbf24] [--shimmering-color:#ca8a04] dark:[--color:#f59e0b] dark:[--shimmering-color:#fcd34d]"
      text="Processing your request with AI ..."
    />
  )
}

```

CSS Variables explanation:

* `--color`: Base text color (the default/resting state of characters)
* `--shimmering-color`: Peak highlight color (the bright color characters transition to during the shimmer effect)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on June 27, 2026