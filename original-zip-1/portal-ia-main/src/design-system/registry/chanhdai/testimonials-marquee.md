# Testimonials Marquee

Scrolling marquee to showcase user testimonials.

```tsx
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/components/testimonial"

export default function TestimonialsMarqueeDemo() {
  return (
    <div className="w-full bg-background">
      <Marquee
        data-slot="marquee"
        className="border-y border-line [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
      >
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />

        <MarqueeContent>
          {TESTIMONIALS.map((item) => (
            <MarqueeItem
              key={item.url}
              className="mx-0 h-full w-xs border-r border-line"
            >
              <a
                className="block h-full transition-[background-color] ease-out hover:bg-accent/20"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Testimonial>
                  <TestimonialQuote className="font-serif">
                    <p>{item.quote}</p>
                  </TestimonialQuote>

                  <TestimonialAuthor>
                    <TestimonialAvatar>
                      <TestimonialAvatarImg src={item.authorAvatar} />
                      <TestimonialAvatarRing />
                    </TestimonialAvatar>

                    <TestimonialAuthorName>
                      {item.authorName}
                    </TestimonialAuthorName>

                    <TestimonialAuthorTagline>
                      {item.authorTagline}
                    </TestimonialAuthorTagline>
                  </TestimonialAuthor>
                </Testimonial>
              </a>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  )
}

// Demo avatars only. Replace them with your own URLs.
const TESTIMONIALS = [
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/rauchg.webp",
    authorName: "Guillermo Rauch",
    authorTagline: "CEO at Vercel",
    url: "https://x.com/rauchg/status/1978913158514237669",
    quote:
      "awesome. Love the components, especially slide-to-unlock. Great job",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/orcdev.webp",
    authorName: "OrcDev",
    authorTagline: "Creator of 8bitcn.com",
    url: "https://x.com/orcdev/status/1980378575170859446",
    quote:
      "Seriously, this is one of the best portfolio templates I’ve ever seen.",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/iamsahaj_xyz.webp",
    authorName: "Sahaj",
    authorTagline: "Creator of tweakcn.com",
    url: "https://x.com/iamsahaj_xyz/status/1982814244501381239",
    quote:
      "remember seeing it on @mannupaaji’s review. it’s one of the best looking ones I’ve seen",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/steventey.webp",
    authorName: "Steven Tey",
    authorTagline: "Founder of Dub",
    url: "https://x.com/steventey/status/1936934909370830924",
    quote: "whoa, this is really dope – needs to get added to @shadcn UI",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/kapehe_ok.webp",
    authorName: "Kap",
    authorTagline: "Head of Developer Community at Vercel",
    url: "https://x.com/kapehe_ok/status/1948104774358106612",
    quote: "one of my favorite projects that submitted! you are crushing it!",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/initjean.webp",
    authorName: "Jean P.D. Meijer",
    authorTagline: "Design Engineer",
    url: "https://x.com/initjean/status/1948159885960438151",
    quote:
      "congrats you deserve it! react wheel picker is so smooth, its insane",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/githubprojects.webp",
    authorName: "GitHub Projects Community",
    authorTagline: "UNOFFICIAL, but followed by @github",
    url: "https://x.com/GithubProjects/status/1931034244337271044",
    quote:
      "Everything you’d want in a picker, minus the styling headaches. Awesome job!",
  },
]

```

Registry dependencies: @kibo-ui/marquee, testimonial

## Features

* Continuous scrolling marquee with fade edges.
* Single and multiple row layouts.
* Composable with the Testimonial component.

## Use cases

