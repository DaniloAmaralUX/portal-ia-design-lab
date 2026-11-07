# GitHub Contributions

Visualize year-long GitHub contribution activity with daily counts, tooltips, and a profile link.

```tsx
import { Suspense } from "react"

import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/github-contributions"
import { getCachedContributions } from "@/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsDemo() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
      />
    </Suspense>
  )
}

```

Dependencies: date-fns

Registry dependencies: tooltip, spinner, contribution-graph

## Features

* Shows a full year of daily activity with a color legend and total count.
* Caches fetched contributions for a day, so repeat visits do not hit the API.
* Streams in behind a Suspense boundary with a spinner fallback while data loads.
* Works with any API compatible with the GitHub Contributions API.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/github-contributions
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install date-fns cn
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Install the required shadcn/ui components</Step>

      * [Spinner](https://ui.shadcn.com/docs/components/base/spinner)
      * [Tooltip](https://ui.shadcn.com/docs/components/base/tooltip)

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/contribution-graph.tsx" 
      // Credit: https://www.kibo-ui.com/components/contribution-graph

      "use client"

      import {
        createContext,
        Fragment,
        useContext,
        useMemo,
        type CSSProperties,
        type HTMLAttributes,
        type ReactNode,
      } from "react"
      import type { Day as WeekDay } from "date-fns"
      import {
        differenceInCalendarDays,
        eachDayOfInterval,
        formatISO,
        getDay,
        getMonth,
        getYear,
        nextDay,
        parseISO,
        subWeeks,
      } from "date-fns"

      import { cn } from "@/lib/utils"

      export type Activity = {
        date: string
        count: number
        level: number
      }

      type Week = Array<Activity | undefined>

      export type Labels = {
        months?: string[]
        weekdays?: string[]
        totalCount?: string
        legend?: {
          less?: string
          more?: string
        }
      }

      type MonthLabel = {
        weekIndex: number
        label: string
      }

      const DEFAULT_MONTH_LABELS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]

      const DEFAULT_LABELS: Labels = {
        months: DEFAULT_MONTH_LABELS,
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        totalCount: "{{count}} activities in {{year}}",
        legend: {
          less: "Less",
          more: "More",
        },
      }

      const THEME = cn(
        'data-[level="0"]:fill-muted-foreground/5',
        'data-[level="1"]:fill-muted-foreground/20',
        'data-[level="2"]:fill-muted-foreground/40',
        'data-[level="3"]:fill-muted-foreground/60',
        'data-[level="4"]:fill-muted-foreground/80'
      )

      type ContributionGraphContextType = {
        data: Activity[]
        weeks: Week[]
        blockMargin: number
        blockRadius: number
        blockSize: number
        fontSize: number
        labels: Labels
        labelHeight: number
        maxLevel: number
        totalCount: number
        weekStart: WeekDay
        year: number
        width: number
        height: number
      }

      const ContributionGraphContext =
        createContext<ContributionGraphContextType | null>(null)

      const useContributionGraph = () => {
        const context = useContext(ContributionGraphContext)

        if (!context) {
          throw new Error(
            "ContributionGraph components must be used within a ContributionGraph"
          )
        }

        return context
      }

      const fillHoles = (activities: Activity[]): Activity[] => {
        if (activities.length === 0) {
          return []
        }

        // Sort activities by date to ensure correct date range
        const sortedActivities = [...activities].sort((a, b) =>
          a.date.localeCompare(b.date)
        )

        const calendar = new Map<string, Activity>(activities.map((a) => [a.date, a]))

        const firstActivity = sortedActivities[0] as Activity
        const lastActivity = sortedActivities.at(-1)

        if (!lastActivity) {
          return []
        }

        return eachDayOfInterval({
          start: parseISO(firstActivity.date),
          end: parseISO(lastActivity.date),
        }).map((day) => {
          const date = formatISO(day, { representation: "date" })

          if (calendar.has(date)) {
            return calendar.get(date) as Activity
          }

          return {
            date,
            count: 0,
            level: 0,
          }
        })
      }

      const groupByWeeks = (
        activities: Activity[],
        weekStart: WeekDay = 0
      ): Week[] => {
        if (activities.length === 0) {
          return []
        }

        const normalizedActivities = fillHoles(activities)
        const firstActivity = normalizedActivities[0] as Activity
        const firstDate = parseISO(firstActivity.date)
        const firstCalendarDate =
          getDay(firstDate) === weekStart
            ? firstDate
            : subWeeks(nextDay(firstDate, weekStart), 1)

        const paddedActivities = [
          ...(new Array(differenceInCalendarDays(firstDate, firstCalendarDate)).fill(
            undefined
          ) as Activity[]),
          ...normalizedActivities,
        ]

        const numberOfWeeks = Math.ceil(paddedActivities.length / 7)

        return new Array(numberOfWeeks)
          .fill(undefined)
          .map((_, weekIndex) =>
            paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7)
          )
      }

      const getMonthLabels = (
        weeks: Week[],
        monthNames: string[] = DEFAULT_MONTH_LABELS
      ): MonthLabel[] => {
        return weeks
          .reduce<MonthLabel[]>((labels, week, weekIndex) => {
            const firstActivity = week.find((activity) => activity !== undefined)

            if (!firstActivity) {
              throw new Error(
                `Unexpected error: Week ${weekIndex + 1} is empty: [${week}].`
              )
            }

            const month = monthNames[getMonth(parseISO(firstActivity.date))]

            if (!month) {
              const monthName = new Date(firstActivity.date).toLocaleString("en-US", {
                month: "short",
              })
              throw new Error(
                `Unexpected error: undefined month label for ${monthName}.`
              )
            }

            const prevLabel = labels.at(-1)

            if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
              return labels.concat({ weekIndex, label: month })
            }

            return labels
          }, [])
          .filter(({ weekIndex }, index, labels) => {
            const minWeeks = 3

            if (index === 0) {
              return labels[1] && labels[1].weekIndex - weekIndex >= minWeeks
            }

            if (index === labels.length - 1) {
              return weeks.slice(weekIndex).length >= minWeeks
            }

            return true
          })
      }

      export type ContributionGraphProps = HTMLAttributes<HTMLDivElement> & {
        data: Activity[]
        blockMargin?: number
        blockRadius?: number
        blockSize?: number
        fontSize?: number
        labels?: Labels
        maxLevel?: number
        style?: CSSProperties
        totalCount?: number
        weekStart?: WeekDay
        children: ReactNode
        className?: string
      }

      export const ContributionGraph = ({
        data,
        blockMargin = 4,
        blockRadius = 2,
        blockSize = 12,
        fontSize = 14,
        labels: labelsProp = undefined,
        maxLevel: maxLevelProp = 4,
        style = {},
        totalCount: totalCountProp = undefined,
        weekStart = 0,
        className,
        ...props
      }: ContributionGraphProps) => {
        const maxLevel = Math.max(1, maxLevelProp)
        const weeks = useMemo(() => groupByWeeks(data, weekStart), [data, weekStart])
        const LABEL_MARGIN = 8

        const labels = { ...DEFAULT_LABELS, ...labelsProp }
        const labelHeight = fontSize + LABEL_MARGIN

        const year =
          data.length > 0 ? getYear(parseISO(data[0].date)) : new Date().getFullYear()

        const totalCount =
          typeof totalCountProp === "number"
            ? totalCountProp
            : data.reduce((sum, activity) => sum + activity.count, 0)

        const width = weeks.length * (blockSize + blockMargin) - blockMargin
        const height = labelHeight + (blockSize + blockMargin) * 7 - blockMargin

        if (data.length === 0) {
          return null
        }

        return (
          <ContributionGraphContext.Provider
            value={{
              data,
              weeks,
              blockMargin,
              blockRadius,
              blockSize,
              fontSize,
              labels,
              labelHeight,
              maxLevel,
              totalCount,
              weekStart,
              year,
              width,
              height,
            }}
          >
            <div
              className={cn("flex w-max max-w-full flex-col gap-2", className)}
              style={{ fontSize, ...style }}
              {...props}
            />
          </ContributionGraphContext.Provider>
        )
      }

      export type ContributionGraphBlockProps = HTMLAttributes<SVGRectElement> & {
        activity: Activity
        dayIndex: number
        weekIndex: number
      }

      export const ContributionGraphBlock = ({
        activity,
        dayIndex,
        weekIndex,
        className,
        ...props
      }: ContributionGraphBlockProps) => {
        const { blockSize, blockMargin, blockRadius, labelHeight, maxLevel } =
          useContributionGraph()

        if (activity.level < 0 || activity.level > maxLevel) {
          throw new RangeError(
            `Provided activity level ${activity.level} for ${activity.date} is out of range. It must be between 0 and ${maxLevel}.`
          )
        }

        return (
          <rect
            className={cn(THEME, className)}
            data-count={activity.count}
            data-date={activity.date}
            data-level={activity.level}
            height={blockSize}
            rx={blockRadius}
            ry={blockRadius}
            width={blockSize}
            x={(blockSize + blockMargin) * weekIndex}
            y={labelHeight + (blockSize + blockMargin) * dayIndex}
            {...props}
          />
        )
      }

      export type ContributionGraphCalendarProps = Omit<
        HTMLAttributes<HTMLDivElement>,
        "children"
      > & {
        hideMonthLabels?: boolean
        className?: string
        children: (props: {
          activity: Activity
          dayIndex: number
          weekIndex: number
        }) => ReactNode
      }

      export const ContributionGraphCalendar = ({
        title = "Contribution Graph",
        hideMonthLabels = false,
        className,
        children,
        ...props
      }: ContributionGraphCalendarProps) => {
        const { weeks, width, height, blockSize, blockMargin, labels } =
          useContributionGraph()

        const monthLabels = useMemo(
          () => getMonthLabels(weeks, labels.months),
          [weeks, labels.months]
        )

        return (
          <div
            className={cn(
              "no-scrollbar max-w-full scroll-fade-x overflow-x-auto overflow-y-hidden",
              className
            )}
            {...props}
          >
            <svg
              className="block overflow-visible"
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              width={width}
            >
              <title>{title}</title>
              {!hideMonthLabels && (
                <g
                  data-slot="month-labels"
                  className="fill-current selection:fill-selection-foreground"
                >
                  {monthLabels.map(({ label, weekIndex }) => (
                    <text
                      dominantBaseline="hanging"
                      key={weekIndex}
                      x={(blockSize + blockMargin) * weekIndex}
                    >
                      {label}
                    </text>
                  ))}
                </g>
              )}
              {weeks.map((week, weekIndex) =>
                week.map((activity, dayIndex) => {
                  if (!activity) {
                    return null
                  }

                  return (
                    <Fragment key={`${weekIndex}-${dayIndex}`}>
                      {children({ activity, dayIndex, weekIndex })}
                    </Fragment>
                  )
                })
              )}
            </svg>
          </div>
        )
      }

      export type ContributionGraphFooterProps = HTMLAttributes<HTMLDivElement>

      export const ContributionGraphFooter = ({
        className,
        ...props
      }: ContributionGraphFooterProps) => (
        <div
          className={cn(
            "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
            className
          )}
          {...props}
        />
      )

      export type ContributionGraphTotalCountProps = Omit<
        HTMLAttributes<HTMLDivElement>,
        "children"
      > & {
        children?: (props: { totalCount: number; year: number }) => ReactNode
      }

      export const ContributionGraphTotalCount = ({
        className,
        children,
        ...props
      }: ContributionGraphTotalCountProps) => {
        const { totalCount, year, labels } = useContributionGraph()

        if (children) {
          return <>{children({ totalCount, year })}</>
        }

        return (
          <div className={cn("text-muted-foreground", className)} {...props}>
            {labels.totalCount
              ? labels.totalCount
                  .replace("{{count}}", String(totalCount))
                  .replace("{{year}}", String(year))
              : `${totalCount} activities in ${year}`}
          </div>
        )
      }

      export type ContributionGraphLegendProps = Omit<
        HTMLAttributes<HTMLDivElement>,
        "children"
      > & {
        children?: (props: { level: number }) => ReactNode
      }

      export const ContributionGraphLegend = ({
        className,
        children,
        ...props
      }: ContributionGraphLegendProps) => {
        const { labels, maxLevel, blockSize, blockRadius, blockMargin } =
          useContributionGraph()

        return (
          <div
            className={cn("ml-auto flex items-center", className)}
            style={{ gap: blockMargin }}
            {...props}
          >
            <span className="mr-1 text-muted-foreground">
              {labels.legend?.less || "Less"}
            </span>

            {new Array(maxLevel + 1).fill(undefined).map((_, level) =>
              children ? (
                <Fragment key={level}>{children({ level })}</Fragment>
              ) : (
                <svg height={blockSize} key={level} width={blockSize}>
                  <title>{`${level} contributions`}</title>
                  <rect
                    className={cn(THEME)}
                    data-level={level}
                    height={blockSize}
                    rx={blockRadius}
                    ry={blockRadius}
                    width={blockSize}
                  />
                </svg>
              )
            )}

            <span className="ml-1 text-muted-foreground">
              {labels.legend?.more || "More"}
            </span>
          </div>
        )
      }

      ```

      ```tsx title="components/github-contributions.tsx" 
      "use client"

      import { use } from "react"
      import { format } from "date-fns"

      import { cn } from "@/lib/utils"
      import { Spinner } from "@/components/ui/spinner"
      import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
      } from "@/components/ui/tooltip"
      import type { Activity } from "@/components/contribution-graph"
      import {
        ContributionGraph,
        ContributionGraphBlock,
        ContributionGraphCalendar,
        ContributionGraphFooter,
        ContributionGraphLegend,
        ContributionGraphTotalCount,
      } from "@/components/contribution-graph"

      export function GitHubContributions({
        contributions,
        githubProfileUrl,
        className,
      }: {
        contributions: Promise<Activity[]>
        githubProfileUrl: string
        className?: string
      }) {
        const data = use(contributions)

        return (
          <ContributionGraph
            className={cn("mx-auto py-2", className)}
            data={data}
            blockSize={11}
            blockMargin={3}
            blockRadius={2}
          >
            <ContributionGraphCalendar
              className="no-scrollbar px-2"
              title="GitHub Contributions"
            >
              {({ activity, dayIndex, weekIndex }) => (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <g>
                        <ContributionGraphBlock
                          activity={activity}
                          dayIndex={dayIndex}
                          weekIndex={weekIndex}
                        />
                      </g>
                    }
                  />
                  <TooltipContent className="font-sans">
                    <p>
                      {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                      on {format(new Date(activity.date), "dd.MM.yyyy")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </ContributionGraphCalendar>

            <ContributionGraphFooter className="px-2">
              <ContributionGraphTotalCount>
                {({ totalCount, year }) => (
                  <div className="text-muted-foreground">
                    {totalCount.toLocaleString("en")} contributions in {year} on{" "}
                    <a
                      className="text-foreground link-underline"
                      href={githubProfileUrl}
                      target="_blank"
                      rel="noopener"
                    >
                      GitHub
                    </a>
                    .
                  </div>
                )}
              </ContributionGraphTotalCount>

              <ContributionGraphLegend />
            </ContributionGraphFooter>
          </ContributionGraph>
        )
      }

      export function GitHubContributionsFallback() {
        return (
          <div className="flex h-40.5 w-full items-center justify-center">
            <Spinner className="text-muted-foreground" />
          </div>
        )
      }

      ```

      ```ts title="lib/get-cached-contributions.ts" 
      import { unstable_cache } from "next/cache"

      import type { Activity } from "@/components/contribution-graph"

      type GitHubContributionsResponse = {
        contributions: Activity[]
      }

      export const getCachedContributions = unstable_cache(
        async (username: string) => {
          const apiUrl = process.env.NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL
          if (!apiUrl) {
            throw new Error("NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL is not set")
          }

          const res = await fetch(`${apiUrl}/${username}?y=last`)
          if (!res.ok) {
            return []
          }
          const data = (await res.json()) as GitHubContributionsResponse
          return data.contributions ?? []
        },
        ["github-contributions"],
        { revalidate: 86400 } // Cache for 1 day (86400 seconds)
      )

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Setup

Set the API base URL. It is required, and the fetcher throws without it:

```bash title=".env.local"
NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de/v4
```

Data is requested from `{base URL}/{username}?y=last`

## Usage

```tsx  
import { Suspense } from "react"

import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/github-contributions"
import { getCachedContributions } from "@/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsDemo() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
      />
    </Suspense>
  )
}

```

## API reference

### GitHubContributions

<TypeTable
  id="type-table-props.ts-GitHubContributionsProps"
  type={{
  "id": "props.ts-GitHubContributionsProps",
  "name": "GitHubContributionsProps",
  "description": "",
  "entries": [
    {
      "name": "contributions",
      "description": "",
      "tags": [],
      "type": "Promise<Activity[]>",
      "simplifiedType": "object",
      "required": true,
      "deprecated": false
    },
    {
      "name": "githubProfileUrl",
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

## Examples

### GitHub default theme

```tsx
import { Suspense } from "react"

import { cn } from "@/lib/utils"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/github-contributions"
import { getCachedContributions } from "@/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsDefaultTheme() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
        className={cn(
          // GitHub Default Theme
          '**:data-[level="0"]:fill-[#eff2f5] dark:**:data-[level="0"]:fill-[#151b23]',
          '**:data-[level="1"]:fill-[#aceebb] dark:**:data-[level="1"]:fill-[#033a16]',
          '**:data-[level="2"]:fill-[#4ac26b] dark:**:data-[level="2"]:fill-[#196c2e]',
          '**:data-[level="3"]:fill-[#2da44e] dark:**:data-[level="3"]:fill-[#2ea043]',
          '**:data-[level="4"]:fill-[#116329] dark:**:data-[level="4"]:fill-[#56d364]'
        )}
      />
    </Suspense>
  )
}

```

### GitHub winter theme

```tsx
import { Suspense } from "react"

import { cn } from "@/lib/utils"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/github-contributions"
import { getCachedContributions } from "@/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsWinterTheme() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
        className={cn(
          // GitHub Winter Theme
          '**:data-[level="0"]:fill-[#eff2f5] dark:**:data-[level="0"]:fill-[#151b23]',
          '**:data-[level="1"]:fill-[#b6e3ff] dark:**:data-[level="1"]:fill-[#0c2d6b]',
          '**:data-[level="2"]:fill-[#54aeff] dark:**:data-[level="2"]:fill-[#1158c7]',
          '**:data-[level="3"]:fill-[#0969da] dark:**:data-[level="3"]:fill-[#58a6ff]',
          '**:data-[level="4"]:fill-[#0a3069] dark:**:data-[level="4"]:fill-[#cae8ff]'
        )}
      />
    </Suspense>
  )
}

```

### GitHub halloween theme

```tsx
import { Suspense } from "react"

import { cn } from "@/lib/utils"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/github-contributions"
import { getCachedContributions } from "@/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsHalloweenTheme() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
        className={cn(
          // GitHub Halloween Theme
          '**:data-[level="0"]:fill-[#eff2f5] dark:**:data-[level="0"]:fill-[#151b23]',
          '**:data-[level="1"]:fill-[#f0db3d] dark:**:data-[level="1"]:fill-[#fac68f]',
          '**:data-[level="2"]:fill-[#ffd642] dark:**:data-[level="2"]:fill-[#c46212]',
          '**:data-[level="3"]:fill-[#f68c41] dark:**:data-[level="3"]:fill-[#984b10]',
          '**:data-[level="4"]:fill-[#1f2328] dark:**:data-[level="4"]:fill-[#e3d04f]'
        )}
      />
    </Suspense>
  )
}

```

## Credits

* [Kibo UI](https://www.kibo-ui.com/components/contribution-graph)

## References

* [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api) by [Jonathan Gruber](https://jogruber.de)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on August 22, 2026