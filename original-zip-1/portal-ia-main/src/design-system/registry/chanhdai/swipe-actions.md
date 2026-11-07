# Swipe Actions

Swipe a row in a list to reveal actions on the left or right.

```tsx
"use client"

import { useState } from "react"
import { ArchiveIcon, FlagIcon, Trash2Icon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import {
  SwipeAction,
  SwipeActions,
  SwipeContent,
  SwipeItem,
  SwipeRoot,
} from "@/components/swipe-actions"

export default function SwipeActionsDemo() {
  const [mails, setMails] = useState(INITIAL_MAILS)
  const shouldReduceMotion = useReducedMotion()

  const removeMail = (id: string) => {
    setMails((prev) => prev.filter((mail) => mail.id !== id))
  }

  const toggleFlag = (id: string) => {
    setMails((prev) =>
      prev.map((mail) =>
        mail.id === id ? { ...mail, flagged: !mail.flagged } : mail
      )
    )
  }

  return (
    <div className="w-full overflow-clip rounded-xl border">
      <SwipeRoot render={<ul role="list" className="divide-y" />}>
        <AnimatePresence initial={false}>
          {mails.map((mail) => (
            <SwipeItem
              key={mail.id}
              render={
                <motion.li
                  layout={!shouldReduceMotion}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.1 }
                      : { duration: 0.22, ease: [0.32, 0.72, 0, 1] }
                  }
                />
              }
            >
              <SwipeActions side="left" fullSwipe>
                <SwipeAction
                  className="rounded-xl bg-sky-500 text-white"
                  onClick={() => removeMail(mail.id)}
                >
                  <ArchiveIcon />
                  Archive
                </SwipeAction>
              </SwipeActions>

              <SwipeActions side="right" fullSwipe>
                <SwipeAction
                  className="rounded-xl bg-amber-500 text-white"
                  onClick={() => toggleFlag(mail.id)}
                >
                  <FlagIcon />
                  {mail.flagged ? "Unflag" : "Flag"}
                </SwipeAction>

                <SwipeAction
                  className="rounded-xl bg-red-600 text-white"
                  onClick={() => removeMail(mail.id)}
                >
                  <Trash2Icon />
                  Delete
                </SwipeAction>
              </SwipeActions>

              <SwipeContent>
                <button
                  type="button"
                  className="flex w-full flex-col items-start gap-1 rounded-xl p-4 pt-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    {mail.sender}
                    {mail.flagged && (
                      <FlagIcon className="size-3.5 text-amber-500" />
                    )}
                  </span>
                  <span className="text-sm">{mail.subject}</span>
                  <span className="w-full truncate text-xs text-muted-foreground">
                    {mail.preview}
                  </span>
                </button>
              </SwipeContent>
            </SwipeItem>
          ))}
        </AnimatePresence>
      </SwipeRoot>

      {mails.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          No messages left.
        </p>
      )}
    </div>
  )
}

type Mail = {
  id: string
  sender: string
  subject: string
  preview: string
  flagged: boolean
}

const INITIAL_MAILS: Mail[] = [
  {
    id: "1",
    sender: "shadcn",
    subject: "Namespaced registries",
    preview: "components.json can point at any registry URL now, take a look.",
    flagged: false,
  },
  {
    id: "2",
    sender: "Evil Rabbit",
    subject: "Spacing scale review",
    preview: "Dropped the 6px step so every surface lands on the 4px grid.",
    flagged: false,
  },
  {
    id: "3",
    sender: "Shu",
    subject: "SWR cache inspector",
    preview: "Devtools panel is in, the mutation timeline still needs work.",
    flagged: true,
  },
]

```

Dependencies: @ncdai/react-swipe-actions, motion

## Features