* Social proof band on a landing page.
* Scrolling reviews above a pricing or sign-up section.
* Wall of love with more quotes than fit on screen.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/testimonials-marquee
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install cn react-fast-marquee
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/testimonial.tsx" 
      import type { ComponentProps } from "react"

      import { cn } from "@/lib/utils"

      export function Testimonial({ className, ...props }: ComponentProps<"figure">) {
        return (
          <figure
            data-slot="testimonial"
            className={cn("flex h-full flex-col", className)}
            {...props}
          />
        )
      }

      export function TestimonialQuote({
        className,
        ...props
      }: ComponentProps<"blockquote">) {
        return (
          <blockquote
            data-slot="testimonial-quote"
            className={cn(
              "grow px-4 py-3 text-base text-pretty text-foreground",
              className
            )}
            {...props}
          />
        )
      }

      export function TestimonialAuthor({
        className,
        ...props
      }: ComponentProps<"figcaption">) {
        return (
          <figcaption
            data-slot="testimonial-author"
            className={cn(
              "grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-3.5 px-4 pt-1 pb-3",
              className
            )}
            {...props}
          />
        )
      }

      export function TestimonialAvatar({
        className,
        ...props
      }: ComponentProps<"div">) {
        return (
          <div
            data-slot="testimonial-avatar"
            className={cn("relative row-span-2 size-8 shrink-0", className)}
            {...props}
          />
        )
      }

      export function TestimonialAvatarImg({
        className,
        src,
        alt,
        ...props
      }: ComponentProps<"img">) {
        return (
          <img
            data-slot="testimonial-avatar-img"
            className={cn("size-8 rounded-full select-none", className)}
            src={src}
            alt={alt}
            {...props}
          />
        )
      }

      export function TestimonialAvatarRing({
        className,
        ...props
      }: ComponentProps<"div">) {
        return (
          <div
            data-slot="testimonial-avatar-ring"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full inset-ring-1 inset-ring-black/10 dark:inset-ring-white/15",
              className
            )}
            {...props}
          />
        )
      }

      export function TestimonialAuthorName({
        className,
        ...props
      }: ComponentProps<"div">) {
        return (
          <div
            data-slot="testimonial-author-name"
            className={cn(
              "flex items-center gap-1.5 text-sm/4.5 font-semibold text-foreground",
              className
            )}
            {...props}
          />
        )
      }

      export function TestimonialAuthorTagline({
        className,
        ...props
      }: ComponentProps<"div">) {
        return (
          <div
            data-slot="testimonial-author-tagline"
            className={cn("text-xs/4 text-balance text-muted-foreground", className)}
            {...props}
          />
        )
      }

      export function TestimonialVerifiedBadge({
        className,
        ...props
      }: ComponentProps<"span">) {
        return (
          <span
            data-slot="testimonial-verified-badge"
            className={cn(
              "flex [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
              className
            )}
            aria-hidden
            {...props}
          />
        )
      }

      ```

      ```tsx title="components/kibo-ui/marquee/index.tsx" 
      "use client"

      import type { HTMLAttributes } from "react"
      import type { MarqueeProps as FastMarqueeProps } from "react-fast-marquee"
      import FastMarquee from "react-fast-marquee"

      import { cn } from "@/lib/utils"

      export type MarqueeProps = HTMLAttributes<HTMLDivElement>

      export const Marquee = ({ className, ...props }: MarqueeProps) => (
        <div
          className={cn("relative w-full overflow-hidden", className)}
          {...props}
        />
      )

      export type MarqueeContentProps = FastMarqueeProps

      export const MarqueeContent = ({
        loop = 0,
        autoFill = true,
        pauseOnHover = true,
        ...props
      }: MarqueeContentProps) => (
        <FastMarquee
          autoFill={autoFill}
          loop={loop}
          pauseOnHover={pauseOnHover}
          {...props}
        />
      )

      export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & {
        side: "left" | "right"
      }

      export const MarqueeFade = ({
        className,
        side,
        ...props
      }: MarqueeFadeProps) => (
        <div
          data-side={side}
          className={cn(
            "pointer-events-none absolute inset-y-0 z-10 h-full w-16 from-background to-transparent",
            "data-[side=left]:left-0 data-[side=left]:bg-linear-to-r",
            "data-[side=right]:right-0 data-[side=right]:bg-linear-to-l",
            "data-[side=left]:mask-linear-[to_right,var(--background)_25%,transparent]",
            "data-[side=right]:mask-linear-[to_left,var(--background)_25%,transparent]",
            "backdrop-blur-[1px]",
            className
          )}
          {...props}
        />
      )

      export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>

      export const MarqueeItem = ({ className, ...props }: MarqueeItemProps) => (
        <div className={cn("mx-2 shrink-0 object-contain", className)} {...props} />
      )

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorInfo,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
  TestimonialVerifiedBadge,
} from "@/components/testimonial"
```

```tsx
<Marquee>
  <MarqueeFade />

  <MarqueeContent>
    <MarqueeItem>
      <Testimonial>
        <TestimonialQuote />

        <TestimonialAuthor>
          <TestimonialAvatar>
            <TestimonialAvatarImg />
            <TestimonialAvatarRing />
          </TestimonialAvatar>

          <TestimonialAuthorName>
            <TestimonialVerifiedBadge />
          </TestimonialAuthorName>

          <TestimonialAuthorTagline />
        </TestimonialAuthor>
      </Testimonial>
    </MarqueeItem>
  </MarqueeContent>
