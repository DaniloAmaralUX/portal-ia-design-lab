# GitHub Stars

Display GitHub repo star count with formatted numbers and full-count tooltip.

```tsx
import { GitHubStars } from "@/components/github-stars"

export default function GitHubStarsDemo() {
  return <GitHubStars repo="ncdai/chanhdai.com" stargazersCount={2050} />
}

```

Registry dependencies: button, tooltip

## Features

* Displays the star count of a specified GitHub repository.
* Optical alignment for better visual balance with the GitHub icon.
* Formats large numbers for better readability (e.g., 1.2k for 1200).
* Includes a tooltip that shows the full star count on hover.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/github-stars
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the required shadcn/ui components</Step>

      * [Button](https://ui.shadcn.com/docs/components/base/button)
      * [Tooltip](https://ui.shadcn.com/docs/components/base/tooltip)

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/github-stars.tsx" 
      import { Button } from "@/components/ui/button"
      import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
      } from "@/components/ui/tooltip"

      export type GitHubStarsProps = {
        /** GitHub repository in `owner/repo` format. */
        repo: string
        /** Number of stars to display. */
        stargazersCount: number
        /**
         * Optional locales for number formatting.
         * See [MDN - Intl - locales argument](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).
         * @defaultValue "en-US"
         */
        locales?: Intl.LocalesArgument
      }

      export function GitHubStars({
        repo,
        stargazersCount,
        locales = "en-US",
      }: GitHubStarsProps) {
        return (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="gap-1.5 pr-1.5 pl-2"
                  variant="ghost"
                  nativeButton={false}
                  render={
                    <a
                      href={`https://github.com/${repo}`}
                      target="_blank"
                      rel="noopener"
                    />
                  }
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M12 0C5.37 0 0 5.372 0 11.997 0 17.3 3.438 21.795 8.205 23.38c.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.609-4.042-1.609C4.422 17.77 3.633 17.4 3.633 17.4c-1.087-.744.084-.73.084-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.417-1.304.76-1.604-2.665-.3-5.466-1.332-5.466-5.929 0-1.31.465-2.38 1.235-3.219-.135-.303-.54-1.523.105-3.175 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.006 2.04.138 3 .404 2.28-1.551 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.608-2.805 5.623-5.475 5.918.42.36.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.284 0 .315.21.69.825.57C20.565 21.79 24 17.291 24 11.997 24 5.372 18.627 0 12 0"
                      fill="currentColor"
                    />
                  </svg>

                  <span
                    className="text-[0.8125rem]/none text-muted-foreground tabular-nums"
                    style={{ textBox: "trim-end cap alphabetic" }}
                  >
                    {new Intl.NumberFormat(locales, {
                      notation: "compact",
                      compactDisplay: "short",
                    })
                      .format(stargazersCount)
                      .toLowerCase()}
                  </span>
                </Button>
              }
            />

            <TooltipContent className="tabular-nums">
              {new Intl.NumberFormat(locales).format(stargazersCount)} stars
            </TooltipContent>
          </Tooltip>
        )
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import { GithubStars } from "@/components/github-stars"
```

```tsx
<GithubStars repo="ncdai/chanhdai.com" stargazersCount={2050} />
```

## API reference

### GitHubStars

<TypeTable
  id="type-table-github-stars.tsx-GitHubStarsProps"
  type={{
  "id": "github-stars.tsx-GitHubStarsProps",
  "name": "GitHubStarsProps",
  "description": "",
  "entries": [
    {
      "name": "repo",
      "description": "GitHub repository in `owner/repo` format.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "stargazersCount",
      "description": "Number of stars to display.",
      "tags": [],
      "type": "number",
      "simplifiedType": "number",
      "required": true,
      "deprecated": false
    },
    {
      "name": "locales",
      "description": "Optional locales for number formatting.\nSee [MDN - Intl - locales argument](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).",
      "tags": [
        {
          "name": "defaultValue",
          "text": "\"en-US\""
        }
      ],
      "type": "Intl.LocalesArgument",
      "simplifiedType": "LocalesArgument",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

## Examples

### Fetching GitHub stars with server component

```tsx  
import { unstable_cache } from "next/cache"

import { SOURCE_CODE_GITHUB_REPO } from "@/config/site"
import { GitHubStars } from "@/components/github-stars"

const getStargazerCount = unstable_cache(
  async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${SOURCE_CODE_GITHUB_REPO}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
            "X-GitHub-Api-Version": "2026-03-10",
          },
        }
      )

      if (!response.ok) {
        return 0
      }

      const json = (await response.json()) as { stargazers_count?: number }
      return Number(json?.stargazers_count) || 0
    } catch {
      return 0
    }
  },
  ["github-stargazer-count"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)

export async function NavItemGitHub() {
  const stargazersCount = await getStargazerCount()

  return (
    <GitHubStars
      repo={SOURCE_CODE_GITHUB_REPO}
      stargazersCount={stargazersCount}
    />
  )
}

```

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on March 28, 2026