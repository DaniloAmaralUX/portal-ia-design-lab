# Apple Carousel

Infinite autoplay carousel with progress dots, inspired by Apple’s website.

```tsx
import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselPlayButton,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from "@/components/apple-carousel"

export default function AppleCarouselDemo() {
  return (
    <AppleCarouselRoot duration={3600}>
      <AppleCarouselContent>
        {ITEMS.map((item) => (
          // The link is the panel's first focusable element, so the panel
          // itself leaves the tab order.
          <AppleCarouselItem
            key={item.image}
            tabIndex={-1}
            className="@max-3xl:h-96"
          >
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block size-full rounded-[inherit] select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </a>
          </AppleCarouselItem>
        ))}
      </AppleCarouselContent>

      <AppleCarouselControls>
        <AppleCarouselTabList aria-label="Places in Viet Nam">
          {ITEMS.map((item) => (
            <AppleCarouselTab key={item.image}>{item.title}</AppleCarouselTab>
          ))}
        </AppleCarouselTabList>
        <AppleCarouselPlayButton />
      </AppleCarouselControls>
    </AppleCarouselRoot>
  )
}

const ITEMS = [
  {
    title: "Quang Ninh",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/1.webp",
    href: "https://en.wikipedia.org/wiki/Quảng_Ninh_province",
  },
  {
    title: "An Giang",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/2.webp?v=2",
    href: "https://en.wikipedia.org/wiki/An_Giang_province",
  },
  {
    title: "Ninh Binh",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/3.webp",
    href: "https://en.wikipedia.org/wiki/Ninh_Bình_province",
  },
  {
    title: "Hue",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/4.webp",
    href: "https://en.wikipedia.org/wiki/Huế",
  },
  {
    title: "Ninh Binh",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/5.webp",
    href: "https://en.wikipedia.org/wiki/Ninh_Bình_province",
  },
  {
    title: "Ho Chi Minh City",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/6.webp",
    href: "https://en.wikipedia.org/wiki/Ho_Chi_Minh_City",
  },
  {
    title: "Da Nang",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/7.webp",
    href: "https://en.wikipedia.org/wiki/Da_Nang",
  },
]

```

Dependencies: motion

## Features

* Loops endlessly, with neighboring cards peeking in.
* Autoplays with a progress dot, and pauses on interaction or when off screen.
* Swipe, scroll, or click a dot, even mid-slide.

## Use cases