</Marquee>
```

## Composition

Use the following composition to build a `Testimonials Marquee`

```text
Marquee
├── MarqueeFade
└── MarqueeContent
    └── MarqueeItem
        └── Testimonial
            ├── TestimonialQuote
            └── TestimonialAuthor
                ├── TestimonialAvatar
                │   ├── TestimonialAvatarImg
                │   └── TestimonialAvatarRing
                ├── TestimonialAuthorName
                │   └── TestimonialVerifiedBadge
                └── TestimonialAuthorTagline
```

## API reference

* [Marquee](https://www.kibo-ui.com/components/marquee)
* [React FAST Marquee](https://www.react-fast-marquee.com)

## Examples

### Single row

```tsx
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/components/testimonial"

export default function TestimonialsMarqueeDemo() {
  return (
    <div className="w-full bg-background">
      <Marquee
        data-slot="marquee"
        className="border-y border-line [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
      >
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />

        <MarqueeContent>
          {TESTIMONIALS.map((item) => (
            <MarqueeItem
              key={item.url}
              className="mx-0 h-full w-xs border-r border-line"
            >
              <a
                className="block h-full transition-[background-color] ease-out hover:bg-accent/20"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Testimonial>
                  <TestimonialQuote className="font-serif">
                    <p>{item.quote}</p>
                  </TestimonialQuote>

                  <TestimonialAuthor>
                    <TestimonialAvatar>
                      <TestimonialAvatarImg src={item.authorAvatar} />
                      <TestimonialAvatarRing />
                    </TestimonialAvatar>

                    <TestimonialAuthorName>
                      {item.authorName}
                    </TestimonialAuthorName>

                    <TestimonialAuthorTagline>
                      {item.authorTagline}
                    </TestimonialAuthorTagline>
                  </TestimonialAuthor>
                </Testimonial>
              </a>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  )
}

// Demo avatars only. Replace them with your own URLs.
const TESTIMONIALS = [
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/rauchg.webp",
    authorName: "Guillermo Rauch",
    authorTagline: "CEO at Vercel",
    url: "https://x.com/rauchg/status/1978913158514237669",
    quote:
      "awesome. Love the components, especially slide-to-unlock. Great job",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/orcdev.webp",
    authorName: "OrcDev",
    authorTagline: "Creator of 8bitcn.com",
    url: "https://x.com/orcdev/status/1980378575170859446",
    quote:
      "Seriously, this is one of the best portfolio templates I’ve ever seen.",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/iamsahaj_xyz.webp",
    authorName: "Sahaj",
    authorTagline: "Creator of tweakcn.com",
    url: "https://x.com/iamsahaj_xyz/status/1982814244501381239",
    quote:
      "remember seeing it on @mannupaaji’s review. it’s one of the best looking ones I’ve seen",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/steventey.webp",
    authorName: "Steven Tey",
    authorTagline: "Founder of Dub",
    url: "https://x.com/steventey/status/1936934909370830924",
    quote: "whoa, this is really dope – needs to get added to @shadcn UI",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/kapehe_ok.webp",
    authorName: "Kap",
    authorTagline: "Head of Developer Community at Vercel",
    url: "https://x.com/kapehe_ok/status/1948104774358106612",
    quote: "one of my favorite projects that submitted! you are crushing it!",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/initjean.webp",
    authorName: "Jean P.D. Meijer",
    authorTagline: "Design Engineer",
    url: "https://x.com/initjean/status/1948159885960438151",
    quote:
      "congrats you deserve it! react wheel picker is so smooth, its insane",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/githubprojects.webp",
    authorName: "GitHub Projects Community",
    authorTagline: "UNOFFICIAL, but followed by @github",
    url: "https://x.com/GithubProjects/status/1931034244337271044",
    quote:
      "Everything you’d want in a picker, minus the styling headaches. Awesome job!",
  },
]

```

### Multiple rows

```tsx
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/components/testimonial"

export default function TestimonialsMarqueeDemo2() {
  return (
    <div className="w-full space-y-4 bg-background [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!">
      {[TESTIMONIALS_1, TESTIMONIALS_2].map((list, index) => (
        <Marquee key={index} className="border-y border-line">
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />

          <MarqueeContent direction={index % 2 === 1 ? "right" : "left"}>
            {list.map((item) => (
              <MarqueeItem
                key={item.url}
                className="mx-0 h-full w-xs border-r border-line"
              >
                <a
                  className="block h-full transition-[background-color] ease-out hover:bg-accent/20"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Testimonial>
                    <TestimonialQuote className="font-serif">
                      <p>{item.quote}</p>
                    </TestimonialQuote>

                    <TestimonialAuthor>
                      <TestimonialAvatar>
                        <TestimonialAvatarImg src={item.authorAvatar} />
                        <TestimonialAvatarRing />
                      </TestimonialAvatar>

                      <TestimonialAuthorName>
                        {item.authorName}
                      </TestimonialAuthorName>

                      <TestimonialAuthorTagline>
                        {item.authorTagline}
                      </TestimonialAuthorTagline>
                    </TestimonialAuthor>
                  </Testimonial>
                </a>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      ))}
    </div>
  )
}

// Demo avatars only. Replace them with your own URLs.
const TESTIMONIALS_1 = [
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/rauchg.webp",
    authorName: "Guillermo Rauch",
    authorTagline: "CEO at Vercel",
    url: "https://x.com/rauchg/status/1978913158514237669",
    quote:
      "awesome. Love the components, especially slide-to-unlock. Great job",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/orcdev.webp",
    authorName: "OrcDev",
    authorTagline: "Creator of 8bitcn.com",
    url: "https://x.com/orcdev/status/1980378575170859446",
    quote:
      "Seriously, this is one of the best portfolio templates I’ve ever seen.",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/iamsahaj_xyz.webp",
    authorName: "Sahaj",
    authorTagline: "Creator of tweakcn.com",
    url: "https://x.com/iamsahaj_xyz/status/1982814244501381239",
    quote:
      "remember seeing it on @mannupaaji’s review. it’s one of the best looking ones I’ve seen",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/steventey.webp",
    authorName: "Steven Tey",
    authorTagline: "Founder of Dub",
    url: "https://x.com/steventey/status/1936934909370830924",
    quote: "whoa, this is really dope – needs to get added to @shadcn UI",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/kapehe_ok.webp",
    authorName: "Kap",
    authorTagline: "Head of Developer Community at Vercel",
    url: "https://x.com/kapehe_ok/status/1948104774358106612",
    quote: "one of my favorite projects that submitted! you are crushing it!",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/initjean.webp",
    authorName: "Jean P.D. Meijer",
    authorTagline: "Design Engineer",
    url: "https://x.com/initjean/status/1948159885960438151",
    quote:
      "congrats you deserve it! react wheel picker is so smooth, its insane",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/githubprojects.webp",
    authorName: "GitHub Projects Community",
    authorTagline: "UNOFFICIAL, but followed by @github",
    url: "https://x.com/GithubProjects/status/1931034244337271044",
    quote:
      "Everything you’d want in a picker, minus the styling headaches. Awesome job!",
  },
]

const TESTIMONIALS_2 = [
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/mannupaaji.webp",
    authorName: "Manu Arora",
    authorTagline: "Creator of ui.aceternity.com",
    url: "https://x.com/mannupaaji/status/1944755561117163597",
    quote: "Great work on the portfolio",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/maxprilutskiy.webp",
    authorName: "Max Prilutskiy",
    authorTagline: "CEO at Lingo.dev",
    url: "https://x.com/MaxPrilutskiy/status/1923952193893466379",
    quote: "i like your style! :)",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/aaronmahlke.webp",
    authorName: "Aaron",
    authorTagline: "Founding Design Engineer at Mail0",
    url: "https://x.com/aaronmahlke/status/1955606729657344490",
    quote: "super cool portfolio!",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/jordwalke.webp",
    authorName: "jordwalke",
    authorTagline: "Creator of React",
    url: "https://x.com/jordwalke/status/1937165909778657589",
    quote: "Looks great",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/yonathandejene.webp",
    authorName: "Yonaries",
    authorTagline: "Making orabrowser.com",
    url: "https://x.com/YonathanDejene/status/1984529637309886639",
    quote: "incredible portfolio i’ve seen by far",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/zaidmukaddam.webp",
    authorName: "Zaid",
    authorTagline: "Creator of scira.ai",
    url: "https://x.com/zaidmukaddam/status/1984599685974409374",
    quote: "super clean",
  },
]

```

## Credits

* [Kibo UI](https://www.kibo-ui.com/components/marquee)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on March 27, 2025