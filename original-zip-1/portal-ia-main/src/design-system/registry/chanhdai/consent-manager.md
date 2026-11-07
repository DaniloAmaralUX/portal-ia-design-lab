# Consent Manager

Cookie and tracking consent banner for Next.js, built on c15t.

<IframeEmbed className="aspect-3/4 sm:aspect-square md:aspect-video" src="https://react-wheel-picker.chanhdai.com/sponsors" title="Consent Manager Demo" />

<DocPullQuote authorName="Christopher Burns" authorTagline="Creator of c15t.com" url="https://x.com/BurnedChris/status/2000947403571204445" quote="This is super cool, Full circle moment (the prototype for c15t actually used shadcn). Would love to get this in our docs also and shared in our discord!" />

Dependencies: @c15t/nextjs

Registry dependencies: button

## Features

* Built on top of [c15t](https://c15t.com/docs/frameworks/next/quickstart).
* Theme customized to match [shadcn/ui](https://ui.shadcn.com/docs/theming).
* Designed for Next.js, adaptable to other frameworks via [c15t docs](https://c15t.com).

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/consent-manager
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install cn @c15t/nextjs
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Install the required components</Step>

      * [Button](https://ui.shadcn.com/docs/components/base/button)

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/consent-manager.tsx" 
      import {
        ConsentManagerDialog,
        ConsentManagerProvider,
        CookieBanner,
      } from "@c15t/nextjs"

      import { cn } from "@/lib/utils"
      import { buttonVariants } from "@/components/ui/button"

      export function ConsentManager({ children }: { children: React.ReactNode }) {
        return (
          <ConsentManagerProvider
            options={{
              mode: "offline",
              consentCategories: ["necessary", "measurement"],
              // ignoreGeoLocation: process.env.NODE_ENV === "development", // Useful for development to always view the banner.
            }}
          >
            <CookieBanner
              theme={{
                "banner.card": {
                  noStyle: true,
                  className: cn(
                    "relative w-full max-w-(--banner-max-width) divide-y overflow-hidden rounded-2xl",
                    "bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10 dark:ring-foreground/20"
                  ),
                },
                "banner.header.title": {
                  noStyle: true,
                  className: "text-base leading-none font-medium text-foreground",
                },
                "banner.header.description": {
                  noStyle: true,
                  className: "text-sm text-muted-foreground",
                },
                "banner.footer": {
                  style: {
                    "--banner-footer-background-color": "transparent",
                    "--banner-footer-background-color-dark": "transparent",
                  },
                },
                "banner.footer.reject-button": {
                  noStyle: true,
                  className: buttonVariants({ variant: "secondary" }),
                },
                "banner.footer.accept-button": {
                  noStyle: true,
                  className: buttonVariants({ variant: "secondary" }),
                },
                "banner.footer.customize-button": {
                  noStyle: true,
                  className: buttonVariants({ variant: "default" }),
                },
              }}
            />

            <ConsentManagerDialog
              theme={{
                "dialog.root": {
                  style: {
                    "--dialog-height": "100%",
                    "--dialog-font-family": "var(--font-sans)",

                    "--dialog-background-color": "var(--background)",
                    "--dialog-background-color-dark": "var(--background)",

                    "--dialog-border-width": "0",
                    "--dialog-border-color": "var(--border)",
                    "--dialog-border-color-dark": "var(--border)",

                    "--dialog-card-radius": "1rem",
                    "--dialog-card-shadow":
                      "0 0 0 1px var(--dialog-card-shadow-color)",
                  },
                  className:
                    "[--dialog-card-shadow-color:var(--foreground)]/10 dark:[--dialog-card-shadow-color:var(--border)]",
                },
                "dialog.overlay": {
                  style: {
                    "--dialog-overlay-background-color": "lab(0% 0 0 / 0.2)",
                    "--dialog-overlay-background-color-dark": "lab(0% 0 0 / 0.4)",
                  },
                },
                "dialog.title": {
                  noStyle: true,
                  className:
                    "text-base leading-none font-medium tracking-tight text-foreground",
                },
                "dialog.description": {
                  noStyle: true,
                  className: "text-sm text-muted-foreground",
                },
                "dialog.header": {
                  style: {
                    "--dialog-header-gap": "0.5rem",
                    "--dialog-card-gap": "0",
                  },
                },
                "dialog.footer": {
                  style: {
                    "--dialog-border-width": "1px",

                    "--dialog-stroke-color": "var(--border)",
                    "--dialog-stroke-color-dark": "var(--border)",

                    "--dialog-branding-icon-height": "1.125rem",
                    "--dialog-branding-font-size": "0.875rem",

                    "--dialog-branding-focus-color":
                      "color-mix(in oklab, var(--ring) 50%, transparent)",
                    "--dialog-branding-focus-color-dark":
                      "color-mix(in oklab, var(--ring) 50%, transparent)",

                    "--dialog-foreground-color": "var(--muted-foreground)",
                    "--dialog-foreground-color-dark": "var(--muted-foreground)",
                  },
                },
                "widget.accordion.item": {
                  noStyle: true,
                  className: "rounded-lg border",
                },
                "widget.accordion.trigger": {
                  noStyle: true,
                  className: "flex items-center gap-3 pr-3",
                },
                "widget.accordion.trigger-inner": {
                  noStyle: true,
                  className: cn(
                    "flex flex-1 items-center rounded-lg px-4 py-3 text-sm font-medium text-foreground **:[svg]:hidden",
                    "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  ),
                },
                "widget.accordion.content": {
                  noStyle: true,
                  className:
                    "overflow-hidden px-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                },
                "widget.accordion.content-inner": {
                  noStyle: true,
                  className: "pb-4 text-sm text-muted-foreground",
                },
                "widget.switch": {
                  noStyle: true,
                  className: cn(
                    "inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition-all",
                    "border border-transparent",
                    "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80"
                  ),
                },
                "widget.switch.track": {
                  noStyle: true,
                },
                "widget.switch.thumb": {
                  noStyle: true,
                  className: cn(
                    "pointer-events-none block size-4 rounded-full bg-background ring-0 transition-[translate,background-color]",
                    "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
                  ),
                },
                "widget.footer.sub-group": {
                  noStyle: true,
                  className: "grid grid-cols-2 gap-4 sm:flex",
                },
                "widget.footer.reject-button": {
                  noStyle: true,
                  className: buttonVariants({ variant: "secondary" }),
                },
                "widget.footer.accept-button": {
                  noStyle: true,
                  className: buttonVariants({ variant: "secondary" }),
                },
                "widget.footer.save-button": {
                  noStyle: true,
                  className: buttonVariants({ variant: "default" }),
                },
              }}
            />

            {children}
          </ConsentManagerProvider>
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

Wrap your app with the `ConsentManager` component:

```tsx title="app/layout.tsx" {1,7}
import { ConsentManager } from "@/components/consent-manager"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConsentManager>{children}</ConsentManager>
      </body>
    </html>
  )
}
```

For customization and advanced usage, see [c15t’s documentation](https://c15t.com/docs/frameworks/next/quickstart).

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on March 1, 2026