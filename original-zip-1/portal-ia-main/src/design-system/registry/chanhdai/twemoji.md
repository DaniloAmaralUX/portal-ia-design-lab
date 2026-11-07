# Twemoji

Render Unicode emoji as Twemoji SVG images inline with text.

```tsx
import { Twemoji } from "@/components/twemoji"

export default function TwemojiDemo() {
  return (
    <div className="flex flex-col gap-4 text-center">
      <p className="text-lg">
        <Twemoji>👍 ❤️ 🤣 😲 😭 😡</Twemoji>
      </p>
      <p className="text-lg">
        <Twemoji>Hello from Viet Nam 🇻🇳</Twemoji>
      </p>
      <p className="text-base">
        <Twemoji>Built with 💛 and ☕️</Twemoji>
      </p>
    </div>
  )
}

```

## Features

* Consistent emoji rendering across all platforms and browsers.
* Customizable image source for self-hosting or alternative CDNs.
* Server component compatible.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/twemoji
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

      <Step>Add the following CSS to your global styles</Step>

      ```css
      .twemoji {
        display: inline-block;
        height: 1em;
        width: 1em;
        margin: 0 0.05em 0 0.1em;
        vertical-align: -0.1em;
      }
      ```

      <Step>Copy the twemoji-regex file into your project</Step>

      [lib/twemoji-regex.ts](https://github.com/ncdai/chanhdai.com/blob/main/src/registry/components/twemoji/lib/twemoji-regex.ts)

      <Step>Copy and paste the following code into your project</Step>

      ````tsx title="components/twemoji.tsx" 
      import type { ReactNode } from "react"

      import { cn } from "@/lib/utils"
      import emojiRegex from "@/lib/twemoji-regex"

      const VARIATION_SELECTOR_16 = /\uFE0F/g
      const ZERO_WIDTH_JOINER = String.fromCharCode(0x200d)

      export const TWEMOJI_CDN_URL = "https://abs-0.twimg.com/emoji/v2/svg"

      export type TwemojiProps = {
        children: string
        className?: string
        /**
         * Resolve an emoji code point to an image URL.
         *
         * @param codePoint - The Unicode code point of the emoji (e.g. `1f44d`)
         * @returns The URL string pointing to the emoji image asset
         *
         * @example
         * ```tsx
         * source={(codePoint) => `https://cdn.example.com/emoji/${codePoint}.svg`}
         * ```
         * */
        source?: (codePoint: string) => string
      }

      export function Twemoji({
        children,
        className,
        source = defaultSource,
      }: TwemojiProps) {
        const parts: ReactNode[] = []
        let lastIndex = 0
        const globalRegex = new RegExp(emojiRegex.source, "g")
        let match

        while ((match = globalRegex.exec(children)) !== null) {
          if (match.index > lastIndex) {
            parts.push(children.substring(lastIndex, match.index))
          }

          const rawText = match[0]
          const codePoint = getEmojiCodePoint(rawText)

          if (codePoint) {
            parts.push(
              <img
                key={match.index}
                className={cn("twemoji", className)}
                draggable={false}
                alt={rawText}
                src={source(codePoint)}
              />
            )
          } else {
            parts.push(rawText)
          }

          lastIndex = globalRegex.lastIndex
        }

        if (lastIndex < children.length) {
          parts.push(children.substring(lastIndex))
        }

        return <>{parts}</>
      }

      function getEmojiCodePoint(rawText: string) {
        return toCodePoint(
          rawText.indexOf(ZERO_WIDTH_JOINER) < 0
            ? rawText.replace(VARIATION_SELECTOR_16, "")
            : rawText
        )
      }

      function toCodePoint(unicodeSurrogates: string, sep = "-") {
        const result: string[] = []
        let code = 0
        let previous = 0
        let i = 0

        while (i < unicodeSurrogates.length) {
          code = unicodeSurrogates.charCodeAt(i++)
          if (previous) {
            result.push(
              (0x10000 + ((previous - 0xd800) << 10) + (code - 0xdc00)).toString(16)
            )
            previous = 0
          } else if (0xd800 <= code && code <= 0xdbff) {
            previous = code
          } else {
            result.push(code.toString(16))
          }
        }

        return result.join(sep)
      }

      function defaultSource(codePoint: string) {
        return `${TWEMOJI_CDN_URL}/${codePoint}.svg`
      }

      ````

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { Twemoji } from "@/components/twemoji"
```

```tsx
<Twemoji>Hello from Viet Nam 🇻🇳</Twemoji>
```

## API reference

### Twemoji

<TypeTable
  id="type-table-twemoji.tsx-TwemojiProps"
  type={{
  "id": "twemoji.tsx-TwemojiProps",
  "name": "TwemojiProps",
  "description": "",
  "entries": [
    {
      "name": "children",
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
    },
    {
      "name": "source",
      "description": "Resolve an emoji code point to an image URL.",
      "tags": [
        {
          "name": "param",
          "text": "codePoint - The Unicode code point of the emoji (e.g. `1f44d`)"
        },
        {
          "name": "returns",
          "text": "The URL string pointing to the emoji image asset"
        },
        {
          "name": "example",
          "text": "```tsx\nsource={(codePoint) => `https://cdn.example.com/emoji/${codePoint}.svg`}\n```"
        }
      ],
      "type": "((codePoint: string) => string) | undefined",
      "simplifiedType": "function",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Examples

### Custom source

```tsx
<Twemoji
  source={(codePoint) =>
    `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoint}.svg`
  }
>
  Hello from Viet Nam 🇻🇳
</Twemoji>
```

## Credits

* [Twitter](https://github.com/twitter/twemoji)

## References

* [Twemoji Parser](https://github.com/twitter/twemoji-parser)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on April 7, 2026