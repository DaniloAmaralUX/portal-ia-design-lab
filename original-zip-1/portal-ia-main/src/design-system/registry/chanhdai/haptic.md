# Haptic Feedback

Trigger haptic feedback on mobile devices.

```tsx
"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { haptic } from "@/lib/haptic"

export default function HapticDemo() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 pointer-coarse:py-0">
      <Button onClick={() => haptic()}>Haptic</Button>

      <ScanToTryOnMobile />
    </div>
  )
}

function ScanToTryOnMobile() {
  return (
    <div className="flex flex-col items-center gap-6 pointer-coarse:hidden">
      <p className="text-center text-sm text-muted-foreground">
        Scan the QR code below to
        <br />
        try it out on mobile.
      </p>

      <Image
        className="rounded-lg border dark:border-transparent"
        src="https://assets.chanhdai.com/images/blog/haptic-qr-code.webp"
        alt="QR code"
        width={96}
        height={96}
        quality={100}
        unoptimized
      />
    </div>
  )
}

```

## Features

* Uses [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API) on Android and iOS checkbox trick on iOS.
* Supports custom duration and vibration patterns on Android devices.
* The haptic functionality was inspired by the [Vercel](https://vercel.com) mobile experience.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/haptic
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Copy and paste the following code into your project</Step>

      ```ts title="lib/haptic.ts" 
      const isTouchDevice =
        typeof window !== "undefined"
          ? window.matchMedia("(pointer: coarse)").matches
          : false

      /**
       * Trigger haptic feedback on mobile devices.
       * Uses Vibration API on Android/modern browsers, and iOS checkbox trick on iOS.
       *
       * @param pattern - Vibration duration (ms) or pattern.
       * Custom patterns only work on Android devices. iOS uses fixed feedback.
       * See [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)
       *
       * @example
       * import { haptic } from "@/lib/haptic"
       *
       * <Button onClick={() => haptic()}>Haptic</Button>
       */
      export function haptic(pattern: number | number[] = 50) {
        try {
          if (!isTouchDevice) return

          if ("vibrate" in navigator) {
            navigator.vibrate(pattern)
            return
          }

          // iOS haptic trick via checkbox switch element
          const label = document.createElement("label")
          label.ariaHidden = "true"
          label.style.display = "none"

          const input = document.createElement("input")
          input.type = "checkbox"
          input.setAttribute("switch", "")
          label.appendChild(input)

          try {
            document.head.appendChild(label)
            label.click()
          } finally {
            document.head.removeChild(label)
          }
        } catch {}
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { haptic } from "@/lib/haptic"
```

```tsx
<Button onClick={() => haptic()}>Haptic</Button>
```

<Callout>
  Haptic feedback should not be used arbitrarily. For best practices, please
  refer to Apple’s Human Interface Guidelines on [Playing
  haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics).
</Callout>

## API reference

<TypeTable
  id="type-table-props.ts-HapticProps"
  type={{
  "id": "props.ts-HapticProps",
  "name": "HapticProps",
  "description": "",
  "entries": [
    {
      "name": "haptic",
      "description": "Trigger haptic feedback on mobile devices.\nUses Vibration API on Android/modern browsers, and iOS checkbox trick on iOS.",
      "tags": [
        {
          "name": "param",
          "text": "pattern - Vibration duration (ms) or pattern.\nCustom patterns only work on Android devices. iOS uses fixed feedback.\nSee [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)"
        },
        {
          "name": "example",
          "text": "```tsx\nimport { haptic } from \"@/lib/haptic\"\n\n<Button onClick={() => haptic()}>Haptic</Button>\n```"
        }
      ],
      "type": "(pattern?: number | number[]) => void",
      "simplifiedType": "function",
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


Last updated on March 3, 2026