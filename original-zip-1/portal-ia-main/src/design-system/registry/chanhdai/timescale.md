# Timescale

Ruler-style timeline for plotting milestones along a horizontal or vertical axis.

```tsx
import Markdown from "react-markdown"

import {
  TimescaleAge,
  TimescaleContent,
  TimescaleHeader,
  TimescaleIntroScroll,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/components/timescale"

export default function TimescaleDemo() {
  return (
    <TimescaleIntroScroll>
      <TimescaleRoot className="mt-4">
        <TimescaleHeader>
          <TimescaleAge>Age</TimescaleAge>
          <TimescaleYear>Years</TimescaleYear>
        </TimescaleHeader>

        <TimescaleViewport>
          <TimescaleTrack>
            <TimescaleRail />

            {MILESTONES.map((milestone) => (
              <TimescaleItem key={milestone.year}>
                <TimescaleTick />

                <TimescaleAge>{milestone.year - BIRTH_YEAR}</TimescaleAge>
                <TimescaleYear>{milestone.year}</TimescaleYear>

                {milestone.content && (
                  <TimescaleContent className="typeset typeset-timescale">
                    <Markdown>{milestone.content}</Markdown>
                  </TimescaleContent>
                )}
              </TimescaleItem>
            ))}
          </TimescaleTrack>
        </TimescaleViewport>
      </TimescaleRoot>
    </TimescaleIntroScroll>
  )
}

const BIRTH_YEAR = 2000

type Milestone = {
  year: number
  content?: string
}

const MILESTONES: Milestone[] = [
  {
    year: 2000,
    content: "Born in Can Tho, Viet Nam.",
  },
  { year: 2001 },
  { year: 2002 },
  { year: 2003 },
  { year: 2004 },
  { year: 2005 },
  {
    year: 2006,
    content: "Started at Thuan Hung Primary School.",
  },
  { year: 2007 },
  { year: 2008 },
  { year: 2009 },
  { year: 2010 },
  {
    year: 2011,
    content: "Started at Thuan Hung Secondary School.",
  },
  { year: 2012 },
  { year: 2013 },
  {
    year: 2014,
    content: `Started learning to code and built my first website.

Won awards:

- 1st Prize — Can Tho City Young Informatics Contest 2014
- Consolation Prize — National Young Informatics Contest 2014

Visited Ha Noi, the capital, for the first time.`,
  },
  {
    year: 2015,
    content: `Won awards:

- 3rd Prize — Can Tho City Young Informatics Contest 2015
- Consolation Prize — National Young Informatics Contest 2015
- Outstanding Student — Most Outstanding Student of the District
- 2nd Prize — Can Tho City Youth and Children’s Creativity Contest 2015
- 3rd Prize — Can Tho City Science and Engineering Fair 2015

Visited Thu Dau Mot, Binh Duong for the first time.

Admitted to the specialized Computer Science class at Ly Tu Trong High School for the Gifted.`,
  },
  {
    year: 2016,
    content: `Won awards:

- Consolation Prize — Can Tho City Young Informatics Contest 2016
- 1st Prize — Can Tho City Youth and Children’s Creativity Contest 2016
- 3rd Prize — National Young Informatics Contest 2016
- Consolation Prize — National Youth and Children’s Creativity Contest 2016

Visited Quy Nhon, Binh Dinh for the first time, and returned to Ha Noi.`,
  },
  {
    year: 2017,
    content: `Won awards:

- 2nd Prize — Can Tho City Outstanding Student Selection Exam 2016-2017
- Consolation Prize — Can Tho City Young Informatics Contest 2017
- 3rd Prize — Can Tho City Young Informatics Contest 2017
- 2nd Prize — Can Tho City Youth and Children’s Creativity Contest 2017
- Creative Award — Binh Duong Hackathon 2017`,
  },
  {
    year: 2018,
    content: `Won awards:

