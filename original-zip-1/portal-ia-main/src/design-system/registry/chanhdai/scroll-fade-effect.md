# Scroll Fade Effect

Fade content edges as you scroll, for both vertical and horizontal layouts.

<Callout title="The Scroll Fade Effect component has been deprecated">
  Please use the shadcn/ui
  [scroll-fade](https://ui.shadcn.com/docs/utils/scroll-fade) utilities instead.
</Callout>

```tsx
import * as React from "react"

import { Separator } from "@/components/ui/separator"
import { ScrollFadeEffect } from "@/components/scroll-fade-effect"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function ScrollFadeEffectDemo() {
  return (
    <div data-slot="scroll-fade-effect-demo" className="rounded-lg border">
      <ScrollFadeEffect className="h-72 w-48">
        <div className="p-4">
          <h4 className="mb-4 text-sm/none font-medium">Tags</h4>
          {tags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollFadeEffect>
    </div>
  )
}

```

## Features

* Content fades in and out smoothly as you scroll.
* Supports both vertical and horizontal scrolling.

## Use cases

* Sidebars and menus that scroll inside a fixed height.
* Tab bars that overflow horizontally on small screens.
* Long lists inside a popover or dialog.

## Browser compatibility

This component uses CSS `animation-timeline: scroll()`. Check the latest [browser compatibility on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline#browser_compatibility) before using in production.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/scroll-fade-effect
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

      <Step>Add Tailwind CSS utilities and animations</Step>

      ```css title="globals.css" 
      @layer base {
        @keyframes show-top-mask {
          to {
            --top-mask-height: var(--mask-height);
          }
        }

        @keyframes hide-bottom-mask {
          to {
            --bottom-mask-height: 0px;
          }
        }

        @keyframes show-left-mask {
          to {
            --left-mask-width: var(--mask-width);
          }
        }

        @keyframes hide-right-mask {
          to {
            --right-mask-width: 0px;
          }
        }
      }

      @property --top-mask-height {
        syntax: "<length>";
        inherits: true;
        initial-value: 0px;
      }

      @property --bottom-mask-height {
        syntax: "<length>";
        inherits: true;
        initial-value: 64px;
      }

      @property --left-mask-width {
        syntax: "<length>";
        inherits: true;
        initial-value: 0px;
      }

      @property --right-mask-width {
        syntax: "<length>";
        inherits: true;
        initial-value: 64px;
      }

      @utility scroll-fade-effect-y {
        --mask-height: 64px;
        --mask-offset-top: 0px;
        --mask-offset-bottom: 0px;
        --scroll-buffer: 2rem;

        /* Set up the mask layers */
        mask-image:
          linear-gradient(to top, transparent, black 90%),
          linear-gradient(to bottom, transparent 0%, black 100%),
          linear-gradient(black, black);

        mask-size:
          100% var(--top-mask-height),
          100% var(--bottom-mask-height),
          100% 100%;
        mask-repeat: no-repeat, no-repeat, no-repeat;
        mask-position:
          0 var(--mask-offset-top),
          0 calc(100% - var(--mask-offset-bottom)),
          0 0;
        /* Exclude the gradient areas from the solid mask */
        mask-composite: exclude;

        animation-name: show-top-mask, hide-bottom-mask;
        animation-timeline: scroll(self), scroll(self);
        animation-range:
          0 var(--scroll-buffer),
          calc(100% - var(--scroll-buffer)) 100%;
        animation-fill-mode: both;
      }

      @utility scroll-fade-effect-x {
        --mask-width: 64px;
        --mask-offset-left: 0px;
        --mask-offset-right: 0px;
        --scroll-buffer: 2rem;

        mask-image:
          linear-gradient(to left, transparent, black 90%),
          linear-gradient(to right, transparent 0%, black 100%),
          linear-gradient(black, black);

        mask-size:
          var(--left-mask-width) 100%,
          var(--right-mask-width) 100%,
          100% 100%;
        mask-repeat: no-repeat, no-repeat, no-repeat;
        mask-position:
          var(--mask-offset-left) 0,
          calc(100% - var(--mask-offset-right)) 0,
          0 0;
        mask-composite: exclude;

        animation-name: show-left-mask, hide-right-mask;
        animation-timeline: scroll(self inline), scroll(self inline);
        animation-range:
          0 var(--scroll-buffer),
          calc(100% - var(--scroll-buffer)) 100%;
        animation-fill-mode: both;
      }

      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/scroll-fade-effect.tsx" 
      import type { ComponentProps } from "react"

      import { cn } from "@/lib/utils"

      export type ScrollFadeEffectProps = ComponentProps<"div"> & {
        /**
         * Scroll direction to apply the fade effect.
         * @defaultValue "vertical"
         * */
        orientation?: "horizontal" | "vertical"
      }

      export function ScrollFadeEffect({
        className,
        orientation = "vertical",
        ...props
      }: ScrollFadeEffectProps) {
        return (
          <div
            data-orientation={orientation}
            className={cn(
              "data-[orientation=horizontal]:overflow-x-auto data-vertical:overflow-y-auto",
              "data-[orientation=horizontal]:scroll-fade-effect-x data-vertical:scroll-fade-effect-y",
              className
            )}
            {...props}
          />
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { ScrollFadeEffect } from "@/components/scroll-fade-effect"
```

```tsx
<div className="rounded-lg border">
  <ScrollFadeEffect className="h-72 w-48">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Turpis egestas pretium
    aenean pharetra. Orci eu lobortis elementum nibh tellus molestie. Vulputate
    dignissim suspendisse in est. Vel pharetra vel turpis nunc. Malesuada nunc
    vel risus commodo. Nisi vitae suscipit tellus mauris. Posuere morbi leo urna
    molestie at elementum eu. Urna duis convallis convallis tellus. Urna
    molestie at elementum eu. Nunc sed blandit libero volutpat.
  </ScrollFadeEffect>
</div>
```

## API reference

### ScrollFadeEffect

<TypeTable
  id="type-table-props.ts-ScrollFadeEffectProps"
  type={{
  "id": "props.ts-ScrollFadeEffectProps",
  "name": "ScrollFadeEffectProps",
  "description": "",
  "entries": [
    {
      "name": "orientation",
      "description": "Scroll direction to apply the fade effect.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "\"vertical\""
        }
      ],
      "type": "\"horizontal\" | \"vertical\" | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Examples

### Horizontal scrolling

```tsx
import Image from "next/image"

import { ScrollFadeEffect } from "@/components/scroll-fade-effect"

export default function ScrollFadeEffectHorizontalDemo() {
  return (
    <div className="rounded-lg border">
      <ScrollFadeEffect className="w-72 sm:w-96" orientation="horizontal">
        <div className="flex w-max gap-4 p-4">
          {works.map((artwork) => (
            <figure key={artwork.artist} className="shrink-0">
              <Image
                src={artwork.art}
                alt={`Photo by ${artwork.artist}`}
                className="aspect-3/4 size-fit rounded-sm object-cover"
                width={300}
                height={400}
              />

              <figcaption className="pt-2 text-xs text-muted-foreground">
                Photo by{" "}
                <span className="font-semibold text-foreground">
                  {artwork.artist}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </ScrollFadeEffect>
    </div>
  )
}

interface Artwork {
  artist: string
  art: string
}

const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
]

```

### shadcn/ui Scroll Area

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function ScrollAreaDemo() {
  return (
    <ScrollArea
      className={cn(
        "h-72 w-48 rounded-lg border",
        "**:data-[slot=scroll-area-viewport]:scroll-fade-effect-y"
        // "**:data-[slot=scroll-area-viewport]:[--mask-offset-top:8px]",
        // "**:data-[slot=scroll-area-viewport]:[--mask-offset-bottom:8px]"
      )}
    >
      <div className="p-4">
        <h4 className="mb-4 text-sm/none font-medium">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}

```

### shadcn/ui Scroll Area – Horizontal scrolling

```tsx
import Image from "next/image"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea
      className={cn(
        "w-72 rounded-lg border whitespace-nowrap sm:w-96",
        "**:data-[slot=scroll-area-viewport]:scroll-fade-effect-x"
        // "**:data-[slot=scroll-area-viewport]:[--mask-offset-left:8px]",
        // "**:data-[slot=scroll-area-viewport]:[--mask-offset-right:8px]"
      )}
    >
      <div className="flex w-max gap-4 p-4">
        {works.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <Image
              src={artwork.art}
              alt={`Photo by ${artwork.artist}`}
              className="aspect-3/4 size-fit rounded-sm object-cover"
              width={300}
              height={400}
            />

            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo by{" "}
              <span className="font-semibold text-foreground">
                {artwork.artist}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

interface Artwork {
  artist: string
  art: string
}

const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
]

```

## Credits

* [Rohit Singh Rawat](https://craft.rohitsinghrawat.com/crafts/scroll-timeline)

## References

* [animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline#browser_compatibility)
* [Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on June 27, 2026