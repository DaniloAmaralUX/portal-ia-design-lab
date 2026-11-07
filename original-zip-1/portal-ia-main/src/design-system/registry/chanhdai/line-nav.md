# Line Nav

Vertical navigation with a line marker that expands on hover and active state.

```tsx
"use client"

import { useState } from "react"

import { LineNav } from "@/components/line-nav"

export default function LineNavDemo() {
  const [activeHref, setActiveHref] = useState("#elastic-slider")

  return (
    <LineNav
      className="w-60"
      items={ITEMS}
      activeHref={activeHref}
      scrollActiveIntoView={false}
      onItemClick={(item) => setActiveHref(item.href)}
    />
  )
}

const ITEMS = [
  { title: "Apple Hello Effect", href: "#apple-hello-effect" },
  { title: "Code Block Command", href: "#code-block-command" },
  { title: "Copy Button", href: "#copy-button" },
  { title: "Dot Grid Spotlight", href: "#dot-grid-spotlight" },
  { title: "Elastic Slider", href: "#elastic-slider" },
  { title: "Fluid Gradient Text", href: "#fluid-gradient-text" },
  { title: "Shimmering Text", href: "#shimmering-text" },
  { title: "Slide to Unlock", href: "#slide-to-unlock" },
  { title: "Theme Switcher", href: "#theme-switcher" },
  { title: "TOC Minimap", href: "#toc-minimap" },
]

```

<DocTestimonial authorAvatar="https://assets.chanhdai.com/avatars/x/shadcn.webp" authorName="shadcn" authorTagline="Creator of shadcn/ui" url="https://x.com/shadcn/status/2070476237999325304" quote="Need this. Thank you." />

Dependencies: motion

## Features

* The active item's line marker expands and its label brightens to mark the current page.
* The active item scrolls into view on mount, staying visible in long lists.

<Callout>
  Want to build animations like Line Nav? I highly recommend [Emil
  Kowalski](https://x.com/emilkowalski)’s animations.dev course. [Take the
  course](https://animations.dev)
</Callout>

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/line-nav
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

      ```tsx title="components/line-nav.tsx" 
      /**
       * This component is inspired by Devouring Details and Skiper UI.
       */

      "use client"

      import { memo, useEffect, useRef } from "react"
      import { motion } from "motion/react"

      import { cn } from "@/lib/utils"

      const lineVariants = {
        normal: { width: 24 },
        active: { width: 40 },
        hover: { width: 40 },
      }

      export type LineNavItem = {
        title: string
        href: string
      }

      export type LineNavProps = {
        className?: string
        /** @fumadocsHref #linenavitem */
        items: LineNavItem[]
        /** Href of the active item. */
        activeHref?: string
        /** Scroll the active item into view on mount. */
        scrollActiveIntoView?: boolean
        /** Called when an item is clicked. */
        onItemClick?: (
          item: LineNavItem,
          event: React.MouseEvent<HTMLAnchorElement>
        ) => void
      }

      export function LineNav({
        className,
        items,
        activeHref,
        scrollActiveIntoView = true,
        onItemClick,
      }: LineNavProps) {
        const activeItemRef = useRef<HTMLAnchorElement | null>(null)

        useEffect(() => {
          if (scrollActiveIntoView) {
            activeItemRef.current?.scrollIntoView({ block: "center" })
          }
        }, [scrollActiveIntoView])

        return (
          <nav
            className={cn("flex flex-col gap-2 py-5.25", className)}
            style={
              {
                "--line-nav-width": `${lineVariants.normal.width}px`,
              } as React.CSSProperties
            }
          >
            {items.map((item, index) => {
              const isActive = item.href === activeHref

              return (
                <LineNavItem
                  key={item.href}
                  ref={isActive ? activeItemRef : undefined}
                  title={item.title}
                  href={item.href}
                  active={isActive}
                  isLast={index === items.length - 1}
                  onClick={
                    onItemClick ? (event) => onItemClick(item, event) : undefined
                  }
                />
              )
            })}
          </nav>
        )
      }

      const LineNavItem = memo(function LineNavItem({
        ref,
        title,
        href,
        active = false,
        isLast = false,
        onClick,
      }: {
        ref?: React.Ref<HTMLAnchorElement>
        title: string
        href: string
        active?: boolean
        isLast?: boolean
        onClick?: React.MouseEventHandler<HTMLAnchorElement>
      }) {
        return (
          <>
            {/*
              Rendered as a plain anchor to stay framework-agnostic. For client-side
              navigation in Next.js, swap `motion.a` for `motion.create(Link)`
              (import Link from "next/link").
            */}
            <motion.a
              ref={ref}
              aria-current={active ? "page" : undefined}
              className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5"
              href={href}
              initial={false}
              animate={active ? "active" : "normal"}
              whileHover="hover"
              onClick={onClick}
            >
              <motion.span
                className="block h-px shrink-0 bg-foreground/20 transition-[background-color] ease-out group-hover:bg-foreground group-aria-[current=page]:bg-foreground"
                variants={lineVariants}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
              <span className="text-sm whitespace-nowrap text-muted-foreground transition-[color] ease-out group-hover:text-foreground group-aria-[current=page]:text-foreground">
                {title}
              </span>
            </motion.a>

            {!isLast && (
              <>
                <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
                <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
              </>
            )}
          </>
        )
      })

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { LineNav } from "@/components/line-nav"
```

```tsx
<LineNav
  activeHref="/components/code-block-command"
  items={[
    { title: "Apple Hello Effect", href: "/components/apple-hello-effect" },
    { title: "Code Block Command", href: "/components/code-block-command" },
    { title: "Copy Button", href: "/components/copy-button" },
  ]}
/>
```

## API reference

### LineNav

<TypeTable
  id="type-table-line-nav.tsx-LineNavProps"
  type={{
  "id": "line-nav.tsx-LineNavProps",
  "name": "LineNavProps",
  "description": "",
  "entries": [
    {
      "name": "className",
      "description": "",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "items",
      "description": "",
      "tags": [
        {
          "name": "fumadocsHref",
          "text": "#linenavitem"
        }
      ],
      "type": "LineNavItem[]",
      "simplifiedType": "array",
      "required": true,
      "deprecated": false,
      "typeHref": "#linenavitem"
    },
    {
      "name": "activeHref",
      "description": "Href of the active item.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "scrollActiveIntoView",
      "description": "Scroll the active item into view on mount.",
      "tags": [],
      "type": "boolean | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    },
    {
      "name": "onItemClick",
      "description": "Called when an item is clicked.",
      "tags": [],
      "type": "((item: LineNavItem, event: React.MouseEvent<HTMLAnchorElement>) => void) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

### LineNavItem

<TypeTable
  id="type-table-line-nav.tsx-LineNavItem"
  type={{
  "id": "line-nav.tsx-LineNavItem",
  "name": "LineNavItem",
  "description": "",
  "entries": [
    {
      "name": "title",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "href",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    }
  ]
}}
/>

## Examples

### Client-side navigation

Items render as plain anchors to stay framework-agnostic. For client-side navigation in Next.js (or React Router), edit the source and render the item through a router link instead.

```diff
+ import Link from "next/link"
  import { motion } from "motion/react"

+ const MotionLink = motion.create(Link)

- <motion.a
+ <MotionLink
    ref={ref}
    href={href}
    initial={false}
    animate={active ? "active" : "normal"}
    whileHover="hover"
    onClick={onClick}
  >
    {/* ... */}
- </motion.a>
+ </MotionLink>
```

## Credits

* [Devouring Details](https://devouringdetails.com)
* [Skiper UI](https://skiper-ui.com)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on June 26, 2026