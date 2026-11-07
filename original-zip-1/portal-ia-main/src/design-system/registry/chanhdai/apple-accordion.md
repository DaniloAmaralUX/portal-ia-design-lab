# Apple Accordion

Accordion whose items morph from pills into cards, inspired by Apple’s product pages.

```tsx
"use client"

import { useState } from "react"

import {
  AppleAccordionClose,
  AppleAccordionContent,
  AppleAccordionItem,
  AppleAccordionList,
  AppleAccordionNext,
  AppleAccordionPrevious,
  AppleAccordionRoot,
  AppleAccordionTrigger,
  AppleAccordionTriggerIcon,
} from "@/components/apple-accordion"

export default function AppleAccordionDemo() {
  const [value, setValue] = useState<string | null>(null)
  const image = ITEMS.find((item) => item.value === value)?.image ?? COVER

  return (
    <AppleAccordionRoot
      value={value}
      onValueChange={setValue}
      className="mx-auto h-176 max-w-6xl overflow-hidden rounded-4xl bg-background"
    >
      {[COVER, ...ITEMS.map((item) => item.image)].map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          data-current={src === image ? "" : undefined}
          className="absolute inset-0 -z-10 size-full object-cover opacity-0 transition-opacity duration-500 ease-in-out data-current:opacity-100"
        />
      ))}

      <div className="flex h-full items-center gap-4 px-4 sm:gap-8 sm:px-8">
        <div className="flex flex-col gap-5">
          <AppleAccordionPrevious aria-label="Previous place" />
          <AppleAccordionNext aria-label="Next place" />
        </div>

        <AppleAccordionList aria-label="Places in Viet Nam">
          {ITEMS.map((item) => (
            <AppleAccordionItem key={item.value} value={item.value}>
              <AppleAccordionTrigger>
                <AppleAccordionTriggerIcon />
                {item.title}
              </AppleAccordionTrigger>
              <AppleAccordionContent>
                <p>
                  <span className="font-medium">{item.title}.</span>{" "}
                  {item.description}
                </p>
              </AppleAccordionContent>
            </AppleAccordionItem>
          ))}
        </AppleAccordionList>
      </div>

      <AppleAccordionClose className="absolute inset-e-4 top-4 sm:inset-e-6 sm:top-6" />
    </AppleAccordionRoot>
  )
}

const COVER =
  "https://assets.chanhdai.com/registry/images/components/apple-carousel/5.webp"

const ITEMS = [
  {
    value: "quang-ninh",
    title: "Quang Ninh",
    description:
      "Home to Ha Long Bay, where nearly two thousand limestone islands rise from emerald water.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/1.webp",
  },
  {
    value: "an-giang",
    title: "An Giang",
    description:
      "Rice fields, floating markets, and the Tra Su cajuput forest in the heart of the Mekong Delta.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/2.webp?v=2",
  },
  {
    value: "ninh-binh",
    title: "Ninh Binh",
    description:
      "Boats drift through limestone caves at Trang An, a UNESCO World Heritage site.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/3.webp",
  },
  {
    value: "hue",
    title: "Hue",
    description:
      "The former imperial capital, with its Citadel and royal tombs along the Perfume River.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/4.webp",
  },
  {
    value: "ho-chi-minh-city",
    title: "Ho Chi Minh City",
    description:
      "The country’s largest city, busy day and night, with street food on every corner.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/6.webp",
  },
  {
    value: "da-nang",
    title: "Da Nang",
    description:
      "Long sandy beaches, the Dragon Bridge, and the Marble Mountains just south of the city.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/7.webp",
  },
]

```

Dependencies: @base-ui/react, lucide-react

## Features

* Each item morphs from a pill into a card while the others make room.
* Up and down buttons step through items without closing the card.

## Use cases

