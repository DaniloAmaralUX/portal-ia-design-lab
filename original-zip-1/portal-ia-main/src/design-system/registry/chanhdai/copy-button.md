# Copy Button

Copy text to clipboard with visual, haptic, and audio feedback.

```tsx
import { CopyButton } from "@/components/copy-button"

export default function CopyButtonDemo() {
  return (
    <div className="flex items-center gap-2">
      <CopyButton
        className="relative"
        variant="secondary"
        size="icon-sm"
        text="Text 1"
      />

      <CopyButton
        className="relative gap-1.5 pr-2.5 pl-2"
        variant="outline"
        size="sm"
        text="Text 2"
      >
        Copy
      </CopyButton>
    </div>
  )
}

```

Dependencies: motion, @rexa-developer/tiks, web-haptics, lucide-react

Registry dependencies: button, icon-swap

## Features

* Animated icon transitions across idle, success, and error states.
* Haptic feedback confirms copy success on supported devices.
* UI sounds play distinct success and error cues.
* Accepts a string or function for dynamic content.
* Callback support for success and error events.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/copy-button
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install cn class-variance-authority lucide-react motion @base-ui/react @rexa-developer/tiks web-haptics
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Install the required components</Step>

      * [Button](https://ui.shadcn.com/docs/components/base/button)

      <Step>Copy and paste the following code into your project</Step>

      ```ts title="hooks/use-copy-to-clipboard.ts" 
      "use client"

      import { useCallback, useRef, useState } from "react"
      import { useTiks } from "@rexa-developer/tiks/react"
      import { useWebHaptics } from "web-haptics/react"

      export type CopyState = "idle" | "done" | "error"

      export type UseCopyToClipboardOptions = {
        onCopySuccess?: (text: string) => void
        onCopyError?: (error: Error) => void
        resetDelay?: number
      }

      export function useCopyToClipboard({
        onCopySuccess,
        onCopyError,
        resetDelay = 1500,
      }: UseCopyToClipboardOptions = {}) {
        const [state, setState] = useState<CopyState>("idle")
        const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

        const { trigger: haptic } = useWebHaptics()
        const { success: tiksSuccess, error: tiksError } = useTiks()

        const copy = useCallback(
          async (text: string | (() => string)) => {
            // Clear any pending reset
            if (resetTimeoutRef.current) {
              clearTimeout(resetTimeoutRef.current)
            }

            try {
              const finalText = typeof text === "function" ? text() : text
              await navigator.clipboard.writeText(finalText)

              setState("done")

              haptic("success")
              tiksSuccess()

              onCopySuccess?.(finalText)
            } catch (error) {
              setState("error")

              haptic("error")
              tiksError()

              onCopyError?.(error instanceof Error ? error : new Error("Copy failed"))
            } finally {
              // Schedule reset to idle
              resetTimeoutRef.current = setTimeout(() => {
                setState("idle")
              }, resetDelay)
            }
          },
          [onCopySuccess, onCopyError, haptic, tiksSuccess, tiksError, resetDelay]
        )

        return { state, copy } as const
      }

      ```

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

      ```tsx title="components/copy-button.tsx" 
      "use client"

      import type { ComponentProps } from "react"
      import { CheckIcon, CircleXIcon, CopyIcon } from "lucide-react"
      import { motion } from "motion/react"

      import { cn } from "@/lib/utils"
      import type { CopyState } from "@/hooks/use-copy-to-clipboard"
      import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
      import { Button } from "@/components/ui/button"
      import { IconSwap, IconSwapItem } from "@/components/icon-swap"

      export type CopyStateIconProps = {
        state: CopyState
        /** Custom icon for idle state. */
        idleIcon?: React.ReactNode
        /** Custom icon for done state. */
        doneIcon?: React.ReactNode
        /** Custom icon for error state. */
        errorIcon?: React.ReactNode
      }

      export function CopyStateIcon({
        state,
        idleIcon,
        doneIcon,
        errorIcon,
      }: CopyStateIconProps) {
        return (
          <IconSwap>
            <IconSwapItem key={state} as={motion.span}>
              {state === "idle" && (idleIcon ?? <CopyIcon data-slot="idle-icon" />)}

              {state === "done" && (doneIcon ?? <CheckIcon data-slot="done-icon" />)}

              {state === "error" &&
                (errorIcon ?? <CircleXIcon data-slot="error-icon" />)}
            </IconSwapItem>
          </IconSwap>
        )
      }

      export type CopyButtonProps = ComponentProps<typeof Button> & {
        /** The text to copy, or a function that returns the text. */
        text: string | (() => string)
        /** Called with the copied text on successful copy. */
        onCopySuccess?: (text: string) => void
        /** Called with the error if the copy operation fails. */
        onCopyError?: (error: Error) => void
      } & Omit<CopyStateIconProps, "state">

      export function CopyButton({
        className,
        size = "icon",
        children,
        text,
        idleIcon,
        doneIcon,
        errorIcon,
        onClick,
        onCopySuccess,
        onCopyError,
        ...props
      }: CopyButtonProps) {
        const { state, copy } = useCopyToClipboard({
          onCopySuccess,
          onCopyError,
        })

        return (
          <Button
            className={cn("will-change-transform", className)}
            size={size}
            onClick={(e) => {
              copy(text)
              onClick?.(e)
            }}
            aria-label="Copy"
            {...props}
          >
            <CopyStateIcon
              state={state}
              idleIcon={idleIcon}
              doneIcon={doneIcon}
              errorIcon={errorIcon}
            />
            {children}
          </Button>
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { CopyButton } from "@/components/copy-button"
```

```tsx
<CopyButton text="Some text to copy" />
```

## API reference

### CopyButton

Extends [Button](https://ui.shadcn.com/docs/components/base/button) with clipboard functionality.

<TypeTable
  id="type-table-props.ts-CopyButtonProps"
  type={{
  "id": "props.ts-CopyButtonProps",
  "name": "CopyButtonProps",
  "description": "",
  "entries": [
    {
      "name": "text",
      "description": "The text to copy, or a function that returns the text.",
      "tags": [],
      "type": "string | (() => string)",
      "simplifiedType": "union",
      "required": true,
      "deprecated": false
    },
    {
      "name": "idleIcon",
      "description": "Custom icon for idle state.",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "doneIcon",
      "description": "Custom icon for done state.",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "errorIcon",
      "description": "Custom icon for error state.",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onCopySuccess",
      "description": "Called with the copied text on successful copy.",
      "tags": [],
      "type": "((text: string) => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onCopyError",
      "description": "Called with the error if the copy operation fails.",
      "tags": [],
      "type": "((error: Error) => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

See [shadcn/ui](https://ui.shadcn.com/docs/components/base/button#api-reference) documentation for more information.

## References

* [WebHaptics](https://haptics.lochie.me) by [@lochieaxon](https://x.com/lochieaxon)
* [tiks](https://rexa-developer.github.io/tiks) by [Rexa Developer](https://github.com/rexa-developer)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on May 18, 2026