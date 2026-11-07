# Mobius Loop Icon

Animated Mobius loop icon that morphs between circles and infinity shape.

```tsx
import { MobiusLoopIcon } from "@/components/mobius-loop-icon"

export default function MobiusLoopIconDemo() {
  return <MobiusLoopIcon className="size-16 text-foreground" />
}

```

<DocPullQuote authorName="OrcDev" authorTagline="Creator of 8bitcn.com" url="https://x.com/orcdev/status/2061155001444012321" quote="looks really nice!" />

Dependencies: motion

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/mobius-loop-icon
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install motion
      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/mobius-loop-icon.tsx" 
      "use client"

      import type { SVGMotionProps } from "motion/react"
      import { motion } from "motion/react"

      const circle1 =
        "M12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4Z"

      const infinity =
        "M 6 16 C 11 16 13 8 18 8 C 23.333 8 23.333 16 18 16 C 13 16 11 8 6 8 C 0.667 8 0.667 16 6 16 Z"

      const circle2 =
        "M12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20Z"

      export function MobiusLoopIcon(props: SVGMotionProps<SVGSVGElement>) {
        return (
          <motion.svg
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
              initial={{ d: circle1 }}
              animate={{
                d: [circle1, infinity, circle2],
              }}
              transition={{
                d: {
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                },
              }}
            />
          </motion.svg>
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { MobiusLoopIcon } from "@/components/mobius-loop-icon"
```

```tsx
<MobiusLoopIcon />
```

## Credits

* [Fluid Functionalism](https://www.fluidfunctionalism.com/docs/thinking-indicator)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on May 30, 2026