Built on top of [React Swipe Actions](https://react-primitives.chanhdai.com/swipe-actions).

* Drag with pointer or touch.
* Snaps open on distance or a flick. A full swipe runs the outermost action.
* Only one row open at a time, dismissed by an outside click.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/swipe-actions
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install @ncdai/react-swipe-actions motion cn
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/swipe-actions.tsx" 
      import type { ComponentProps } from "react"
      import * as SwipeActionsPrimitive from "@ncdai/react-swipe-actions"

      import { cn } from "@/lib/utils"

      type SwipeSide = SwipeActionsPrimitive.SwipeSide
      type SwipeState = SwipeActionsPrimitive.SwipeState

      const SwipeRoot = SwipeActionsPrimitive.SwipeRoot

      const SwipeItem = SwipeActionsPrimitive.SwipeItem

      const SwipeActions = SwipeActionsPrimitive.SwipeActions

      function SwipeAction({
        className,
        children,
        ...props
      }: ComponentProps<typeof SwipeActionsPrimitive.SwipeAction>) {
        return (
          <SwipeActionsPrimitive.SwipeAction
            className={cn(
              "bg-secondary text-xs font-medium whitespace-nowrap text-secondary-foreground select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground data-armed:brightness-90 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              className
            )}
            {...props}
          >
            <SwipeActionsPrimitive.SwipeActionContent className="min-w-20 flex-col items-center justify-center gap-1.5 px-4">
              {children}
            </SwipeActionsPrimitive.SwipeActionContent>
          </SwipeActionsPrimitive.SwipeAction>
        )
      }

      function SwipeContent({
        className,
        ...props
      }: ComponentProps<typeof SwipeActionsPrimitive.SwipeContent>) {
        return (
          <SwipeActionsPrimitive.SwipeContent
            className={cn("bg-background data-dragging:cursor-grabbing", className)}
            {...props}
          />
        )
      }

      export { SwipeAction, SwipeActions, SwipeContent, SwipeItem, SwipeRoot }
      export type { SwipeSide, SwipeState }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import {
  SwipeAction,
  SwipeActions,
  SwipeContent,
  SwipeItem,
  SwipeRoot,
} from "@/components/swipe-actions"
```

```tsx
<SwipeRoot>
  <SwipeItem>
    <SwipeActions side="right" fullSwipe>
      <SwipeAction />
      <SwipeAction />
    </SwipeActions>

    <SwipeContent />
  </SwipeItem>
</SwipeRoot>
```

## Composition

Use the following composition to build a `SwipeItem`

```text
SwipeRoot
└── SwipeItem
    ├── SwipeActions
    │   └── SwipeAction
    └── SwipeContent
```

## Examples

### Minimal

The smallest setup that works: one action on one side.

```tsx
"use client"

import { useState } from "react"
import { Trash2Icon } from "lucide-react"

import {
  SwipeAction,
  SwipeActions,
  SwipeContent,
  SwipeItem,
  SwipeRoot,
} from "@/components/swipe-actions"

export default function SwipeActionsMinimalDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="w-full overflow-clip rounded-xl border">
      <SwipeRoot render={<ul role="list" className="divide-y" />}>
        {items.map((item) => (
          <SwipeItem key={item.id} render={<li />}>
            <SwipeActions side="right" fullSwipe>
              <SwipeAction
                className="rounded-xl bg-red-600 text-white"
                onClick={() => remove(item.id)}
              >
                <Trash2Icon className="size-4" />
                <span className="sr-only">Delete</span>
              </SwipeAction>
            </SwipeActions>

            <SwipeContent>
              <div className="p-4 text-sm text-foreground">{item.label}</div>
            </SwipeContent>
          </SwipeItem>
        ))}
      </SwipeRoot>

      {items.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          Nothing left.
        </p>
      )}
    </div>
  )
}

const INITIAL_ITEMS = [
  { id: "1", label: "components.json" },
  { id: "2", label: "registry.json" },
  { id: "3", label: "tailwind.config.ts" },
]

```

### Choosing the full swipe action

A full swipe runs the outermost action, so order the strip with the safe one
last. Here Delete sits next to the row and still needs a deliberate tap.

```tsx
"use client"

import { useState } from "react"
import { ArchiveIcon, Trash2Icon } from "lucide-react"

import {
  SwipeAction,
  SwipeActions,
  SwipeContent,
  SwipeItem,
  SwipeRoot,
} from "@/components/swipe-actions"

export default function SwipeActionsFullSwipeDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  const archive = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, archived: true } : item))
    )
  }

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="w-full overflow-clip rounded-xl border">
      <SwipeRoot render={<ul role="list" className="divide-y" />}>
        {items.map((item) => (
          <SwipeItem key={item.id} render={<li />}>
            <SwipeActions side="right" fullSwipe>
              <SwipeAction
                className="rounded-xl bg-red-600 text-white"
                onClick={() => remove(item.id)}
              >
                <Trash2Icon className="size-4" />
                <span className="sr-only">Delete</span>
              </SwipeAction>

              <SwipeAction
                className="rounded-xl bg-sky-500 text-white"
                onClick={() => archive(item.id)}
              >
                <ArchiveIcon className="size-4" />
                <span className="sr-only">Archive</span>
              </SwipeAction>
            </SwipeActions>

            <SwipeContent>
              <div className="flex items-center gap-2 p-4 text-sm text-foreground">
                {item.label}
                {item.archived && (
                  <span className="text-muted-foreground">Archived</span>
                )}
              </div>
            </SwipeContent>
          </SwipeItem>
        ))}
      </SwipeRoot>

      {items.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          Nothing left.
        </p>
      )}
    </div>
  )
}

const INITIAL_ITEMS = [
  { id: "1", label: "components.json", archived: false },
  { id: "2", label: "registry.json", archived: false },
  { id: "3", label: "tailwind.config.ts", archived: false },
]

```

## Accessibility

* Arrow keys open a focused row, and `Escape` closes it.
* Closed strips are `inert`, so their actions stay out of reach.
* Respects `prefers-reduced-motion`.

## References

* [Swipe Actions API reference](https://react-primitives.chanhdai.com/swipe-actions#api-reference)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on September 10, 2026