# TOC Minimap

Navigate page sections with a compact, hoverable TOC minimap.

```tsx
import type { TOCItemType } from "@/components/toc-minimap"
import { TOCMinimap } from "@/components/toc-minimap"

export default function TOCMinimapDemo() {
  return <TOCMinimap items={ITEMS} />
}

const ITEMS: TOCItemType[] = [
  { title: "Installation", url: "#installation", depth: 2 },
  { title: "Usage", url: "#usage", depth: 2 },
  { title: "API reference", url: "#api-reference", depth: 2 },
  { title: "TOCMinimap", url: "#tocminimap", depth: 3 },
  { title: "TOCItemType", url: "#tocitemtype", depth: 3 },
  { title: "References", url: "#references", depth: 2 },
]

```

Registry dependencies: hover-card, @soundcn/u-mini-map-open

## Features

* Active heading state updates as readers scroll through the page.
* Nested heading depth is represented in both the minimap and expanded TOC.
* Hovering the minimap reveals a scrollable table of contents.
* Section links update the URL hash and scroll smoothly to the target heading.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/toc-minimap
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

      <Step>Install the required components</Step>

      * [Hover Card](https://ui.shadcn.com/docs/components/base/hover-card)
      * [@soundcn/u-mini-map-open](https://www.soundcn.xyz/?sound=u-mini-map-open)

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/toc-minimap.tsx" 
      "use client"

      import { useEffect, useMemo, useState } from "react"

      import { uMiniMapOpenSound } from "@/lib/soundcn/u-mini-map-open"
      import { cn } from "@/lib/utils"
      import { useSound } from "@/hooks/soundcn/use-sound"
      import {
        HoverCard,
        HoverCardContent,
        HoverCardTrigger,
      } from "@/components/ui/hover-card"

      export type TOCItemType = {
        title: React.ReactNode
        url: string
        depth: number
      }

      export type TOCMinimapProps = {
        /** @fumadocsHref #tocitemtype */
        items: TOCItemType[]
        className?: string
      }

      export function TOCMinimap({ items, className }: TOCMinimapProps) {
        const itemIds = useMemo(
          () => items.map((item) => item.url.replace("#", "")),
          [items]
        )

        const activeHeading = useActiveHeading(itemIds)

        const [play] = useSound(uMiniMapOpenSound, { volume: 0.3 })

        if (!items.length) {
          return null
        }

        return (
          <div className={cn("ml-auto w-18", className)}>
            <HoverCard
              onOpenChange={(open) => {
                if (open) play()
              }}
            >
              <HoverCardTrigger
                delay={0}
                closeDelay={0}
                render={
                  <div className="flex max-h-[50dvh] flex-col gap-3 overflow-hidden py-3 pl-6 opacity-100 transition-opacity duration-200 data-popup-open:opacity-0">
                    {items.map((item) => (
                      <div
                        key={item.url}
                        data-depth={item.depth}
                        data-active={item.url === `#${activeHeading}`}
                        className={cn(
                          "h-0.5 w-6 shrink-0 rounded-xs bg-ring/50 transition-[background-color] duration-200",
                          "data-[depth=3]:ml-2 data-[depth=3]:w-4",
                          "data-[depth=4]:ml-4 data-[depth=4]:w-2",
                          "data-active:bg-foreground"
                        )}
                      />
                    ))}
                  </div>
                }
              />

              <HoverCardContent
                className="w-56 overflow-hidden p-0 duration-200 data-[side=left]:slide-in-from-right-3 data-[side=left]:slide-out-to-right-3 data-open:zoom-in-100 data-closed:zoom-out-100"
                align="start"
                alignOffset={0}
                side="left"
                sideOffset={-60}
              >
                <div className="flex max-h-[50dvh] overflow-y-auto overscroll-contain">
                  <ul className="flex size-full flex-col px-6 py-4 text-sm">
                    {items.map((item) => (
                      <li key={item.url} className="flex py-1">
                        <a
                          href={item.url}
                          data-depth={item.depth}
                          data-active={item.url === `#${activeHeading}`}
                          className={cn(
                            "line-clamp-2 w-full transition-[color] duration-200",
                            "text-muted-foreground hover:text-foreground data-active:text-foreground",
                            "data-[depth=3]:pl-4 data-[depth=4]:pl-8"
                          )}
                          onClick={handleItemClick}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        )
      }

      export function useActiveHeading(itemIds: string[]) {
        const [activeId, setActiveId] = useState<string | null>(null)

        useEffect(() => {
          const observer = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  setActiveId(entry.target.id)
                }
              }
            },
            { rootMargin: "0% 0% -80% 0%", threshold: 0.98 }
          )

          for (const id of itemIds ?? []) {
            const element = document.getElementById(id)
            if (element) {
              observer.observe(element)
            }
          }

          return () => {
            for (const id of itemIds ?? []) {
              const element = document.getElementById(id)
              if (element) {
                observer.unobserve(element)
              }
            }
          }
        }, [itemIds])

        return activeId
      }

      function handleItemClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault()
        const url = e.currentTarget.getAttribute("href") ?? ""
        scrollToHeading(url)
      }

      function scrollToHeading(url: string) {
        history.pushState(null, "", url)
        document.getElementById(url.replace("#", ""))?.scrollIntoView({
          behavior: "smooth",
        })
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { TOCMinimap } from "@/components/toc-minimap"
```

```tsx
<TOCMinimap items={toc} />
```

## API reference

### TOCMinimap

<TypeTable
  id="type-table-toc-minimap.tsx-TOCMinimapProps"
  type={{
  "id": "toc-minimap.tsx-TOCMinimapProps",
  "name": "TOCMinimapProps",
  "description": "",
  "entries": [
    {
      "name": "items",
      "description": "",
      "tags": [
        {
          "name": "fumadocsHref",
          "text": "#tocitemtype"
        }
      ],
      "type": "TOCItemType[]",
      "simplifiedType": "array",
      "required": true,
      "deprecated": false,
      "typeHref": "#tocitemtype"
    },
    {
      "name": "className",
      "description": "",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

### TOCItemType

<TypeTable
  id="type-table-toc-minimap.tsx-TOCItemType"
  type={{
  "id": "toc-minimap.tsx-TOCItemType",
  "name": "TOCItemType",
  "description": "",
  "entries": [
    {
      "name": "title",
      "description": "",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": true,
      "deprecated": false
    },
    {
      "name": "url",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "depth",
      "description": "",
      "tags": [],
      "type": "number",
      "simplifiedType": "number",
      "required": true,
      "deprecated": false
    }
  ]
}}
/>

## Credits

* [Notion](https://www.notion.com)
* [Vercel](https://vercel.com/kb)

## References

* [soundcn](https://www.soundcn.xyz) — source for the u-mini-map-open sound effect.

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on April 27, 2026