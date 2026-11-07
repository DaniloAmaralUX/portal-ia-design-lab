# Glow Card Grid

Display cards with glowing border and background effects.

```tsx
import { GlowCard, GlowCardGrid } from "@/components/glow-card-grid"

export default function GlowCardGridDemo() {
  return (
    <div className="w-full p-4">
      <GlowCardGrid>
        {CARDS.map((card) => (
          <GlowCard
            key={card.name}
            name={card.name}
            handle={card.handle}
            avatar={card.avatar}
          />
        ))}
      </GlowCardGrid>
    </div>
  )
}

// Demo avatars only. Replace them with your own URLs.
const CARDS = [
  {
    name: "shadcn",
    handle: "@shadcn",
    avatar: "https://assets.chanhdai.com/avatars/x/shadcn.webp",
  },
  {
    name: "OrcDev",
    handle: "@orcdev",
    avatar: "https://assets.chanhdai.com/avatars/x/orcdev.webp",
  },
  {
    name: "David Haz",
    handle: "@davidhaz",
    avatar: "https://assets.chanhdai.com/avatars/x/davidhaz.webp",
  },
  {
    name: "Shu",
    handle: "@shuding",
    avatar: "https://assets.chanhdai.com/avatars/x/shuding.webp",
  },
  {
    name: "Emil Kowalski",
    handle: "@emilkowalski",
    avatar: "https://assets.chanhdai.com/avatars/x/emilkowalski.webp",
  },
  {
    name: "Chánh Đại",
    handle: "@iamncdai",
    avatar: "https://assets.chanhdai.com/avatars/x/iamncdai.webp",
  },
]

```

## Use cases

* Team member grid on an about page.
* Feature cards on a landing page.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/glow-card-grid
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

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/glow-card-grid.tsx" 
      "use client"

      import { useEffect, useRef } from "react"

      import { cn } from "@/lib/utils"

      export type GlowCardGridProps = React.ComponentPropsWithoutRef<"div"> & {
        // Card parameters
        cardRadius?: number

        // Icon parameters
        iconBlur?: number
        iconSaturate?: number
        iconBrightness?: number
        iconScale?: number
        iconOpacity?: number

        // Border parameters
        borderWidth?: number
        borderBlur?: number
        borderSaturate?: number
        borderBrightness?: number
        borderContrast?: number

        children: React.ReactNode
      }

      export function GlowCardGrid({
        cardRadius = 16,

        iconBlur = 25,
        iconSaturate = 5.0,
        iconBrightness = 1.3,
        iconScale = 4,
        iconOpacity = 0.3,

        borderWidth = 3,
        borderBlur = 10,
        borderSaturate = 4.2,
        borderBrightness = 2.5,
        borderContrast = 2.5,

        className,
        style,
        ...props
      }: GlowCardGridProps) {
        const gridRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
          const handlePointerMove = (event: PointerEvent) => {
            if (!gridRef.current) return

            const cards = gridRef.current.querySelectorAll<HTMLElement>(
              "[data-slot='glow-card']"
            )

            cards.forEach((card) => {
              const rect = card.getBoundingClientRect()

              const centerX = rect.left + rect.width / 2
              const centerY = rect.top + rect.height / 2

              const x = (event.clientX - centerX) / (rect.width / 2)
              const y = (event.clientY - centerY) / (rect.height / 2)

              card.style.setProperty("--pointer-x", x.toFixed(3))
              card.style.setProperty("--pointer-y", y.toFixed(3))
            })
          }

          document.addEventListener("pointermove", handlePointerMove)

          return () => document.removeEventListener("pointermove", handlePointerMove)
        }, [])

        return (
          <div
            ref={gridRef}
            className={cn(
              "grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3",
              className
            )}
            style={
              {
                "--card-radius": `${cardRadius}px`,
                "--card-icon-blur": `${iconBlur}px`,
                "--card-icon-saturate": iconSaturate,
                "--card-icon-brightness": iconBrightness,
                "--card-icon-scale": iconScale,
                "--card-icon-opacity": iconOpacity,
                "--card-border-width": `${borderWidth}px`,
                "--card-border-blur": `${borderBlur}px`,
                "--card-border-saturate": borderSaturate,
                "--card-border-brightness": borderBrightness,
                "--card-border-contrast": borderContrast,
                ...style,
              } as React.CSSProperties
            }
            {...props}
          />
        )
      }

      export type GlowCardProps = {
        name: string
        handle: string
        avatar: string
        className?: string
      }

      export function GlowCard({ name, handle, avatar, className }: GlowCardProps) {
        return (
          <div
            data-slot="glow-card"
            className={cn(
              "@container-size relative h-52 w-full overflow-hidden rounded-(--card-radius) ring-1 ring-border transition-[translate,scale] select-none active:scale-[0.98]",
              className
            )}
          >
            <div className="flex size-full overflow-hidden rounded-(--card-radius) [clip-path:inset(0_round_var(--card-radius))]">
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-center",
                  "translate-x-[calc(var(--pointer-x,-10)*50cqi)] translate-y-[calc(var(--pointer-y,-10)*50cqh)] translate-z-0 scale-(--card-icon-scale)",
                  "blur-(--card-icon-blur) brightness-(--card-icon-brightness) saturate-(--card-icon-saturate)",
                  "opacity-(--card-icon-opacity) will-change-[transform,filter]"
                )}
              >
                <img className="size-20" src={avatar} alt={name} />
              </div>

              <div className="z-1 flex flex-1 flex-col items-center justify-center gap-4">
                <img className="size-20 rounded-full" src={avatar} alt={name} />

                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-base leading-none font-semibold text-foreground">
                    {name}
                  </h2>
                  <p className="text-sm/none text-foreground/50">{handle}</p>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "pointer-events-none absolute inset-0 translate-z-0 rounded-(--card-radius)",
                "border-(length:--card-border-width) border-solid border-transparent",
                "backdrop-blur-(--card-border-blur) backdrop-brightness-(--card-border-brightness) backdrop-contrast-(--card-border-contrast) backdrop-saturate-(--card-border-saturate)",
                "[clip-path:inset(0_round_var(--card-radius))]"
              )}
              style={
                {
                  maskImage:
                    "linear-gradient(#fff 0 100%), linear-gradient(#fff 0 100%)",
                  maskOrigin: "border-box, padding-box",
                  maskClip: "border-box, padding-box",
                  maskComposite: "exclude",
                  WebkitMaskComposite: "xor",
                } as React.CSSProperties
              }
            />
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
import { GlowCard, GlowCardGrid } from "@/components/glow-card-grid"
```

```tsx
<GlowCardGrid>
  <GlowCard />
