# Brand Assets Menu

Context menu for copying brand SVGs and opening asset links.

```tsx
"use client"

import Link from "next/link"

import { BrandAssetsMenu } from "@/components/brand-assets-menu"

export default function BrandAssetsMenuDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <BrandAssetsMenu
        logomark={<ChanhDaiMark />}
        logomarkSVG={LOGOMARK_SVG}
        logotypeSVG={LOGOTYPE_SVG}
        brandGuidelinesURL="https://chanhdai.com/blog/chanhdai-brand"
        brandAssetsURL="https://assets.chanhdai.com/chanhdai-brand.zip"
      >
        <Link href="/" aria-label="Home">
          <ChanhDaiMark className="h-8 text-foreground" />
        </Link>
      </BrandAssetsMenu>

      <div className="text-sm text-muted-foreground">
        <span className="hidden pointer-fine:inline-block">
          Right-click the logo
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Press & hold the logo
        </span>
      </div>
    </div>
  )
}

const LOGOMARK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 256 128"><path fill="currentColor" d="M96 128H32V96h64v32ZM224 32h-64v64h64v32h-96V0h96v32ZM32 96H0V32h32v64ZM256 96h-32V32h32v64ZM96 32H32V0h64v32Z"/></svg>'

const LOGOTYPE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 2048 256"><path fill="currentColor" d="M192 256H64v-64h128v64ZM448 64H320v128h128v64H256V0h192v64ZM64 192H0V64h64v128ZM512 192h-64V64h64v128ZM192 64H64V0h128v64ZM768 32h32v32h-32zM672 0h96v32h-96zM640 32h32v192h-32zM672 224h96v32h-96zM768 192h32v32h-32zM832 0h32v256h-32zM864 64h96v32h-96zM960 96h32v160h-32zM1056 64h96v32h-96zM1024 96h32v128h-32zM1056 224h64v32h-64zM1120 192h32v32h-32zM1152 64h32v192h-32zM1216 64h32v192h-32zM1248 64h96v32h-96zM1344 96h32v160h-32zM1408 0h32v256h-32zM1440 64h96v32h-96zM1536 96h32v160h-32zM1632 0h64v32h-64zM1696 32h32v32h-32zM1696 192h32v32h-32zM1728 64h32v128h-32zM1632 224h64v32h-64zM1600 0h32v256h-32zM1824 64h96v32h-96zM1792 96h32v128h-32zM1824 224h64v32h-64zM1888 192h32v32h-32zM1920 64h32v192h-32zM1984 64h32v32h-32zM2016 64h32v192h-32zM2016 0h32v32h-32z"/></svg>'

function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 512 256"
      aria-hidden
      {...props}
    >
      <path
        fill="currentColor"
        d="M192 256H64v-64h128v64ZM448 64H320v128h128v64H256V0h192v64ZM64 192H0V64h64v128ZM512 192h-64V64h64v128ZM192 64H64V0h128v64Z"
      />
    </svg>
  )
}

```

Dependencies: @rexa-developer/tiks, lucide-react

Registry dependencies: context-menu, toast

## Features

* Copy mark and logotype SVGs to the clipboard with toast feedback.
* Link out to brand guidelines and asset downloads from one menu.
* Wrap any element to use it as a right-click or press-and-hold trigger.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/brand-assets-menu
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install cn lucide-react @rexa-developer/tiks
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Install the required components</Step>

      * [Context Menu](https://ui.shadcn.com/docs/components/base/context-menu)
      * [Toast](https://ui.shadcn.com/docs/components/base/toast)

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/brand-assets-menu.tsx" 
      "use client"

      import { useTiks } from "@rexa-developer/tiks/react"
      import { DownloadIcon, SquareDashedIcon, TypeIcon } from "lucide-react"

      import {
        ContextMenu,
        ContextMenuContent,
        ContextMenuItem,
        ContextMenuSeparator,
        ContextMenuTrigger,
      } from "@/components/ui/context-menu"
      import { toast } from "@/components/ui/toast"

      export type BrandAssetsMenuProps = {
        logomark: React.ReactElement
        logomarkSVG: string
        logotypeSVG: string
        brandGuidelinesURL: string
        brandAssetsURL: string
        children: React.ReactElement
      }

      export function BrandAssetsMenu({
        logomark,
        logomarkSVG,
        logotypeSVG,
        brandGuidelinesURL,
        brandAssetsURL,
        children,
      }: BrandAssetsMenuProps) {
        const { success } = useTiks()

        return (
          <ContextMenu>
            <ContextMenuTrigger render={children} />

            <ContextMenuContent className="w-fit">
              <ContextMenuItem
                onClick={() => {
                  copyText(logomarkSVG)
                  toast.add({ type: "success", title: "Logomark as SVG copied" })
                  success()
                }}
              >
                {logomark}
                Copy Logomark as SVG
              </ContextMenuItem>

              <ContextMenuItem
                onClick={() => {
                  copyText(logotypeSVG)
                  toast.add({ type: "success", title: "Logotype as SVG copied" })
                  success()
                }}
              >
                <TypeIcon />
                Copy Logotype as SVG
              </ContextMenuItem>

              <ContextMenuSeparator />

              <ContextMenuItem
                render={
                  <a
                    href={brandGuidelinesURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <SquareDashedIcon />
                Brand Guidelines
              </ContextMenuItem>

              <ContextMenuItem
                render={
                  <a
                    href={brandAssetsURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  />
                }
              >
                <DownloadIcon />
                Download Brand Assets
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      }

      const copyText = async (text: string) => {
        try {
          await navigator.clipboard.writeText(text)
          return true
        } catch {
          return false
        }
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { BrandAssetsMenu } from "@/components/brand-assets-menu"
```

```tsx
<BrandAssetsMenu
  logomark={<ChanhDaiMark />}
  logomarkSVG="<svg>...</svg>"
  logotypeSVG="<svg>...</svg>"
  brandGuidelinesURL="https://chanhdai.com/blog/chanhdai-brand"
  brandAssetsURL="https://assets.chanhdai.com/chanhdai-brand.zip"
>
  <Link />
</BrandAssetsMenu>
```

## API reference

### BrandAssetsMenu

<TypeTable
  id="type-table-brand-assets-menu.tsx-BrandAssetsMenuProps"
  type={{
  "id": "brand-assets-menu.tsx-BrandAssetsMenuProps",
  "name": "BrandAssetsMenuProps",
  "description": "",
  "entries": [
    {
      "name": "logomark",
      "description": "",
      "tags": [],
      "type": "ReactElement<unknown, string | JSXElementConstructor<any>>",
      "simplifiedType": "object",
      "required": true,
      "deprecated": false
    },
    {
      "name": "logomarkSVG",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "logotypeSVG",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "brandGuidelinesURL",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "brandAssetsURL",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "children",
      "description": "",
      "tags": [],
      "type": "ReactElement<unknown, string | JSXElementConstructor<any>>",
      "simplifiedType": "object",
      "required": true,
      "deprecated": false
    }
  ]
}}
/>

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on May 7, 2026