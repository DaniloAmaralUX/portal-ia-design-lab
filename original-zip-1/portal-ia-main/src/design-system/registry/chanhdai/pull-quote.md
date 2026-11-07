# Pull Quote

Display a testimonial quote with author attribution and source link.

```tsx
import { PullQuote } from "@/components/pull-quote"

export default function PullQuoteDemo() {
  return (
    <PullQuote
      authorName="Guillermo Rauch"
      authorTagline="CEO at Vercel"
      url="https://x.com/rauchg/status/1978913158514237669"
      quote="awesome. Love the components, especially slide-to-unlock. Great job"
    />
  )
}

```

## Use cases

* One standout quote inside a docs page or article.
* Customer feedback between sections of a landing page.
* Endorsement next to a product demo.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/pull-quote
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

      ```tsx title="components/pull-quote.tsx" 
      import { cn } from "@/lib/utils"

      export type PullQuoteProps = {
        /** Full display name of the person giving the testimonial. */
        authorName: string
        /** Short tagline, title, or description of the person. */
        authorTagline: string
        /** Link to the person's profile, website, or social media page. */
        url: string
        /** The testimonial text content or recommendation message. */
        quote: string
        /** Additional CSS classes to apply to the testimonial container. */
        className?: string
      }

      export function PullQuote({
        className,
        authorName,
        authorTagline,
        url,
        quote,
      }: PullQuoteProps) {
        return (
          <figure className={cn("relative flex flex-col gap-6 pl-3", className)}>
            <blockquote className="relative block w-full font-serif text-xl text-foreground md:w-lg md:text-2xl">
              <span
                className="absolute -left-3 text-muted-foreground select-none"
                aria-hidden="true"
              >
                “
              </span>
              <p className="inline text-pretty">{quote}</p>
              <span
                className="absolute translate-x-0.5 text-muted-foreground select-none"
                aria-hidden="true"
              >
                ”
              </span>
            </blockquote>

            <figcaption className="ml-auto flex w-full items-center gap-2 md:w-1/2">
              <div className="hidden h-px grow translate-y-px bg-border md:block" />

              <div className="flex flex-col md:ml-auto md:text-right">
                <span className="text-sm/none font-medium">
                  <a href={url} target="_blank" rel="noopener">
                    <span className="absolute inset-0" aria-hidden />
                    {authorName}
                  </a>
                  <span className="mt-1 block text-muted-foreground md:mt-0 md:inline">
                    <span className="hidden text-foreground md:inline">, </span>
                    {authorTagline}
                  </span>
                </span>
              </div>
            </figcaption>
          </figure>
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { PullQuote } from "@/components/pull-quote"
```

```tsx
<PullQuote
  authorName="Guillermo Rauch"
  authorTagline="CEO at Vercel"
  url="https://x.com/rauchg/status/1978913158514237669"
  quote="awesome. Love the components, especially slide-to-unlock. Great job"
/>
```

## API reference

### PullQuote

<TypeTable
  id="type-table-pull-quote.tsx-PullQuoteProps"
  type={{
  "id": "pull-quote.tsx-PullQuoteProps",
  "name": "PullQuoteProps",
  "description": "",
  "entries": [
    {
      "name": "authorName",
      "description": "Full display name of the person giving the testimonial.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "authorTagline",
      "description": "Short tagline, title, or description of the person.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "url",
      "description": "Link to the person's profile, website, or social media page.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "quote",
      "description": "The testimonial text content or recommendation message.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "className",
      "description": "Additional CSS classes to apply to the testimonial container.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on June 26, 2026