</GlowCardGrid>
```

## Composition

Use the following composition to build a `GlowCardGrid`

```text
GlowCardGrid
└── GlowCard
```

## API reference

### GlowCard

<TypeTable
  id="type-table-props.ts-GlowCardProps"
  type={{
  "id": "props.ts-GlowCardProps",
  "name": "GlowCardProps",
  "description": "",
  "entries": [
    {
      "name": "name",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "handle",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "avatar",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
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

### GlowCardGrid

<TypeTable
  id="type-table-props.ts-GlowCardGridProps"
  type={{
  "id": "props.ts-GlowCardGridProps",
  "name": "GlowCardGridProps",
  "description": "",
  "entries": [
    {
      "name": "children",
      "description": "",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": true,
      "deprecated": false
    },
    {
      "name": "cardRadius",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "iconBlur",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "iconSaturate",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "iconBrightness",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "iconScale",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "iconOpacity",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "borderWidth",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "borderBlur",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "borderSaturate",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "borderBrightness",
      "description": "",
      "tags": [],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    },
    {
      "name": "borderContrast",
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

## Examples

### Tuning effect parameters

This example shows how to use DialKit to create live controls for fine-tuning the glow effect parameters in real-time.

[View live demo](/preview/glow-card-grid-dialkit)

<Steps>
  <Step>Install DialKit in your project</Step>

  Follow the [DialKit installation guide](https://joshpuckett.me/dialkit#installation) to add it to your project.

  <Step>Create interactive controls with the useDialKit hook</Step>

  Use the hook to define parameter ranges and pass them to your component as props.

  ```tsx
  import { useDialKit } from "dialkit"

  import { GlowCard, GlowCardGrid } from "@/components/glow-card-grid"
  ```

  ```tsx
  const params = useDialKit("GlowCard", {
    cardRadius: [16, 0, 32, 1],
    icon: {
      blur: [25, 0, 100, 1], // [default, min, max, step]
      saturate: [5.0, 0, 10, 0.1],
      brightness: [1.3, 0, 4, 0.1],
      scale: [4, 1, 6, 0.1],
      opacity: [0.3, 0, 1, 0.01],
    },
    border: {
      width: [3, 1, 6, 1],
      blur: [10, 0, 100, 1],
      saturate: [4.2, 0, 10, 0.1],
      brightness: [2.5, 0, 4, 0.1],
      contrast: [2.5, 0, 3, 0.1],
    },
  })

  <GlowCardGrid
    // Card parameters
    cardRadius={params.cardRadius}
    // Icon parameters
    iconBlur={params.icon.blur}
    iconSaturate={params.icon.saturate}
    iconBrightness={params.icon.brightness}
    iconScale={params.icon.scale}
    iconOpacity={params.icon.opacity}
    // Border parameters
    borderWidth={params.border.width}
    borderBlur={params.border.blur}
    borderSaturate={params.border.saturate}
    borderBrightness={params.border.brightness}
    borderContrast={params.border.contrast}
  >
    <GlowCard />
    <GlowCard />
    <GlowCard />
  </GlowCardGrid>
  ```

  <Step>Customize the parameters until you are satisfied with the result</Step>
</Steps>

## Credits

* [@jh3yy](https://x.com/jh3yy/status/1992003440579662211)

## References

* [DialKit](https://joshpuckett.me/dialkit)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on March 30, 2026