* Gallery of work or product shots.
* Featured stories on a landing page.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/apple-carousel
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install motion cn
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/apple-carousel.tsx" 
      "use client"

      import {
        Children,
        createContext,
        isValidElement,
        use,
        useEffect,
        useEffectEvent,
        useId,
        useLayoutEffect,
        useRef,
        useState,
        useSyncExternalStore,
      } from "react"
      import type { ComponentProps, KeyboardEvent, RefObject } from "react"
      import {
        animate,
        motion,
        useInView,
        useMotionValue,
        useMotionValueEvent,
      } from "motion/react"
      import type { AnimationPlaybackControls, Transition } from "motion/react"

      import { cn } from "@/lib/utils"

      // More than anyone can fling past before the wrap runs, so the loop's seam
      // never scrolls into view.
      const CLONE_COUNT = 4

      // Debounce for "scroll settled", and how long scroll events after our own
      // writes are ignored.
      const SETTLE_DELAY = 150

      // Spring visualDuration (s), longer for long jumps so they don't whip past.
      const SCROLL_BASE_DURATION = 0.5
      const SCROLL_EXTRA_CARD_DURATION = 0.1
      const SCROLL_MAX_DURATION = 0.9

      const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

      function subscribeReducedMotion(callback: () => void) {
        const mql = window.matchMedia(REDUCED_MOTION_QUERY)
        mql.addEventListener("change", callback)
        return () => mql.removeEventListener("change", callback)
      }

      function usePrefersReducedMotion() {
        return useSyncExternalStore(
          subscribeReducedMotion,
          () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
          () => false
        )
      }

      const subscribeNothing = () => () => {}

      function useIsHydrated() {
        return useSyncExternalStore(
          subscribeNothing,
          () => true,
          () => false
        )
      }

      function getSlides(viewport: HTMLElement) {
        return Array.from(viewport.firstElementChild?.children ?? []) as HTMLElement[]
      }

      function getSnapLeft(viewport: HTMLElement, slide: HTMLElement) {
        if (getComputedStyle(slide).scrollSnapAlign.startsWith("start")) {
          const padding = parseFloat(
            getComputedStyle(viewport).scrollPaddingInlineStart
          )
          return slide.offsetLeft - (padding || 0)
        }

        return slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2
      }

      function getNearestSlide(viewport: HTMLElement) {
        let nearest: HTMLElement | undefined
        let minDistance = Infinity

        for (const slide of getSlides(viewport)) {
          const distance = Math.abs(
            getSnapLeft(viewport, slide) - viewport.scrollLeft
          )
          if (distance < minDistance) {
            minDistance = distance
            nearest = slide
          }
        }

        return nearest
      }

      function getRealSlide(viewport: HTMLElement, index: number) {
        return getSlides(viewport).find(
          (slide) =>
            !slide.hasAttribute("data-clone") && slide.dataset.index === String(index)
        )
      }

      type AppleCarouselContextValue = {
        id: string
        index: number
        isPlaying: boolean
        prefersReducedMotion: boolean
        viewportRef: RefObject<HTMLDivElement | null>
        progressFillRef: RefObject<HTMLSpanElement | null>
        goTo: (index: number) => void
        play: () => void
        pause: () => void
      }

      const AppleCarouselContext = createContext<AppleCarouselContextValue | null>(
        null
      )

      function useAppleCarousel() {
        const context = use(AppleCarouselContext)
        if (!context) {
          throw new Error("AppleCarousel parts must be used within AppleCarouselRoot")
        }
        return context
      }

      type AppleCarouselItemState = {
        /** Position of the item among the items passed to `AppleCarouselContent`. */
        index: number
        /** Whether the item is the one being shown. */
        isCurrent: boolean
        /** Whether this copy is a clone rendered to keep the loop seamless. */
        isClone: boolean
      }

      const AppleCarouselItemContext = createContext<Omit<
        AppleCarouselItemState,
        "isCurrent"
      > | null>(null)

      /**
       * State of the enclosing item. Content also renders in loop clones, so check
       * `isClone` before starting media, fetching, or tracking impressions.
       */
      function useAppleCarouselItem(): AppleCarouselItemState {
        const { index: currentIndex } = useAppleCarousel()
        const item = use(AppleCarouselItemContext)
        if (!item) {
          throw new Error(
            "useAppleCarouselItem must be used inside an item of AppleCarouselContent"
          )
        }

        return { ...item, isCurrent: item.index === currentIndex }
      }

      const AppleCarouselTabContext = createContext<{
        index: number
        count: number
      } | null>(null)

      // `auto` holds back under reduced motion. Pressing play is an explicit opt-in,
      // so `playing` ignores that preference and cards jump instead of sliding.
      type Playback = "auto" | "playing" | "paused"

      type AppleCarouselRootProps = ComponentProps<"div"> & {
        /**
         * Time each card stays up during autoplay (ms).
         * @defaultValue 5000
         */
        duration?: number
      }

      function AppleCarouselRoot({
        duration = 5000,
        className,
        ...props
      }: AppleCarouselRootProps) {
        const id = useId()
        const viewportRef = useRef<HTMLDivElement>(null)
        const progressFillRef = useRef<HTMLSpanElement>(null)

        const [index, setIndex] = useState(0)
        const [playback, setPlayback] = useState<Playback>("auto")
        const isInView = useInView(viewportRef, { amount: 0.25 })
        const prefersReducedMotion = usePrefersReducedMotion()
        const isPlaying =
          isInView &&
          (playback === "playing" || (playback === "auto" && !prefersReducedMotion))

        const ignoreScrollUntilRef = useRef(0)
        const scrollAnimationRef = useRef<AnimationPlaybackControls | null>(null)
        const progressAnimationRef = useRef<Animation | null>(null)
        const scrollLeft = useMotionValue(0)

        const play = () => setPlayback("playing")
        const pause = () => setPlayback("paused")

        const isOwnScroll = () =>
          scrollAnimationRef.current !== null ||
          performance.now() < ignoreScrollUntilRef.current

        const writeScrollLeft = (value: number) => {
          const viewport = viewportRef.current
          if (!viewport) return
          ignoreScrollUntilRef.current = performance.now() + SETTLE_DELAY
          viewport.scrollLeft = value
        }

        useMotionValueEvent(scrollLeft, "change", writeScrollLeft)

        const setScrollAnimation = (controls: AnimationPlaybackControls | null) => {
          scrollAnimationRef.current = controls
          // Mandatory snapping would pull every intermediate scrollLeft back.
          viewportRef.current?.toggleAttribute("data-animating", controls !== null)
        }

        const stopScrollAnimation = () => {
          scrollAnimationRef.current?.stop()
          setScrollAnimation(null)
        }

        const syncFromScroll = () => {
          // An animation already committed its destination, so the cards it passes
          // through must not flash their dots.
          if (scrollAnimationRef.current) return
          const viewport = viewportRef.current
          const slide = viewport && getNearestSlide(viewport)
          if (slide) setIndex(Number(slide.dataset.index))
        }

        // Clone and real card look identical, so the jump is invisible.
        const wrapFromClone = () => {
          const viewport = viewportRef.current
          const slide = viewport && getNearestSlide(viewport)
          if (!viewport || !slide?.hasAttribute("data-clone")) return

          const realSlide = getRealSlide(viewport, Number(slide.dataset.index))
          if (realSlide) writeScrollLeft(getSnapLeft(viewport, realSlide))
        }

        const scrollToSlide = (slide: HTMLElement) => {
          const viewport = viewportRef.current
          if (!viewport) return

          setIndex(Number(slide.dataset.index))

          const to = getSnapLeft(viewport, slide)
          const distance = Math.abs(to - viewport.scrollLeft)

          if (prefersReducedMotion || distance < 1) {
            stopScrollAnimation()
            writeScrollLeft(to)
            wrapFromClone()
            return
          }

          // A running spring keeps its velocity when retargeted; only an idle one
          // needs to pick up where the user left the scroll position.
          if (!scrollAnimationRef.current) scrollLeft.jump(viewport.scrollLeft)

          const cardsToTravel = Math.max(distance / slide.offsetWidth, 1)
          const controls = animate(scrollLeft, to, {
            type: "spring",
            bounce: 0,
            visualDuration: Math.min(
              SCROLL_BASE_DURATION + (cardsToTravel - 1) * SCROLL_EXTRA_CARD_DURATION,
              SCROLL_MAX_DURATION
            ),
            onComplete: () => {
              if (scrollAnimationRef.current !== controls) return
              setScrollAnimation(null)
              wrapFromClone()
            },
          })
          setScrollAnimation(controls)
        }

        const goTo = (next: number) => {
          const viewport = viewportRef.current
          const slide = viewport && getRealSlide(viewport, next)
          if (slide) scrollToSlide(slide)
        }

        const goNext = () => {
          const viewport = viewportRef.current
          const next = viewport && getNearestSlide(viewport)?.nextElementSibling
          if (next instanceof HTMLElement) scrollToSlide(next)
        }

        const onViewportScroll = useEffectEvent(() => {
          if (isPlaying && !isOwnScroll()) pause()
          syncFromScroll()
        })

        const onViewportSettled = useEffectEvent(() => {
          if (!isOwnScroll()) wrapFromClone()
        })

        const onViewportInput = useEffectEvent(() => {
          stopScrollAnimation()
          pause()
        })

        useEffect(() => {
          const viewport = viewportRef.current
          if (!viewport) return

          let frame: number | null = null
          let settleTimer: ReturnType<typeof setTimeout> | undefined

          const handleScroll = () => {
            if (frame === null) {
              frame = requestAnimationFrame(() => {
                frame = null
                onViewportScroll()
              })
            }
            // `scrollend` is not available everywhere, so a debounce backs it up.
            // Whichever fires first wraps; the other finds a real card and no-ops.
            clearTimeout(settleTimer)
            settleTimer = setTimeout(onViewportSettled, SETTLE_DELAY)
          }

          const handleWheel = (event: WheelEvent) => {
            // Vertical wheels scroll the page, not the gallery.
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) onViewportInput()
          }

          viewport.addEventListener("scroll", handleScroll, { passive: true })
          viewport.addEventListener("scrollend", onViewportSettled)
          viewport.addEventListener("pointerdown", onViewportInput)
          viewport.addEventListener("wheel", handleWheel, { passive: true })

          return () => {
            viewport.removeEventListener("scroll", handleScroll)
            viewport.removeEventListener("scrollend", onViewportSettled)
            viewport.removeEventListener("pointerdown", onViewportInput)
            viewport.removeEventListener("wheel", handleWheel)
            if (frame !== null) cancelAnimationFrame(frame)
            clearTimeout(settleTimer)
          }
        }, [])

        const onProgressFinish = useEffectEvent(goNext)

        // The progress fill doubles as the autoplay clock: composited, pauses in
        // place, no per-frame JS. Without a tab list it still runs, targeting nothing.
        useEffect(() => {
          const animation = new Animation(
            new KeyframeEffect(
              progressFillRef.current,
              [{ scale: "0 1" }, { scale: "1 1" }],
              { duration, fill: "forwards" }
            )
          )
          animation.onfinish = onProgressFinish
          progressAnimationRef.current = animation

          return () => {
            animation.cancel()
            progressAnimationRef.current = null
          }
        }, [index, duration])

        useEffect(() => {
          const animation = progressAnimationRef.current
          if (!animation) return
          if (isPlaying) animation.play()
          else animation.pause()
        }, [index, duration, isPlaying])

        return (
          <AppleCarouselContext
            value={{
              id,
              index,
              isPlaying,
              prefersReducedMotion,
              viewportRef,
              progressFillRef,
              goTo,
              play,
              pause,
            }}
          >
            <div
              data-slot="apple-carousel"
              data-playing={isPlaying ? "" : undefined}
              className={cn("@container relative w-full", className)}
              {...props}
            />
          </AppleCarouselContext>
        )
      }

      function AppleCarouselContent({
        className,
        children,
        ...props
      }: ComponentProps<"div">) {
        const { index, viewportRef } = useAppleCarousel()
        const isHydrated = useIsHydrated()

        const items = Children.toArray(children).filter(isValidElement)
        const count = items.length
        // Clones wait for hydration: without them the first card already sits at
        // scrollLeft 0, so the server markup renders the right card with no script.
        const cloneCount = isHydrated && count > 1 ? Math.min(CLONE_COUNT, count) : 0

        const alignToCurrent = useEffectEvent(() => {
          const viewport = viewportRef.current
          const slide = viewport && getRealSlide(viewport, index)
          if (viewport && slide) viewport.scrollLeft = getSnapLeft(viewport, slide)
        })

        useLayoutEffect(() => {
          if (cloneCount > 0) alignToCurrent()
        }, [cloneCount])

        return (
          <div
            ref={viewportRef}
            data-slot="apple-carousel-content"
            className={cn(
              "relative no-scrollbar snap-x snap-mandatory overflow-x-auto overflow-y-hidden data-animating:snap-none",
              "[--apple-carousel-gap:--spacing(5)] [--apple-carousel-item-width:min(max(87.5cqw,var(--container-3xs)),var(--container-6xl))] [--apple-carousel-padding:max(6.25cqw,(100cqw-var(--container-6xl))/2)]",
              "@max-3xl:scroll-ps-(--apple-carousel-padding) @max-3xl:[--apple-carousel-item-width:calc(max(87.5cqw,var(--container-3xs))-var(--apple-carousel-gap))]",
              className
            )}
            {...props}
          >
            <ul
              role="list"
              data-slot="apple-carousel-list"
              className="mx-auto grid w-fit grid-flow-col gap-(--apple-carousel-gap) px-(--apple-carousel-padding)"
            >
              {items.slice(count - cloneCount).map((item, i) => (
                <AppleCarouselItemContext
                  key={`${item.key}-leading`}
                  value={{ index: count - cloneCount + i, isClone: true }}
                >
                  {item}
                </AppleCarouselItemContext>
              ))}
              {items.map((item, i) => (
                <AppleCarouselItemContext
                  key={item.key}
                  value={{ index: i, isClone: false }}
                >
                  {item}
                </AppleCarouselItemContext>
              ))}
              {items.slice(0, cloneCount).map((item, i) => (
                <AppleCarouselItemContext
                  key={`${item.key}-trailing`}
                  value={{ index: i, isClone: true }}
                >
                  {item}
                </AppleCarouselItemContext>
              ))}
            </ul>
          </div>
        )
      }

      function AppleCarouselItem({ className, ...props }: ComponentProps<"li">) {
        const { id } = useAppleCarousel()
        const { index, isCurrent, isClone } = useAppleCarouselItem()

        return (
          <li
            id={isClone ? undefined : `${id}-item-${index}`}
            role={isClone ? undefined : "tabpanel"}
            aria-labelledby={isClone ? undefined : `${id}-tab-${index}`}
            // Peeking cards stay out of reach: a click there would otherwise follow
            // a link on a card the user isn't looking at.
            inert={isClone || !isCurrent}
            tabIndex={isCurrent && !isClone ? 0 : -1}
            data-slot="apple-carousel-item"
            data-index={index}
            data-clone={isClone ? "" : undefined}
            data-current={isCurrent ? "" : undefined}
            className={cn(
              "relative h-152 w-(--apple-carousel-item-width) snap-center overflow-hidden rounded-4xl bg-muted data-clone:snap-always",
              "@max-5xl:h-140 @max-3xl:h-152 @max-3xl:snap-start",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              className
            )}
            {...props}
          />
        )
      }

      type AppleCarouselControlsProps = ComponentProps<"div"> & {
        /**
         * Size of the tab list and play button inside.
         * @defaultValue "default"
         */
        size?: "default" | "sm"
      }

      function AppleCarouselControls({
        size = "default",
        className,
        ...props
      }: AppleCarouselControlsProps) {
        return (
          <div
            data-slot="apple-carousel-controls"
            data-size={size}
            className={cn(
              "group/apple-carousel-controls flex items-center justify-center gap-3 pt-6 data-[size=sm]:gap-2 data-[size=sm]:pt-4",
              className
            )}
            {...props}
          />
        )
      }

      function AppleCarouselTabList({
        className,
        children,
        ...props
      }: ComponentProps<"div">) {
        const tabs = Children.toArray(children).filter(isValidElement)

        return (
          <div
            role="tablist"
            data-slot="apple-carousel-tab-list"
            className={cn(
              "flex h-14 items-center rounded-full bg-muted px-4 group-data-[size=sm]/apple-carousel-controls:h-11 group-data-[size=sm]/apple-carousel-controls:px-3",
              className
            )}
            {...props}
          >
            {tabs.map((tab, index) => (
              <AppleCarouselTabContext
                key={tab.key}
                value={{ index, count: tabs.length }}
              >
                {tab}
              </AppleCarouselTabContext>
            ))}
          </div>
        )
      }

      function AppleCarouselTab({
        className,
        children,
        onClick,
        onFocus,
        onKeyDown,
        ...props
      }: ComponentProps<"button">) {
        const {
          id,
          index: currentIndex,
          isPlaying,
          progressFillRef,
          goTo,
          pause,
        } = useAppleCarousel()
        const tab = use(AppleCarouselTabContext)
        if (!tab) {
          throw new Error(
            "AppleCarouselTab must be a direct child of AppleCarouselTabList"
          )
        }

        const { index, count } = tab
        const isCurrent = index === currentIndex

        const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return

          let next: number
          switch (event.key) {
            case "ArrowLeft":
              next = (index - 1 + count) % count
              break
            case "ArrowRight":
              next = (index + 1) % count
              break
            case "Home":
              next = 0
              break
            case "End":
              next = count - 1
              break
            default:
              return
          }

          event.preventDefault()
          goTo(next)
          event.currentTarget
            .closest('[role="tablist"]')
            ?.querySelectorAll<HTMLElement>('[role="tab"]')
            [next]?.focus()
        }

        return (
          <button
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-item-${index}`}
            aria-selected={isCurrent}
            tabIndex={isCurrent ? 0 : -1}
            data-slot="apple-carousel-tab"
            data-current={isCurrent ? "" : undefined}
            className={cn(
              "relative mx-2 size-2 overflow-hidden rounded-full bg-muted-foreground not-data-current:hover:bg-foreground",
              // Width morphs on screen; the hover color is a quick, small change.
              "transition-[width,background-color] duration-[400ms,150ms] ease-[cubic-bezier(0.645,0.045,0.355,1),ease]",
              "motion-reduce:transition-colors motion-reduce:duration-150 motion-reduce:ease-[ease]",
              "data-current:w-12 group-data-[size=sm]/apple-carousel-controls:data-current:w-6 @max-3xl:data-current:w-8",
              "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
              className
            )}
            onClick={(event) => {
              onClick?.(event)
              if (!event.defaultPrevented) goTo(index)
            }}
            onFocus={(event) => {
              onFocus?.(event)
              if (isPlaying && event.currentTarget.matches(":focus-visible")) pause()
            }}
            onKeyDown={handleKeyDown}
            {...props}
          >
            <span
              ref={isCurrent ? progressFillRef : undefined}
              aria-hidden
              data-slot="apple-carousel-tab-progress"
              className="absolute inset-0 origin-left scale-x-0 rounded-[inherit] bg-foreground"
            />
            <span className="sr-only">{children}</span>
          </button>
        )
      }

      // Points sit half a stroke inside the outline, so the round joins soften the
      // corners without growing the icon. Changing the width means re-insetting them.
      const ICON_STROKE_WIDTH = 2.5

      // Matching M L L L Z commands let motion morph `d`: the play triangle is split
      // at x = 13, one half per pause bar.
      const PAUSE_ICON = {
        left: "M5.5 5.5L8.5 5.5L8.5 18.5L5.5 18.5Z",
        right: "M15.5 5.5L18.5 5.5L18.5 18.5L15.5 18.5Z",
      } as const

      const PLAY_ICON = {
        left: "M7.5 5.87L13 9.08L13 14.92L7.5 18.13Z",
        right: "M13 9.08L18.01 12L18.01 12L13 14.92Z",
      } as const

      const ICON_TRANSITION: Transition = {
        type: "spring",
        visualDuration: 0.3,
        bounce: 0,
      }

      const INSTANT_TRANSITION: Transition = { duration: 0 }

      function AppleCarouselPlayButton({
        className,
        onClick,
        ...props
      }: ComponentProps<"button">) {
        const { isPlaying, prefersReducedMotion, play, pause } = useAppleCarousel()
        // The icon names the action, so a playing gallery shows pause.
        const icon = isPlaying ? PAUSE_ICON : PLAY_ICON
        const transition = prefersReducedMotion ? INSTANT_TRANSITION : ICON_TRANSITION

        return (
          <button
            type="button"
            aria-label={isPlaying ? "Pause gallery" : "Play gallery"}
            data-slot="apple-carousel-play-button"
            className={cn(
              "flex size-14 items-center justify-center rounded-full bg-muted text-foreground group-data-[size=sm]/apple-carousel-controls:size-11",
              "transition-[background-color,scale] duration-150 ease-out hover:bg-muted/80 active:scale-97 motion-reduce:active:scale-100",
              "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
              className
            )}
            onClick={(event) => {
              onClick?.(event)
              if (event.defaultPrevented) return
              if (isPlaying) pause()
              else play()
            }}
            {...props}
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={ICON_STROKE_WIDTH}
              strokeLinejoin="round"
              className="size-6 group-data-[size=sm]/apple-carousel-controls:size-5"
            >
              <motion.path
                initial={false}
                animate={{ d: icon.left }}
                transition={transition}
              />
              <motion.path
                initial={false}
                animate={{ d: icon.right }}
                transition={transition}
              />
            </svg>
          </button>
        )
      }

      export {
        AppleCarouselContent,
        AppleCarouselControls,
        AppleCarouselItem,
        AppleCarouselPlayButton,
        AppleCarouselRoot,
        AppleCarouselTab,
        AppleCarouselTabList,
        useAppleCarouselItem,
      }
      export type {
        AppleCarouselControlsProps,
        AppleCarouselItemState,
        AppleCarouselRootProps,
      }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselPlayButton,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from "@/components/apple-carousel"
```

```tsx
<AppleCarouselRoot>
  <AppleCarouselContent>
    <AppleCarouselItem />
  </AppleCarouselContent>

  <AppleCarouselControls>
    <AppleCarouselTabList aria-label="Featured">
      <AppleCarouselTab />
    </AppleCarouselTabList>
    <AppleCarouselPlayButton />
  </AppleCarouselControls>
</AppleCarouselRoot>
```

Items are empty cards for any content. Render one `AppleCarouselTab` per item, in the same order, with a label for screen readers.

## Composition

Use the following composition to build an `AppleCarousel`

```text
AppleCarouselRoot
├── AppleCarouselContent
│   └── AppleCarouselItem
└── AppleCarouselControls
    ├── AppleCarouselTabList
    │   └── AppleCarouselTab
    └── AppleCarouselPlayButton
```

## API reference

### AppleCarouselRoot

<TypeTable
  id="type-table-props.ts-AppleCarouselRootProps"
  type={{
  "id": "props.ts-AppleCarouselRootProps",
  "name": "AppleCarouselRootProps",
  "description": "",
  "entries": [
    {
      "name": "duration",
      "description": "Time each card stays up during autoplay (ms).",
      "tags": [
        {
          "name": "defaultValue",
          "text": "5000"
        }
      ],
      "type": "number | undefined",
      "simplifiedType": "number",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

### AppleCarouselControls

<TypeTable
  id="type-table-props.ts-AppleCarouselControlsProps"
  type={{
  "id": "props.ts-AppleCarouselControlsProps",
  "name": "AppleCarouselControlsProps",
  "description": "",
  "entries": [
    {
      "name": "size",
      "description": "Size of the tab list and play button inside.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "\"default\""
        }
      ],
      "type": "\"default\" | \"sm\" | undefined",
      "simplifiedType": "union",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

### useAppleCarouselItem

Reads the state of the enclosing `AppleCarouselItem`.

<TypeTable
  id="type-table-apple-carousel.tsx-AppleCarouselItemState"
  type={{
  "id": "apple-carousel.tsx-AppleCarouselItemState",
  "name": "AppleCarouselItemState",
  "description": "",
  "entries": [
    {
      "name": "index",
      "description": "Position of the item among the items passed to `AppleCarouselContent`.",
      "tags": [],
      "type": "number",
      "simplifiedType": "number",
      "required": true,
      "deprecated": false
    },
    {
      "name": "isCurrent",
      "description": "Whether the item is the one being shown.",
      "tags": [],
      "type": "boolean",
      "simplifiedType": "union",
      "required": true,
      "deprecated": false
    },
    {
      "name": "isClone",
      "description": "Whether this copy is a clone rendered to keep the loop seamless.",
      "tags": [],
      "type": "boolean",
      "simplifiedType": "union",
      "required": true,
      "deprecated": false
    }
  ]
}}
/>

<Callout>
  Item content also renders in up to two clones, so ids repeat and effects run
  per copy. Check `isClone` before playing media, fetching data, or tracking
  impressions.
</Callout>

### Data attributes

Style content by state, for example with `in-data-current:opacity-100`.

| Attribute      | Element                                 | Present when              |
| -------------- | --------------------------------------- | ------------------------- |
| `data-current` | `AppleCarouselItem`, `AppleCarouselTab` | The item or tab is shown. |
| `data-clone`   | `AppleCarouselItem`                     | The item is a clone.      |
| `data-index`   | `AppleCarouselItem`                     | Always.                   |
| `data-playing` | `AppleCarouselRoot`                     | Autoplay is running.      |

## Examples

### Caption

A caption and `Button` over each photo. `data-current` fades captions on peeking cards, and `dark` keeps text light in both themes.

```tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselPlayButton,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from "@/components/apple-carousel"

export default function AppleCarouselCaptionDemo() {
  return (
    <AppleCarouselRoot duration={3600}>
      <AppleCarouselContent>
        {ITEMS.map((item) => (
          // The caption always sits on a photo, so the card resolves the dark
          // tokens in either theme.
          <AppleCarouselItem key={item.image} className="dark @max-3xl:h-96">
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 size-full object-cover select-none"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/70 via-background/30 to-transparent"
            />
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 flex items-center gap-4 px-12 pb-10 text-xl/6 text-foreground",
                "opacity-36 transition-opacity duration-150 ease-out in-data-current:opacity-100 in-data-current:duration-400",
                "@max-5xl:gap-3 @max-5xl:px-6 @max-5xl:pb-6 @max-5xl:text-base/5",
                "@max-3xl:flex-col @max-3xl:px-6 @max-3xl:text-center"
              )}
            >
              <Button
                className="rounded-full"
                nativeButton={false}
                render={
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Learn more
              </Button>
              <p className="text-pretty text-shadow-sm">
                <span className="font-semibold after:px-2 after:opacity-50 after:content-['•'/''] @max-3xl:block @max-3xl:after:hidden">
                  {item.title}
                </span>
                {item.description}
              </p>
            </div>
          </AppleCarouselItem>
        ))}
      </AppleCarouselContent>

      <AppleCarouselControls>
        <AppleCarouselTabList aria-label="Places in Viet Nam">
          {ITEMS.map((item) => (
            <AppleCarouselTab key={item.image}>{item.title}</AppleCarouselTab>
          ))}
        </AppleCarouselTabList>
        <AppleCarouselPlayButton />
      </AppleCarouselControls>
    </AppleCarouselRoot>
  )
}

const ITEMS = [
  {
    title: "Quang Ninh",
    description: "Limestone islands rise from emerald water.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/1.webp",
    href: "https://en.wikipedia.org/wiki/Quảng_Ninh_province",
  },
  {
    title: "An Giang",
    description: "Cajuput trees arch over a quiet green waterway.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/2.webp?v=2",
    href: "https://en.wikipedia.org/wiki/An_Giang_province",
  },
  {
    title: "Ninh Binh",
    description: "A pavilion rests on still water beneath karst cliffs.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/3.webp",
    href: "https://en.wikipedia.org/wiki/Ninh_Bình_province",
  },
  {
    title: "Hue",
    description: "Tiered palace roofs against a pale sky.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/4.webp",
    href: "https://en.wikipedia.org/wiki/Huế",
  },
  {
    title: "Ninh Binh",
    description: "Temple corridors wind toward a lake among the mountains.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/5.webp",
    href: "https://en.wikipedia.org/wiki/Ninh_Bình_province",
  },
  {
    title: "Ho Chi Minh City",
    description: "The skyline glows over the river at dusk.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/6.webp",
    href: "https://en.wikipedia.org/wiki/Ho_Chi_Minh_City",
  },
  {
    title: "Da Nang",
    description: "A dragon-shaped bridge lights up the evening river.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/7.webp",
    href: "https://en.wikipedia.org/wiki/Da_Nang",
  },
]

```

## Accessibility

* Arrow keys, `Home`, and `End` move between the dots.
* With `prefers-reduced-motion`, autoplay waits until Play is pressed, and cards jump instead of sliding.

## Credits

* [Apple](https://developer.apple.com/)

## References

* [WAI-ARIA Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
* [CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap)
* [Motion animate](https://motion.dev/docs/animate)
* [inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on September 26, 2026