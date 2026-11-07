# Status Button

Button that shows loading and success feedback for async actions.

```tsx
"use client"

import { StatusButton } from "@/components/status-button"

function fakeRequest() {
  return new Promise<void>((resolve) => setTimeout(resolve, 1500))
}

export default function StatusButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <StatusButton onClick={fakeRequest} successLabel="Submitted">
        Submit
      </StatusButton>

      <StatusButton
        variant="outline"
        onClick={fakeRequest}
        successLabel="Saved"
      >
        Save
      </StatusButton>

      <StatusButton size="sm" onClick={fakeRequest}>
        Copy
      </StatusButton>
    </div>
  )
}

```

Dependencies: motion, lucide-react

Registry dependencies: button, use-controllable-state

## Features

* Works from an async click handler, or follows a status you control from form state.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/status-button
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install cn class-variance-authority lucide-react motion @base-ui/react
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Install the required components</Step>

      * [Button](https://ui.shadcn.com/docs/components/base/button)

      <Step>Add the spinner animation to your global CSS</Step>

      ```css title="globals.css"
      @theme inline {
        --animate-spinner-opacity: spinner-opacity
          var(--tw-animation-duration, var(--tw-duration, 1s)) linear infinite;

        @keyframes spinner-opacity {
          from {
            opacity: 1;
          }
          to {
            opacity: 0.15;
          }
        }
      }
      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="hooks/use-controllable-state.tsx" 
      // Thanks @radix-ui

      import * as React from "react"

      // use-layout-effect.tsx
      // https://github.com/radix-ui/primitives/blob/main/packages/react/use-layout-effect/src/use-layout-effect.tsx

      /**
       * On the server, React emits a warning when calling `useLayoutEffect`.
       * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
       * We use this safe version which suppresses the warning by replacing it with a noop on the server.
       *
       * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
       */
      const useLayoutEffect = globalThis?.document ? React.useLayoutEffect : () => {}

      // use-controllable-state.tsx
      // https://github.com/radix-ui/primitives/blob/main/packages/react/use-controllable-state/src/use-controllable-state.tsx

      // Prevent bundlers from trying to optimize the import
      const useInsertionEffect: typeof useLayoutEffect =
        (React as never)[" useInsertionEffect ".trim().toString()] || useLayoutEffect

      type ChangeHandler<T> = (state: T) => void
      type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>

      interface UseControllableStateParams<T> {
        prop?: T | undefined
        defaultProp: T
        onChange?: ChangeHandler<T>
        caller?: string
      }

      export function useControllableState<T>({
        prop,
        defaultProp,
        onChange = () => {},
        caller,
      }: UseControllableStateParams<T>): [T, SetStateFn<T>] {
        const [uncontrolledProp, setUncontrolledProp, onChangeRef] =
          useUncontrolledState({
            defaultProp,
            onChange,
          })
        const isControlled = prop !== undefined
        const value = isControlled ? prop : uncontrolledProp

        // OK to disable conditionally calling hooks here because they will always run
        // consistently in the same environment. Bundlers should be able to remove the
        // code block entirely in production.
        /* eslint-disable react-hooks/rules-of-hooks */
        if (process.env.NODE_ENV !== "production") {
          const isControlledRef = React.useRef(prop !== undefined)
          React.useEffect(() => {
            const wasControlled = isControlledRef.current
            if (wasControlled !== isControlled) {
              const from = wasControlled ? "controlled" : "uncontrolled"
              const to = isControlled ? "controlled" : "uncontrolled"
              console.warn(
                `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
              )
            }
            isControlledRef.current = isControlled
          }, [isControlled, caller])
        }
        /* eslint-enable react-hooks/rules-of-hooks */

        const setValue = React.useCallback<SetStateFn<T>>(
          (nextValue) => {
            if (isControlled) {
              const value = isFunction(nextValue) ? nextValue(prop) : nextValue
              if (value !== prop) {
                onChangeRef.current?.(value)
              }
            } else {
              setUncontrolledProp(nextValue)
            }
          },
          [isControlled, prop, setUncontrolledProp, onChangeRef]
        )

        return [value, setValue]
      }

      function useUncontrolledState<T>({
        defaultProp,
        onChange,
      }: Omit<UseControllableStateParams<T>, "prop">): [
        Value: T,
        setValue: React.Dispatch<React.SetStateAction<T>>,
        OnChangeRef: React.RefObject<ChangeHandler<T> | undefined>,
      ] {
        const [value, setValue] = React.useState(defaultProp)
        const prevValueRef = React.useRef(value)

        const onChangeRef = React.useRef(onChange)
        useInsertionEffect(() => {
          onChangeRef.current = onChange
        }, [onChange])

        React.useEffect(() => {
          if (prevValueRef.current !== value) {
            onChangeRef.current?.(value)
            prevValueRef.current = value
          }
        }, [value, prevValueRef])

        return [value, setValue, onChangeRef]
      }

      function isFunction(value: unknown): value is (...args: never[]) => unknown {
        return typeof value === "function"
      }

      ```

      ```tsx title="components/status-button.tsx" 
      "use client"

      import { useEffect } from "react"
      import { CheckIcon } from "lucide-react"
      import {
        AnimatePresence,
        motion,
        useReducedMotion,
        type Transition,
        type Variants,
      } from "motion/react"

      import { cn } from "@/lib/utils"
      import { Button } from "@/components/ui/button"
      import { useControllableState } from "@/hooks/use-controllable-state"

      export type ButtonStatus = "idle" | "loading" | "success"

      const DEFAULT_SUCCESS_DURATION = 1500

      const swapVariants: Variants = {
        initial: { opacity: 0, y: 8, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -8, filter: "blur(4px)" },
      }

      const reducedMotionVariants: Variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }

      // A spring keeps its velocity when the status changes mid-swap; a cubic-bezier
      // would restart from zero.
      const swapTransition: Transition = {
        type: "spring",
        duration: 0.3,
        bounce: 0,
      }

      // Bounce only on the entrance, and only on movement: opacity and blur would
      // overshoot.
      const successVariants: Variants = {
        ...swapVariants,
        animate: {
          ...swapVariants.animate,
          transition: {
            type: "spring",
            duration: 0.45,
            bounce: 0.35,
            opacity: swapTransition,
            filter: swapTransition,
          },
        },
      }

      export type StatusButtonProps = Omit<
        React.ComponentProps<typeof Button>,
        "onClick" | "children"
      > & {
        children: React.ReactNode
        /**
         * Uncontrolled mode: loading while the returned promise is pending, then
         * success. Omit it when the form owns the submission.
         */
        onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
        /** Controlled mode, e.g. derived from `useActionState`. */
        status?: ButtonStatus
        /** Also called for the automatic return to idle after `successDuration`. */
        onStatusChange?: (status: ButtonStatus) => void
        /** Shown next to the check icon, e.g. "Submitted" for a "Submit" button. */
        successLabel?: React.ReactNode
        successDuration?: number
      }

      export function StatusButton({
        children,
        className,
        onClick,
        status: statusProp,
        onStatusChange,
        successLabel,
        successDuration = DEFAULT_SUCCESS_DURATION,
        ...props
      }: StatusButtonProps) {
        const [status, setStatus] = useControllableState({
          prop: statusProp,
          defaultProp: "idle",
          onChange: onStatusChange,
          caller: "StatusButton",
        })
        const shouldReduceMotion = useReducedMotion()

        useEffect(() => {
          if (status !== "success") return

          const timeoutId = window.setTimeout(
            () => setStatus("idle"),
            successDuration
          )
          return () => window.clearTimeout(timeoutId)
        }, [status, successDuration, setStatus])

        const isBusy = status !== "idle"

        const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
          if (isBusy) {
            event.preventDefault()
            return
          }

          if (!onClick) return

          setStatus("loading")

          try {
            await onClick(event)
            setStatus("success")
          } catch (error) {
            setStatus("idle")
            throw error
          }
        }

        const variants = shouldReduceMotion ? reducedMotionVariants : swapVariants
        const transition = shouldReduceMotion ? { duration: 0 } : swapTransition

        const successContent = (
          <>
            <CheckIcon />
            {successLabel ?? <span className="sr-only">Success</span>}
          </>
        )

        return (
          <Button
            data-status={status}
            aria-busy={status === "loading"}
            // Not `disabled`: busy keeps focus and the normal look, and the click
            // handler ignores presses meanwhile.
            aria-disabled={isBusy || undefined}
            onClick={handleClick}
            className={cn(
              "inline-grid justify-items-center *:col-start-1 *:row-start-1 *:flex *:items-center *:gap-[inherit]",
              className
            )}
            {...props}
          >
            {/* Invisible copies of the widest states keep the button's width fixed. */}
            <span aria-hidden className="invisible">
              {children}
            </span>
            <span aria-hidden className="invisible">
              {successContent}
            </span>

            <AnimatePresence initial={false}>
              {status === "idle" && (
                <motion.span
                  key="idle"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                >
                  {children}
                </motion.span>
              )}

              {status === "loading" && (
                <motion.span
                  key="loading"
                  role="status"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                >
                  <Spinner />
                  <span className="sr-only">Loading</span>
                </motion.span>
              )}

              {status === "success" && (
                <motion.span
                  key="success"
                  role="status"
                  variants={shouldReduceMotion ? variants : successVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                >
                  {successContent}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        )
      }

      function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
        return (
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            fill="currentColor"
            className={cn("size-4 *:animate-spinner-opacity", className)}
            {...props}
          >
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              style={{ animationDelay: "-900ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(36 8 8)"
              style={{ animationDelay: "-800ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(72 8 8)"
              style={{ animationDelay: "-700ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(108 8 8)"
              style={{ animationDelay: "-600ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(144 8 8)"
              style={{ animationDelay: "-500ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(180 8 8)"
              style={{ animationDelay: "-400ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(216 8 8)"
              style={{ animationDelay: "-300ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(252 8 8)"
              style={{ animationDelay: "-200ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(288 8 8)"
              style={{ animationDelay: "-100ms" }}
            />
            <rect
              x="11.84"
              y="7.25"
              width="4"
              height="1.5"
              rx="0.75"
              transform="rotate(324 8 8)"
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
import { StatusButton } from "@/components/status-button"
```

```tsx
<StatusButton onClick={save} successLabel="Saved">
  Save
</StatusButton>
```

Return a promise from `onClick`. The button shows a spinner while the promise is pending, then the success label, then returns to idle. If the promise rejects, the button returns to idle right away.

### Controlled

When a form owns the submission, pass `status` and `onStatusChange` instead of `onClick`. The button still returns to idle on its own, and `onStatusChange` receives `"idle"` when that happens.

```tsx
import { StatusButton, type ButtonStatus } from "@/components/status-button"

const [status, setStatus] = useState<ButtonStatus>("idle")
```

```tsx
<StatusButton
  type="submit"
  status={status}
  onStatusChange={setStatus}
  successLabel="Sent"
>
  Send
</StatusButton>
```

## API reference

### StatusButton

Extends [Button](https://ui.shadcn.com/docs/components/base/button) with loading and success states.

<TypeTable
  id="type-table-props.ts-StatusButtonProps"
  type={{
  "id": "props.ts-StatusButtonProps",
  "name": "StatusButtonProps",
  "description": "",
  "entries": [
    {
      "name": "onClick",
      "description": "Uncontrolled mode: loading while the returned promise is pending, then\nsuccess. Omit it when the form owns the submission.",
      "tags": [],
      "type": "((event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    },
    {
      "name": "status",
      "description": "Controlled mode, e.g. derived from `useActionState`.",
      "tags": [],
      "type": "ButtonStatus | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onStatusChange",
      "description": "Also called for the automatic return to idle after `successDuration`.",
      "tags": [],
      "type": "((status: ButtonStatus) => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    },
    {
      "name": "successLabel",
      "description": "Shown next to the check icon, e.g. \"Submitted\" for a \"Submit\" button.",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "successDuration",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

See [shadcn/ui](https://ui.shadcn.com/docs/components/base/button#api-reference) documentation for more information.

## Examples

### Form submission

```tsx
"use client"

import { useId, useState } from "react"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ButtonStatus } from "@/components/status-button"
import { StatusButton } from "@/components/status-button"

async function subscribe(email: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (!email.includes("@")) {
    return { ok: false, message: "Enter a valid email address." }
  }

  return { ok: true }
}

export default function StatusButtonFormDemo() {
  const id = useId()
  const [status, setStatus] = useState<ButtonStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setStatus("loading")
    const result = await subscribe(String(formData.get("email")))

    setError(result.ok ? null : (result.message ?? null))
    setStatus(result.ok ? "success" : "idle")
  }

  return (
    <form
      className="flex w-full max-w-xs flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <Field data-invalid={error !== null}>
        <FieldLabel htmlFor={id}>Email</FieldLabel>
        <Input
          id={id}
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={status !== "idle"}
          aria-invalid={error !== null}
        />
        <FieldError>{error}</FieldError>
      </Field>

      <StatusButton
        className="self-start"
        type="submit"
        status={status}
        onStatusChange={setStatus}
        successLabel="Subscribed"
      >
        Subscribe
      </StatusButton>
    </form>
  )
}

```

## Accessibility

* Keeps focus while busy, so keyboard focus is not lost when the action finishes.
* Announces loading and success to screen readers.
* With `prefers-reduced-motion`, states swap without animation.

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on August 23, 2026