# Carbon Ads

Display a Carbon Ads unit in Next.js apps, styled to match your shadcn/ui theme.

```tsx
import { CarbonAds } from "@/components/carbon-ads"

const serve = process.env.NEXT_PUBLIC_CARBON_ADS_SERVE
const placement = process.env.NEXT_PUBLIC_CARBON_ADS_PLACEMENT

export default function CarbonAdsDemo() {
  if (!serve || !placement) return null

  return <CarbonAds serve={serve} placement={placement} />
}

```

## Features

* Refreshes the ad on client-side navigation.
* Matches your shadcn/ui theme in light and dark mode.
* Keeps the slot height while loading and hides it when an ad blocker stops the script.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/carbon-ads
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

      <Step>Add the ad theme styles to your global CSS</Step>

      ```css title="globals.css"
      #carbonads #carbon-responsive {
        --carbon-padding: calc(var(--spacing) * 3);
        --carbon-bg-primary: color-mix(in oklab, var(--muted) 50%, var(--background));
        --carbon-bg-secondary: var(--border);
        --carbon-text-color: var(--foreground);
        @apply gap-2 font-sans;
      }

      #carbonads #carbon-responsive .carbon-poweredby {
        @apply text-xs text-muted-foreground/80 opacity-100;
      }
      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/carbon-ads.tsx" 
      "use client"

      import { useEffect, useRef, useState } from "react"
      import { usePathname } from "next/navigation"

      import { cn } from "@/lib/utils"

      declare global {
        interface Window {
          _carbonads?: {
            refresh: () => void
          }
        }
      }

      const SCRIPT_ID = "_carbonads_js"

      export type CarbonAdsProps = {
        /** The `serve` query parameter of your Carbon ad tag. */
        serve: string
        /** The `placement` query parameter of your Carbon ad tag. */
        placement: string
        /**
         * Ad layout. `responsive` adapts to the container width, `cover` is the
         * taller unit.
         * @defaultValue "responsive"
         */
        format?: "cover" | "responsive"
        className?: string
      }

      export function CarbonAds({
        serve,
        placement,
        format = "responsive",
        className,
      }: CarbonAdsProps) {
        const pathname = usePathname()
        const containerRef = useRef<HTMLDivElement>(null)
        const [blocked, setBlocked] = useState(false)

        useEffect(() => {
          const container = containerRef.current
          if (!container) return

          // carbon.js inserts the ad after its script tag, so the tag lives here.
          // A loading script runs its own init, so refresh only after it loaded.
          const script = document.getElementById(SCRIPT_ID)
          if (script) {
            if (container.contains(script) && script.dataset.loaded) {
              window._carbonads?.refresh()
            }
            return
          }

          const el = document.createElement("script")
          el.id = SCRIPT_ID
          el.async = true
          el.type = "text/javascript"
          el.src = `//cdn.carbonads.com/carbon.js?serve=${serve}&placement=${placement}&format=${format}`
          el.onload = () => {
            el.dataset.loaded = "true"
          }
          el.onerror = () => setBlocked(true)
          container.appendChild(el)
        }, [pathname, serve, placement, format])

        if (blocked) return null

        return (
          <div
            ref={containerRef}
            data-slot="carbon-ads"
            data-format={format}
            className={cn("min-h-39 data-[format=cover]:min-h-70", className)}
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
import { CarbonAds } from "@/components/carbon-ads"
```

```tsx
<CarbonAds serve="XXXXXXXX" placement="yoursitecom" />
```

Take `serve` and `placement` from your ad tag in the Carbon dashboard (Zones > Get Ad Tags). Carbon serves one ad per page, so render a single `CarbonAds` per route.

## API reference

### CarbonAds

<TypeTable
  id="type-table-carbon-ads.tsx-CarbonAdsProps"
  type={{
  "id": "carbon-ads.tsx-CarbonAdsProps",
  "name": "CarbonAdsProps",
  "description": "",
  "entries": [
    {
      "name": "serve",
      "description": "The `serve` query parameter of your Carbon ad tag.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "placement",
      "description": "The `placement` query parameter of your Carbon ad tag.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "format",
      "description": "Ad layout. `responsive` adapts to the container width, `cover` is the\ntaller unit.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "\"responsive\""
        }
      ],
      "type": "\"cover\" | \"responsive\" | undefined",
      "simplifiedType": "union",
      "required": false,
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

## References

* [Carbon Ads](https://www.carbonads.net)
* [usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on September 5, 2026