- 1st Prize — Can Tho City Science and Engineering Fair 2018
- 3rd Prize — Can Tho City Outstanding Student Selection Exam 2017-2018
- 3rd Prize — National Science and Engineering Fair 2018 (ViSEF)
- 3rd Prize — Can Tho City Young Informatics Contest 2018
- 2nd Prize — Can Tho City Youth and Children’s Creativity Contest 2018
- 3rd Prize — National Young Informatics Contest 2018

Earned direct admission to University of Science, VNUHCM, majoring in Information Systems.

Began freelancing and joined Tung Tung as a UI/UX Designer.

Visited Da Lat, Lam Dong and Ba Ria - Vung Tau for the first time.`,
  },
  {
    year: 2019,
    content: `Became a Mobile Developer at Tung Tung.

Won 2nd Prize — Business Startup Competition 2019.`,
  },
  {
    year: 2020,
    content: "Became a Web Developer at Tung Tung.",
  },
  { year: 2021 },
  {
    year: 2022,
    content: `Joined Simplamo as a Senior Frontend Developer and UI Lead.

Launched [ZaDark](https://zadark.com) — 80K+ downloads, 30K+ active users.

Won Bronze Medal — 10th Design, Manufacturing, and Application Award 2022.`,
  },
  { year: 2023 },
  {
    year: 2024,
    content: "Founded [Quaric](https://quaric.com).",
  },
  {
    year: 2025,
    content: `Open-sourced [chanhdai.com](https://github.com/ncdai/chanhdai.com) — 2.4K+ stars on GitHub.

Released [React Wheel Picker](https://react-wheel-picker.chanhdai.com) — 1.5M+ downloads, selected for the [Vercel OSS Program](https://vercel.com/open-source-program).

Followed by [shadcn](https://x.com/shadcn) on X.`,
  },
  {
    year: 2026,
    content: `Joined [shadcncraft](https://shadcncraft.com) as a Design Engineer.

Selected for the [Claude for Open Source Program](https://claude.com/contact-sales/claude-for-oss).`,
  },
]

```

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/timescale
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

      ```tsx title="components/timescale.tsx" 
      "use client"

      // Inspired by Evil Rabbit's Lifeline: https://lifeline.evilrabbit.com
      import { useEffect, useRef } from "react"

      import { cn } from "@/lib/utils"

      export type TimescaleRootProps = React.ComponentProps<"div"> & {
        orientation?: "horizontal" | "vertical"
      }

      export function TimescaleRoot({
        className,
        orientation = "horizontal",
        ...props
      }: TimescaleRootProps) {
        return (
          <div
            data-slot="timescale-root"
            data-orientation={orientation}
            className={cn(
              "group/timescale relative flex w-full [--timescale-rail:--spacing(14)]",
              "data-[orientation=vertical]:flex-col",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleViewportProps = React.ComponentProps<"div">

      export function TimescaleViewport({
        className,
        ...props
      }: TimescaleViewportProps) {
        return (
          <div
            data-slot="timescale-viewport"
            className={cn(
              "no-scrollbar w-full",
              "group-data-[orientation=horizontal]/timescale:flex group-data-[orientation=horizontal]/timescale:flex-1 group-data-[orientation=horizontal]/timescale:scroll-fade-x group-data-[orientation=horizontal]/timescale:overflow-x-auto group-data-[orientation=horizontal]/timescale:overscroll-x-contain group-data-[orientation=horizontal]/timescale:pl-20 group-data-[orientation=horizontal]/timescale:scroll-fade-s-40",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleHeaderProps = React.ComponentProps<"div">

      export function TimescaleHeader({ className, ...props }: TimescaleHeaderProps) {
        return (
          <div
            data-slot="timescale-header"
            aria-hidden="true"
            className={cn(
              "z-10",
              "group-data-[orientation=horizontal]/timescale:absolute group-data-[orientation=horizontal]/timescale:top-0 group-data-[orientation=horizontal]/timescale:left-0 group-data-[orientation=horizontal]/timescale:w-20 group-data-[orientation=horizontal]/timescale:shrink-0 group-data-[orientation=horizontal]/timescale:bg-linear-to-r group-data-[orientation=horizontal]/timescale:from-background group-data-[orientation=horizontal]/timescale:from-75% group-data-[orientation=horizontal]/timescale:to-transparent group-data-[orientation=horizontal]/timescale:pr-4 group-data-[orientation=horizontal]/timescale:text-right",
              "group-data-[orientation=vertical]/timescale:grid group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:grid-cols-[var(--timescale-rail)_1fr] group-data-[orientation=vertical]/timescale:gap-x-4 group-data-[orientation=vertical]/timescale:bg-background",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleTrackProps = React.ComponentProps<"div">

      export function TimescaleTrack({ className, ...props }: TimescaleTrackProps) {
        return (
          <div
            data-slot="timescale-track"
            className={cn(
              "relative flex",
              "group-data-[orientation=horizontal]/timescale:w-max group-data-[orientation=horizontal]/timescale:items-start",
              "group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:flex-col group-data-[orientation=vertical]/timescale:pt-4",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleRailProps = React.ComponentProps<"div">

      export function TimescaleRail({ className, ...props }: TimescaleRailProps) {
        return (
          <div
            data-slot="timescale-rail"
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute border-dashed",
              "group-data-[orientation=horizontal]/timescale:inset-x-0 group-data-[orientation=horizontal]/timescale:top-(--timescale-rail) group-data-[orientation=horizontal]/timescale:h-px group-data-[orientation=horizontal]/timescale:border-t",
              "group-data-[orientation=vertical]/timescale:inset-y-0 group-data-[orientation=vertical]/timescale:left-(--timescale-rail) group-data-[orientation=vertical]/timescale:w-px group-data-[orientation=vertical]/timescale:border-l",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleItemProps = React.ComponentProps<"div">

      export function TimescaleItem({ className, ...props }: TimescaleItemProps) {
        return (
          <div
            data-slot="timescale-item"
            className={cn(
              "relative",
              "group-data-[orientation=horizontal]/timescale:w-20 group-data-[orientation=horizontal]/timescale:shrink-0 group-data-[orientation=horizontal]/timescale:not-last:pr-4 group-data-[orientation=horizontal]/timescale:has-data-[slot=timescale-content]:w-80",
              "group-data-[orientation=vertical]/timescale:grid group-data-[orientation=vertical]/timescale:w-full group-data-[orientation=vertical]/timescale:grid-cols-[var(--timescale-rail)_1fr] group-data-[orientation=vertical]/timescale:gap-x-4 group-data-[orientation=vertical]/timescale:not-last:pb-4",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleTickProps = React.ComponentProps<"span">

      export function TimescaleTick({ className, ...props }: TimescaleTickProps) {
        return (
          <span
            data-slot="timescale-tick"
            aria-hidden="true"
            className={cn(
              "absolute z-10 bg-border",
              "group-data-[orientation=horizontal]/timescale:top-(--timescale-rail) group-data-[orientation=horizontal]/timescale:left-0 group-data-[orientation=horizontal]/timescale:h-3 group-data-[orientation=horizontal]/timescale:w-px group-data-[orientation=horizontal]/timescale:-translate-y-1/2",
              "group-data-[orientation=vertical]/timescale:top-2.5 group-data-[orientation=vertical]/timescale:left-(--timescale-rail) group-data-[orientation=vertical]/timescale:h-px group-data-[orientation=vertical]/timescale:w-3 group-data-[orientation=vertical]/timescale:-translate-x-1/2",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleAgeProps = React.ComponentProps<"p">

      export function TimescaleAge({ className, ...props }: TimescaleAgeProps) {
        return (
          <p
            data-slot="timescale-age"
            className={cn(
              "text-xs/5 font-medium text-muted-foreground tabular-nums",
              "in-data-[slot=timescale-header]:tracking-widest in-data-[slot=timescale-header]:uppercase",
              "group-data-[orientation=vertical]/timescale:col-start-1 group-data-[orientation=vertical]/timescale:row-start-1 group-data-[orientation=vertical]/timescale:pr-4 group-data-[orientation=vertical]/timescale:text-right",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleYearProps = React.ComponentProps<"p">

      export function TimescaleYear({ className, ...props }: TimescaleYearProps) {
        return (
          <p
            data-slot="timescale-year"
            className={cn(
              "text-xs/5 font-medium text-muted-foreground tabular-nums",
              "in-data-[slot=timescale-header]:tracking-widest in-data-[slot=timescale-header]:uppercase",
              "group-data-[orientation=vertical]/timescale:col-start-2 group-data-[orientation=vertical]/timescale:row-start-1",
              className
            )}
            {...props}
          />
        )
      }

      export type TimescaleContentProps = React.ComponentProps<"div">

      export function TimescaleContent({
        className,
        ...props
      }: TimescaleContentProps) {
        return (
          <div
            data-slot="timescale-content"
            className={cn(
              "w-full py-4 text-left",
              "group-data-[orientation=horizontal]/timescale:mt-4",
              "group-data-[orientation=vertical]/timescale:col-start-2 group-data-[orientation=vertical]/timescale:row-start-2",
              className
            )}
            {...props}
          />
        )
      }

      const INTRO_SCROLL_START_HOLD = 200 // ms resting on the first item before scrolling

      // Sweeps a horizontal Timescale to its most recent item on mount using native
      // smooth scroll, so `scroll-fade` stays in sync and there is no scroll stepping.
      export function TimescaleIntroScroll({
        children,
      }: {
        children: React.ReactNode
      }) {
        const ref = useRef<HTMLDivElement>(null)

        useEffect(() => {
          const viewport = ref.current?.querySelector<HTMLElement>(
            '[data-slot="timescale-viewport"]'
          )
          if (!viewport) return

          const distance = viewport.scrollWidth - viewport.clientWidth
          if (distance <= 0) return

          // Respect users who opt out of motion: land at the end without the sweep.
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            viewport.scrollLeft = distance
            return
          }

          // A user gesture cancels the native smooth scroll, so no manual interruption
          // handling is needed.
          const timer = window.setTimeout(() => {
            viewport.scrollTo({ left: distance, behavior: "smooth" })
          }, INTRO_SCROLL_START_HOLD)

          return () => window.clearTimeout(timer)
        }, [])

        return (
          <div ref={ref} className="contents">
            {children}
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
import {
  TimescaleAge,
  TimescaleContent,
  TimescaleHeader,
  TimescaleIntroScroll,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/components/timescale"
```

```tsx
<TimescaleIntroScroll>
  <TimescaleRoot>
    <TimescaleHeader>
      <TimescaleAge />
      <TimescaleYear />
    </TimescaleHeader>

    <TimescaleViewport>
      <TimescaleTrack>
        <TimescaleRail />

        <TimescaleItem>
          <TimescaleTick />
          <TimescaleAge />
          <TimescaleYear />
          <TimescaleContent />
        </TimescaleItem>
      </TimescaleTrack>
    </TimescaleViewport>
  </TimescaleRoot>
</TimescaleIntroScroll>
```

## Composition

Use the following composition to build a `Timescale`

```text
TimescaleRoot
├── TimescaleHeader
│   ├── TimescaleAge
│   └── TimescaleYear
└── TimescaleViewport
    └── TimescaleTrack
        ├── TimescaleRail
        └── TimescaleItem
            ├── TimescaleTick
            ├── TimescaleAge
            ├── TimescaleYear
            └── TimescaleContent
```

Wrap in `TimescaleIntroScroll` to scroll a horizontal `Timescale` to its latest item on mount, respecting `prefers-reduced-motion`.

## API reference

### TimescaleRoot

<TypeTable
  id="type-table-props.ts-TimescaleRootProps"
  type={{
  "id": "props.ts-TimescaleRootProps",
  "name": "TimescaleRootProps",
  "description": "",
  "entries": [
    {
      "name": "orientation",
      "description": "",
      "tags": [],
      "type": "\"horizontal\" | \"vertical\" | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Credits

* [Evil Rabbit](https://lifeline.evilrabbit.com)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on July 25, 2026