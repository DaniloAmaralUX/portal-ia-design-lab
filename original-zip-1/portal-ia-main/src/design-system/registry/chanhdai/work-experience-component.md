# Work Experience

Display work experiences with role details, company logos, and durations.

```tsx
import { CodeXmlIcon, LightbulbIcon } from "lucide-react"

import type { ExperienceItemType } from "@/components/work-experience"
import { WorkExperience } from "@/components/work-experience"

export default function WorkExperienceDemo() {
  return <WorkExperience className="w-full" experiences={WORK_EXPERIENCE} />
}

const WORK_EXPERIENCE: ExperienceItemType[] = [
  {
    id: "quaric",
    companyName: "Quaric",
    companyLogo: "https://assets.chanhdai.com/images/companies/quaric.svg",
    companyWebsite: "https://quaric.com",
    positions: [
      {
        id: "2",
        title: "Design Engineer",
        employmentPeriod: {
          start: "03.2024",
        },
        employmentType: "Part-time",
        icon: <CodeXmlIcon />,
        description: `- Integrated VNPAY-QR for secure transactions.
- Registered the e-commerce site with [online.gov.vn](https://online.gov.vn) for compliance.
- Developed online ordering to streamline purchases.
- Build and maintain ZaDark.com with Docusaurus, integrating AdSense.
- Develop and maintain the ZaDark extension for Zalo Web on Chrome, Safari, Edge, and Firefox — with 15,000+ active users via Chrome Web Store.`,
        skills: [
          "Next.js",
          "Strapi",
          "Auth0",
          "VNPAY-QR",
          "Docker",
          "NGINX",
          "Google Cloud",
          "Docusaurus",
          "Extension",
          "Research",
          "Project Management",
        ],
        isExpanded: true,
      },
      {
        id: "1",
        title: "Founder",
        employmentPeriod: {
          start: "03.2024",
        },
        employmentType: "Part-time",
        icon: <LightbulbIcon />,
        skills: ["Business Ownership", "Business Law", "Business Tax"],
      },
    ],
    isCurrentEmployer: true,
  },
]

```

Dependencies: react-markdown, date-fns, lucide-react, motion, @tailwindcss/typography

Registry dependencies: collapsible, separator, chevrons-up-down-icon, typography

## Features

* Supports multiple positions per company.
* Markdown rendering for position descriptions.
* Company logos and duration display.

## Use cases

* Experience section on a portfolio or resume site.
* Founder or team member bio page.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/work-experience
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install cn react-markdown lucide-react motion date-fns
      ```

      ```bash
      npm install -D @tailwindcss/typography
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Add a Tailwind CSS plugin and utility</Step>

      ```css title="globals.css"
      @import "tailwindcss";
      @plugin "@tailwindcss/typography";

      @utility link {
        @apply decoration-1 underline-offset-3 hover:underline;
      }

      @utility link-underline {
        @apply underline decoration-current/30 decoration-1 underline-offset-3 transition-colors hover:decoration-current;
      }

      @utility prose-ncdai {
        @apply prose-headings:tracking-tight prose-headings:text-balance prose-h2:font-semibold;
        @apply prose-a:font-normal prose-a:wrap-break-word prose-a:text-foreground prose-a:link-underline;
        @apply prose-code:rounded-md prose-code:border prose-code:bg-muted/50 prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none;
        @apply prose-strong:font-medium;
      }
      ```

      <Step>Install the required shadcn/ui components</Step>

      * [Collapsible](https://ui.shadcn.com/docs/components/base/collapsible)
      * [Separator](https://ui.shadcn.com/docs/components/base/separator)

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/chevrons-up-down-icon.tsx" 
      "use client"

      import { useImperativeHandle } from "react"
      import { motion, useAnimation } from "motion/react"

      export type ChevronsUpDownIconHandle = {
        startAnimation: () => void
        stopAnimation: () => void
      }

      export type ChevronsUpDownIconProps = React.ComponentPropsWithoutRef<"svg"> & {
        ref?: React.Ref<ChevronsUpDownIconHandle>
        duration?: number
      }

      export function ChevronsUpDownIcon({
        ref,
        duration = 0.3,
        ...props
      }: ChevronsUpDownIconProps) {
        const controls = useAnimation()

        useImperativeHandle(ref, () => {
          return {
            startAnimation: () => controls.start("animate"),
            stopAnimation: () => controls.start("normal"),
          }
        })

        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
          >
            <motion.path
              d="M7 15L12 20L17 15"
              variants={{
                normal: {
                  d: "M7 15L12 20L17 15",
                },
                animate: {
                  d: "M7 20L12 15L17 20",
                },
              }}
              initial="normal"
              animate={controls}
              transition={{
                duration,
              }}
            />
            <motion.path
              d="M7 9L12 4L17 9"
              variants={{
                normal: {
                  d: "M7 9L12 4L17 9",
                },
                animate: {
                  d: "M7 4L12 9L17 4",
                },
              }}
              initial="normal"
              animate={controls}
              transition={{
                duration,
              }}
            />
          </svg>
        )
      }

      ```

      ```tsx title="components/work-experience.tsx" 
      "use client"

      import { useCallback, useRef, type ComponentProps } from "react"
      import { differenceInMonths, parse } from "date-fns"
      import { BriefcaseBusinessIcon, InfinityIcon } from "lucide-react"
      import ReactMarkdown from "react-markdown"

      import { cn } from "@/lib/utils"
      import {
        Collapsible,
        CollapsibleContent,
        CollapsibleTrigger,
      } from "@/components/ui/collapsible"
      import { Separator } from "@/components/ui/separator"
      import type { ChevronsUpDownIconHandle } from "@/components/chevrons-up-down-icon"
      import { ChevronsUpDownIcon } from "@/components/chevrons-up-down-icon"

      export type ExperiencePositionItemType = {
        /** Unique identifier for the position */
        id: string
        /** The job title or position name */
        title: string
        /**
         * Employment period of the position.
         * Use "MM.YYYY" or "YYYY" format. Omit `end` for current roles.
         */
        employmentPeriod: {
          /** Start date (e.g., "10.2022" or "2020"). */
          start: string
          /** End date; leave undefined for "Present". */
          end?: string
        }
        /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
        employmentType?: string
        /** A brief description of the position or responsibilities */
        description?: string
        /** An icon representing the position */
        icon?: React.ReactElement
        /** A list of skills associated with the position */
        skills?: string[]
        /** Indicates if the position details are expanded in the UI */
        isExpanded?: boolean
      }

      export type ExperienceItemType = {
        /** Unique identifier for the experience item */
        id: string
        /** Name of the company where the experience was gained */
        companyName: string
        /** URL or path to the company's logo image */
        companyLogo?: string
        /** URL to the company's website. */
        companyWebsite?: string
        /**
         * List of positions held at the company
         * @fumadocsHref #experiencepositionitemtype
         * */
        positions: ExperiencePositionItemType[]
        /** Indicates if this is the user's current employer */
        isCurrentEmployer?: boolean
      }

      export type WorkExperienceProps = {
        className?: string
        /** @fumadocsHref #experienceitemtype */
        experiences: ExperienceItemType[]
      }

      export function WorkExperience({
        className,
        experiences,
      }: WorkExperienceProps) {
        return (
          <div className={cn("bg-background px-4 text-foreground", className)}>
            {experiences.map((experience) => (
              <ExperienceItem key={experience.id} experience={experience} />
            ))}
          </div>
        )
      }

      export type ExperienceItemProps = {
        experience: ExperienceItemType
      }

      export function ExperienceItem({ experience }: ExperienceItemProps) {
        return (
          <div className="space-y-4 py-4">
            <div className="not-prose flex items-center gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center">
                {experience.companyLogo ? (
                  <img
                    src={experience.companyLogo}
                    alt={experience.companyName}
                    className="size-6 rounded-full"
                    aria-hidden
                  />
                ) : (
                  <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                )}
              </div>

              <h3 className="text-lg/snug font-semibold">
                {experience.companyWebsite ? (
                  <a
                    className="link"
                    href={experience.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {experience.companyName}
                  </a>
                ) : (
                  experience.companyName
                )}
              </h3>

              {experience.isCurrentEmployer && (
                <span
                  className="relative flex items-center justify-center"
                  aria-label="Current Employer"
                >
                  <span className="absolute inline-flex size-3 animate-ping rounded-full bg-sky-500 opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
                </span>
              )}
            </div>

            <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
              {experience.positions.map((position) => (
                <ExperiencePositionItem key={position.id} position={position} />
              ))}
            </div>
          </div>
        )
      }

      export type ExperiencePositionItemProps = {
        position: ExperiencePositionItemType
      }

      export function ExperiencePositionItem({
        position,
      }: ExperiencePositionItemProps) {
        const chevronsUpDownIconRef = useRef<ChevronsUpDownIconHandle>(null)

        const handleOpenChange = useCallback((open: boolean) => {
          const controls = chevronsUpDownIconRef.current
          if (!controls) return

          if (open) {
            controls.startAnimation()
          } else {
            controls.stopAnimation()
          }
        }, [])

        const { start, end } = position.employmentPeriod
        const isOngoing = !end
        const duration = formatDuration(start, end)

        return (
          <Collapsible
            className="relative last:before:absolute last:before:h-full last:before:w-4 last:before:bg-background"
            defaultOpen={position.isExpanded}
            onOpenChange={handleOpenChange}
            disabled={!position.description}
          >
            <CollapsibleTrigger
              className={cn(
                "group/experience-position not-prose block w-full text-left select-none",
                "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg hover:before:bg-muted/30",
                "data-disabled:before:content-none"
              )}
            >
              <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-lg",
                    "bg-muted text-muted-foreground",
                    "border border-muted-foreground/15 ring-1 ring-line ring-offset-1 ring-offset-background",
                    "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  )}
                >
                  {position.icon ?? <BriefcaseBusinessIcon />}
                </div>

                <h4 className="flex-1 font-medium text-balance text-foreground">
                  {position.title}
                </h4>

                <div className="shrink-0 text-muted-foreground group-data-disabled/experience-position:hidden [&_svg]:h-lh [&_svg]:w-4">
                  <ChevronsUpDownIcon ref={chevronsUpDownIconRef} duration={0.15} />
                </div>
              </div>

              {/* Separators are aria-hidden: a dl may only expose dt/dd groups, and these dividers are decorative. */}
              <dl className="relative z-1 flex items-center gap-2 pl-9 text-sm text-muted-foreground">
                {position.employmentType && (
                  <>
                    <div>
                      <dt className="sr-only">Employment Type</dt>
                      <dd>{position.employmentType}</dd>
                    </div>

                    <Separator
                      className="data-vertical:h-4 data-vertical:self-center"
                      orientation="vertical"
                      aria-hidden
                    />
                  </>
                )}

                <div>
                  <dt className="sr-only">Employment Period</dt>
                  <dd className="flex items-center gap-0.5 tabular-nums">
                    <span>{start}</span>
                    <span className="font-mono">—</span>
                    {isOngoing ? (
                      <InfinityIcon
                        className="size-4.5 translate-y-[0.5px]"
                        aria-label="Present"
                      />
                    ) : (
                      <span>{end}</span>
                    )}
                  </dd>
                </div>

                {duration && (
                  <>
                    <Separator
                      className="data-vertical:h-4 data-vertical:self-center"
                      orientation="vertical"
                      aria-hidden
                    />
                    <div>
                      <dt className="sr-only">Duration</dt>
                      <dd className="tabular-nums">{duration}</dd>
                    </div>
                  </>
                )}
              </dl>
            </CollapsibleTrigger>

            <CollapsibleContent className="overflow-hidden">
              {position.description && (
                <Prose className="pt-2 pl-9">
                  <ReactMarkdown>{position.description}</ReactMarkdown>
                </Prose>
              )}
            </CollapsibleContent>

            {Array.isArray(position.skills) && position.skills.length > 0 && (
              <ul className="not-prose flex flex-wrap gap-1.5 pt-3 pl-9">
                {position.skills.map((skill, index) => (
                  <li key={index} className="flex">
                    <Skill>{skill}</Skill>
                  </li>
                ))}
              </ul>
            )}
          </Collapsible>
        )
      }

      function Prose({ className, ...props }: ComponentProps<"div">) {
        return (
          <div
            className={cn(
              "prose max-w-none prose-ncdai prose-zinc dark:prose-invert",
              className
            )}
            {...props}
          />
        )
      }

      function Skill({ className, ...props }: ComponentProps<"span">) {
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-md border bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground",
              className
            )}
            {...props}
          />
        )
      }

      function formatDuration(start: string, end?: string): string {
        const startHasMonth = start.includes(".")
        const endHasMonth = end ? end.includes(".") : true

        // Both year-only: granularity is years, no month arithmetic needed.
        if (!startHasMonth && end && !endHasMonth) {
          const years = parseInt(end, 10) - parseInt(start, 10)
          if (years <= 0) {
            return ""
          }
          return `${years}y`
        }

        const startDate = parsePeriodDate(start, "first")
        const endDate = end ? parsePeriodDate(end, "last") : new Date()

        // +1 to count both the start and end months inclusively.
        const totalMonths = differenceInMonths(endDate, startDate) + 1
        if (totalMonths <= 0) {
          return ""
        }

        if (totalMonths < 12) {
          return `${totalMonths}m`
        }

        const years = Math.floor(totalMonths / 12)
        const months = totalMonths % 12
        if (months === 0) {
          return `${years}y`
        }
        return `${years}y ${months}m`
      }

      function parsePeriodDate(str: string, fallbackMonth: "first" | "last"): Date {
        if (str.includes(".")) {
          return parse(str, "MM.yyyy", new Date())
        }
        return parse(
          `${fallbackMonth === "last" ? "12" : "01"}.${str}`,
          "MM.yyyy",
          new Date()
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { WorkExperience } from "@/components/work-experience"
import type { ExperienceItemType } from "@/components/work-experience"
```

```tsx
const experiences: ExperienceItemType[] = []

<WorkExperience experiences={experiences} />
```

## API reference

### WorkExperience

<TypeTable
  id="type-table-work-experience.tsx-WorkExperienceProps"
  type={{
  "id": "work-experience.tsx-WorkExperienceProps",
  "name": "WorkExperienceProps",
  "description": "",
  "entries": [
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
      "name": "experiences",
      "description": "",
      "tags": [
        {
          "name": "fumadocsHref",
          "text": "#experienceitemtype"
        }
      ],
      "type": "ExperienceItemType[]",
      "simplifiedType": "array",
      "required": true,
      "deprecated": false,
      "typeHref": "#experienceitemtype"
    }
  ]
}}
/>

### ExperienceItemType

<TypeTable
  id="type-table-work-experience.tsx-ExperienceItemType"
  type={{
  "id": "work-experience.tsx-ExperienceItemType",
  "name": "ExperienceItemType",
  "description": "",
  "entries": [
    {
      "name": "id",
      "description": "Unique identifier for the experience item",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "companyName",
      "description": "Name of the company where the experience was gained",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "companyLogo",
      "description": "URL or path to the company's logo image",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "companyWebsite",
      "description": "URL to the company's website.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "positions",
      "description": "List of positions held at the company",
      "tags": [
        {
          "name": "fumadocsHref",
          "text": "#experiencepositionitemtype"
        }
      ],
      "type": "ExperiencePositionItemType[]",
      "simplifiedType": "array",
      "required": true,
      "deprecated": false,
      "typeHref": "#experiencepositionitemtype"
    },
    {
      "name": "isCurrentEmployer",
      "description": "Indicates if this is the user's current employer",
      "tags": [],
      "type": "boolean | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

### ExperiencePositionItemType

<TypeTable
  id="type-table-work-experience.tsx-ExperiencePositionItemType"
  type={{
  "id": "work-experience.tsx-ExperiencePositionItemType",
  "name": "ExperiencePositionItemType",
  "description": "",
  "entries": [
    {
      "name": "id",
      "description": "Unique identifier for the position",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "title",
      "description": "The job title or position name",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "employmentPeriod",
      "description": "Employment period of the position.\nUse \"MM.YYYY\" or \"YYYY\" format. Omit `end` for current roles.",
      "tags": [],
      "type": "{ start: string; end?: string; }",
      "simplifiedType": "object",
      "required": true,
      "deprecated": false
    },
    {
      "name": "employmentType",
      "description": "The type of employment (e.g., \"Full-time\", \"Part-time\", \"Contract\")",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "description",
      "description": "A brief description of the position or responsibilities",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "icon",
      "description": "An icon representing the position",
      "tags": [],
      "type": "React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | undefined",
      "simplifiedType": "object",
      "required": false,
      "deprecated": false
    },
    {
      "name": "skills",
      "description": "A list of skills associated with the position",
      "tags": [],
      "type": "string[] | undefined",
      "simplifiedType": "array",
      "required": false,
      "deprecated": false
    },
    {
      "name": "isExpanded",
      "description": "Indicates if the position details are expanded in the UI",
      "tags": [],
      "type": "boolean | undefined",
      "simplifiedType": "union",
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


Last updated on March 28, 2026