* Product feature highlights on a landing page.
* Step-by-step product tour next to an image.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/apple-accordion
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install @base-ui/react lucide-react cn
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/apple-accordion.tsx" 
      "use client"

      import {
        Children,
        createContext,
        isValidElement,
        use,
        useId,
        useLayoutEffect,
        useRef,
        useState,
      } from "react"
      import type { ComponentProps, RefObject } from "react"
      import { mergeProps } from "@base-ui/react/merge-props"
      import { useRender } from "@base-ui/react/use-render"
      import {
        ChevronDownIcon,
        ChevronUpIcon,
        CirclePlusIcon,
        XIcon,
      } from "lucide-react"
      import { flushSync } from "react-dom"

      import { cn } from "@/lib/utils"

      type Size = { width: number; height: number }

      function useElementSize(ref: RefObject<HTMLElement | null>) {
        const [size, setSize] = useState<Size | null>(null)

        useLayoutEffect(() => {
          const element = ref.current
          if (!element) return

          const observer = new ResizeObserver(([entry]) => {
            const [box] = entry.borderBoxSize
            setSize({ width: box.inlineSize, height: box.blockSize })
          })
          observer.observe(element)

          return () => observer.disconnect()
        }, [ref])

        return size
      }

      const getTriggerId = (rootId: string, index: number) =>
        `${rootId}-${index}-trigger`
      const getContentId = (rootId: string, index: number) =>
        `${rootId}-${index}-content`

      type AppleAccordionContextValue = {
        id: string
        value: string | null
        index: number
        count: number
        setValues: (update: (values: string[]) => string[]) => void
        open: (value: string) => void
        close: () => void
        step: (offset: -1 | 1) => void
      }

      const AppleAccordionContext = createContext<AppleAccordionContextValue | null>(
        null
      )

      function useAppleAccordion() {
        const context = use(AppleAccordionContext)
        if (!context) {
          throw new Error(
            "AppleAccordion parts must be used within AppleAccordionRoot"
          )
        }
        return context
      }

      type AppleAccordionState = {
        /** Whether any item is expanded. */
        open: boolean
      }

      type AppleAccordionRootProps = Omit<
        useRender.ComponentProps<"div", AppleAccordionState>,
        "defaultValue"
      > & {
        /** Value of the expanded item, or `null` when every item is collapsed. */
        value?: string | null
        /**
         * Item expanded on mount when uncontrolled.
         * @defaultValue null
         */
        defaultValue?: string | null
        onValueChange?: (value: string | null) => void
      }

      function AppleAccordionRoot({
        value: valueProp,
        defaultValue = null,
        onValueChange,
        className,
        render,
        ref,
        ...props
      }: AppleAccordionRootProps) {
        const id = useId()
        const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
          defaultValue
        )
        const value = valueProp === undefined ? uncontrolledValue : valueProp
        const [values, setValues] = useState<string[]>([])
        const index = value === null ? -1 : values.indexOf(value)

        // Focus follows the card through flushSync: the trigger turns inert and the
        // content stops being inert in the same commit, so the move can't miss.
        const setValue = (next: string | null) => {
          flushSync(() => {
            if (valueProp === undefined) setUncontrolledValue(next)
            onValueChange?.(next)
          })
        }

        const open = (next: string) => {
          setValue(next)
          document.getElementById(getContentId(id, values.indexOf(next)))?.focus()
        }

        const close = () => {
          if (value === null) return
          setValue(null)
          document.getElementById(getTriggerId(id, index))?.focus()
        }

        // Paddles keep focus, so pressing one again keeps stepping.
        const step = (offset: -1 | 1) => {
          const next = values[index + offset]
          if (index !== -1 && next !== undefined) setValue(next)
        }

        const defaultProps: ComponentProps<"div"> & { "data-slot": string } = {
          "data-slot": "apple-accordion",
          className: cn(
            "group/apple-accordion @container relative isolate w-full",
            className
          ),
          onKeyDown: (event) => {
            if (event.key !== "Escape" || value === null) return
            event.preventDefault()
            close()
          },
        }

        const element = useRender({
          defaultTagName: "div",
          render,
          ref,
          state: { open: value !== null },
          props: mergeProps<"div">(defaultProps, props),
        })

        return (
          <AppleAccordionContext
            value={{
              id,
              value,
              index,
              count: values.length,
              setValues,
              open,
              close,
              step,
            }}
          >
            {element}
          </AppleAccordionContext>
        )
      }

      const AppleAccordionListIndexContext = createContext<number | null>(null)

      function isSameList(a: string[], b: string[]) {
        return a.length === b.length && a.every((value, i) => value === b[i])
      }

      function AppleAccordionList({
        className,
        children,
        render,
        ref,
        ...props
      }: useRender.ComponentProps<"ul">) {
        const { setValues } = useAppleAccordion()

        const items = Children.toArray(children).filter(
          isValidElement<{ value: string }>
        )
        const values = items.map((item) => item.props.value)

        // The paddles need the order before any of them is pressed, and only the
        // list sees every item.
        useLayoutEffect(() => {
          setValues((previous) => (isSameList(previous, values) ? previous : values))
        })

        const defaultProps: ComponentProps<"ul"> & { "data-slot": string } = {
          "data-slot": "apple-accordion-list",
          role: "list",
          className: cn("flex flex-col items-start gap-3", className),
          children: items.map((item, index) => (
            <AppleAccordionListIndexContext key={item.key} value={index}>
              {item}
            </AppleAccordionListIndexContext>
          )),
        }

        return useRender({
          defaultTagName: "ul",
          render,
          ref,
          props: mergeProps<"ul">(defaultProps, props),
        })
      }

      type AppleAccordionItemContextValue = {
        value: string
        isOpen: boolean
        triggerId: string
        contentId: string
        triggerRef: RefObject<HTMLButtonElement | null>
        contentRef: RefObject<HTMLDivElement | null>
      }

      const AppleAccordionItemContext =
        createContext<AppleAccordionItemContextValue | null>(null)

      function useAppleAccordionItem() {
        const context = use(AppleAccordionItemContext)
        if (!context) {
          throw new Error(
            "AppleAccordionTrigger and AppleAccordionContent must be used within AppleAccordionItem"
          )
        }
        return context
      }

      type AppleAccordionItemState = {
        /** Whether this item is expanded into a card. */
        open: boolean
      }

      type AppleAccordionItemProps = Omit<
        useRender.ComponentProps<"li", AppleAccordionItemState>,
        "value"
      > & {
        /** Unique value that identifies the item. */
        value: string
      }

      function AppleAccordionItem({
        value,
        className,
        render,
        ref,
        ...props
      }: AppleAccordionItemProps) {
        const { id, value: openValue } = useAppleAccordion()
        const index = use(AppleAccordionListIndexContext)
        if (index === null) {
          throw new Error(
            "AppleAccordionItem must be a direct child of AppleAccordionList"
          )
        }

        const isOpen = openValue === value
        const triggerRef = useRef<HTMLButtonElement>(null)
        const contentRef = useRef<HTMLDivElement>(null)
        const triggerSize = useElementSize(triggerRef)
        const contentSize = useElementSize(contentRef)
        // Both layers stay laid out, so the pill can morph between their measured
        // boxes. Until measured, the trigger in flow sizes the pill on its own.
        const size = isOpen ? contentSize : triggerSize

        const defaultProps: ComponentProps<"li"> & { "data-slot": string } = {
          "data-slot": "apple-accordion-item",
          style: size ?? undefined,
          className: cn(
            "group/apple-accordion-item relative overflow-hidden rounded-[1.75rem] bg-muted/70 shadow-md ring ring-foreground/10 backdrop-blur-lg not-data-open:hover:bg-muted/90",
            // The size morphs on screen; the hover color is a quick, small change.
            "transition-[width,height,background-color] duration-[450ms,450ms,150ms] ease-[cubic-bezier(0.645,0.045,0.355,1),cubic-bezier(0.645,0.045,0.355,1),ease]",
            "motion-reduce:transition-[background-color] motion-reduce:duration-150 motion-reduce:ease-[ease]",
            className
          ),
        }

        const element = useRender({
          defaultTagName: "li",
          render,
          ref,
          state: { open: isOpen },
          props: mergeProps<"li">(defaultProps, props),
        })

        return (
          <AppleAccordionItemContext
            value={{
              value,
              isOpen,
              triggerId: getTriggerId(id, index),
              contentId: getContentId(id, index),
              triggerRef,
              contentRef,
            }}
          >
            {element}
          </AppleAccordionItemContext>
        )
      }

      function AppleAccordionTrigger({
        className,
        render,
        ref,
        ...props
      }: useRender.ComponentProps<"button">) {
        const { open } = useAppleAccordion()
        const { value, isOpen, triggerId, contentId, triggerRef } =
          useAppleAccordionItem()

        const defaultProps: ComponentProps<"button"> & { "data-slot": string } = {
          "data-slot": "apple-accordion-trigger",
          type: "button",
          id: triggerId,
          "aria-expanded": isOpen,
          "aria-controls": contentId,
          // The card covers it while open, so it leaves the tab order too.
          inert: isOpen,
          className: cn(
            "flex h-14 w-max origin-left items-center gap-3 rounded-[inherit] ps-3.5 pe-8 text-base font-medium whitespace-nowrap text-foreground",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
            // Gets out of the way at once, then returns only after the card has
            // mostly shrunk back, so the label never spills over the card.
            "transition-[opacity,scale] delay-200 duration-300 ease-out",
            "group-data-open/apple-accordion-item:scale-90 group-data-open/apple-accordion-item:opacity-0 group-data-open/apple-accordion-item:delay-0 group-data-open/apple-accordion-item:duration-150",
            "motion-reduce:group-data-open/apple-accordion-item:scale-100",
            className
          ),
          onClick: () => open(value),
        }

        return useRender({
          defaultTagName: "button",
          render,
          ref: [ref ?? null, triggerRef],
          props: mergeProps<"button">(defaultProps, props),
        })
      }

      function AppleAccordionTriggerIcon({
        className,
        children,
        ...props
      }: ComponentProps<"span">) {
        return (
          <span
            aria-hidden
            data-slot="apple-accordion-trigger-icon"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center [&_svg]:size-full",
              className
            )}
            {...props}
          >
            {children ?? <CirclePlusIcon strokeWidth={1.5} />}
          </span>
        )
      }

      function AppleAccordionContent({
        className,
        render,
        ref,
        ...props
      }: useRender.ComponentProps<"div">) {
        const { isOpen, triggerId, contentId, contentRef } = useAppleAccordionItem()

        const defaultProps: ComponentProps<"div"> & { "data-slot": string } = {
          "data-slot": "apple-accordion-content",
          id: contentId,
          role: "group",
          "aria-labelledby": triggerId,
          tabIndex: -1,
          inert: !isOpen,
          className: cn(
            // Sized by its own text, not by the pill it grows out of.
            "absolute inset-s-0 top-0 flex w-max max-w-[min(--spacing(100),100cqw-(--spacing(20)))] flex-col gap-3 rounded-[inherit] p-7 text-base text-pretty text-foreground",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
            // Leaves fast, and arrives once the card has room for it.
            "translate-y-4 opacity-0 transition-[opacity,translate] duration-150 ease-out",
            "group-data-open/apple-accordion-item:translate-y-0 group-data-open/apple-accordion-item:opacity-100 group-data-open/apple-accordion-item:delay-150 group-data-open/apple-accordion-item:duration-400",
            "motion-reduce:translate-y-0",
            className
          ),
        }

        return useRender({
          defaultTagName: "div",
          render,
          ref: [ref ?? null, contentRef],
          props: mergeProps<"div">(defaultProps, props),
        })
      }

      // Shared by the paddles and the close button: a 36px disc inside a 44px
      // target, shown only while a card is open.
      function IconButton({
        className,
        render,
        ref,
        ...props
      }: useRender.ComponentProps<"button">) {
        const { value } = useAppleAccordion()
        const isOpen = value !== null

        const defaultProps: ComponentProps<"button"> = {
          type: "button",
          inert: !isOpen,
          className: cn(
            "relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted/70 text-foreground shadow-md ring ring-foreground/10 backdrop-blur-lg after:absolute after:-inset-1 hover:bg-muted/90 aria-disabled:hover:bg-muted/70 [&_svg]:size-5",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            "scale-90 opacity-0 transition-[opacity,scale,background-color] duration-150 ease-out",
            "group-data-open/apple-accordion:scale-100 group-data-open/apple-accordion:opacity-100 group-data-open/apple-accordion:duration-[250ms,150ms,150ms] group-data-open/apple-accordion:aria-disabled:opacity-40",
            // Press feedback like Button, deeper because a 36px disc hides 2%. It
            // stacks on the open variant to outrank its scale-100.
            "group-data-open/apple-accordion:not-aria-disabled:motion-safe:active:scale-95",
            "motion-reduce:scale-100",
            className
          ),
        }

        return useRender({
          defaultTagName: "button",
          render,
          ref,
          props: mergeProps<"button">(defaultProps, props),
        })
      }

      function AppleAccordionPrevious({
        children,
        ...props
      }: useRender.ComponentProps<"button">) {
        const { index, step } = useAppleAccordion()
        // aria-disabled instead of disabled: a disabled button drops focus to the
        // body when the last step reaches the end.
        const isDisabled = index <= 0

        return (
          <IconButton
            {...mergeProps<"button">(
              {
                "aria-label": "Previous",
                "aria-disabled": isDisabled || undefined,
                onClick: () => step(-1),
              },
              props
            )}
            data-slot="apple-accordion-previous"
          >
            {children ?? <ChevronUpIcon strokeWidth={2.5} />}
          </IconButton>
        )
      }

      function AppleAccordionNext({
        children,
        ...props
      }: useRender.ComponentProps<"button">) {
        const { index, count, step } = useAppleAccordion()
        const isDisabled = index === -1 || index >= count - 1

        return (
          <IconButton
            {...mergeProps<"button">(
              {
                "aria-label": "Next",
                "aria-disabled": isDisabled || undefined,
                onClick: () => step(1),
              },
              props
            )}
            data-slot="apple-accordion-next"
          >
            {children ?? <ChevronDownIcon strokeWidth={2.5} />}
          </IconButton>
        )
      }

      function AppleAccordionClose({
        children,
        ...props
      }: useRender.ComponentProps<"button">) {
        const { close } = useAppleAccordion()

        return (
          <IconButton
            {...mergeProps<"button">(
              { "aria-label": "Close", onClick: close },
              props
            )}
            data-slot="apple-accordion-close"
          >
            {children ?? <XIcon strokeWidth={2.5} />}
          </IconButton>
        )
      }

      export {
        AppleAccordionClose,
        AppleAccordionContent,
        AppleAccordionItem,
        AppleAccordionList,
        AppleAccordionNext,
        AppleAccordionPrevious,
        AppleAccordionRoot,
        AppleAccordionTrigger,
        AppleAccordionTriggerIcon,
      }
      export type {
        AppleAccordionItemProps,
        AppleAccordionItemState,
        AppleAccordionRootProps,
        AppleAccordionState,
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import {
  AppleAccordionClose,
  AppleAccordionContent,
  AppleAccordionItem,
  AppleAccordionList,
  AppleAccordionNext,
  AppleAccordionPrevious,
  AppleAccordionRoot,
  AppleAccordionTrigger,
  AppleAccordionTriggerIcon,
} from "@/components/apple-accordion"
```

```tsx
<AppleAccordionRoot>
  <AppleAccordionPrevious />
  <AppleAccordionNext />

  <AppleAccordionList>
    <AppleAccordionItem value="display">
      <AppleAccordionTrigger>
        <AppleAccordionTriggerIcon />
        Display
      </AppleAccordionTrigger>
      <AppleAccordionContent>
        <p>Brighter, with deeper blacks.</p>
      </AppleAccordionContent>
    </AppleAccordionItem>
  </AppleAccordionList>

  <AppleAccordionClose />
</AppleAccordionRoot>
```

Items must be direct children of `AppleAccordionList`. Use `value` and `onValueChange` to show matching media beside the list.

## Composition

Use the following composition to build an `AppleAccordion`

```text
AppleAccordionRoot
├── AppleAccordionPrevious
├── AppleAccordionNext
├── AppleAccordionList
│   └── AppleAccordionItem
│       ├── AppleAccordionTrigger
│       │   └── AppleAccordionTriggerIcon
│       └── AppleAccordionContent
└── AppleAccordionClose
```

## API reference

Every part except `AppleAccordionTriggerIcon` accepts a `render` prop to change its element.

### AppleAccordionRoot

<TypeTable
  id="type-table-props.ts-AppleAccordionRootProps"
  type={{
  "id": "props.ts-AppleAccordionRootProps",
  "name": "AppleAccordionRootProps",
  "description": "",
  "entries": [
    {
      "name": "defaultValue",
      "description": "Item expanded on mount when uncontrolled.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "null"
        }
      ],
      "type": "string | null | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    },
    {
      "name": "value",
      "description": "Value of the expanded item, or `null` when every item is collapsed.",
      "tags": [],
      "type": "string | null | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onValueChange",
      "description": "",
      "tags": [],
      "type": "((value: string | null) => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

### AppleAccordionItem

<TypeTable
  id="type-table-props.ts-AppleAccordionItemProps"
  type={{
  "id": "props.ts-AppleAccordionItemProps",
  "name": "AppleAccordionItemProps",
  "description": "",
  "entries": [
    {
      "name": "value",
      "description": "Unique value that identifies the item.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    }
  ]
}}
/>

### Data attributes

| Attribute       | Element                                        | Present when               |
| --------------- | ---------------------------------------------- | -------------------------- |
| `data-open`     | `AppleAccordionRoot`                           | Any item is open.          |
| `data-open`     | `AppleAccordionItem`                           | The item is open.          |
| `aria-disabled` | `AppleAccordionPrevious`, `AppleAccordionNext` | No item in that direction. |

## Accessibility

* Focus moves into the open card, and Escape or Close returns it to the pill.
* With `prefers-reduced-motion`, cards resize instantly and content only fades.

## Credits

* [Apple](https://www.apple.com/macbook-pro/)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on October 28, 2026