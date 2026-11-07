# React Wheel Picker

iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support.

```tsx
import type { WheelPickerOption } from "@/components/wheel-picker"
import {
  WheelPicker,
  WheelPickerWrapper,
} from "@/components/wheel-picker"

export default function WheelPickerDemo() {
  return (
    <div className="w-56">
      <WheelPickerWrapper>
        <WheelPicker options={hourOptions} defaultValue={9} infinite />
        <WheelPicker options={minuteOptions} defaultValue={41} infinite />
        <WheelPicker options={meridiemOptions} defaultValue="AM" />
      </WheelPickerWrapper>
    </div>
  )
}

const createArray = (length: number, add = 0): WheelPickerOption<number>[] =>
  Array.from({ length }, (_, i) => {
    const value = i + add
    return {
      label: value.toString().padStart(2, "0"),
      value: value,
    }
  })

const hourOptions = createArray(12, 1)
const minuteOptions = createArray(60)
const meridiemOptions: WheelPickerOption[] = [
  { label: "AM", value: "AM" },
  { label: "PM", value: "PM" },
]

```

<DocPullQuote authorName="shadcn" authorTagline="Creator of shadcn/ui" url="https://x.com/shadcn/status/2057717991387869600" quote="See @iamncdai Wheel Picker. It’s on the registry. Quick install." />

Dependencies: @ncdai/react-wheel-picker

## Features

Built on top of [React Wheel Picker](https://react-wheel-picker.chanhdai.com) – Backed by ▲ Vercel OSS Program.

* Natural touch scrolling with smooth inertia, mouse drag and scroll for desktop.
* Infinite loop scrolling.
* Unstyled core for complete style customization.

## Installation

<CodeTabs>
  <TabsListInstallType />

  <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @ncdai/wheel-picker
    ```
  </TabsContent>

  <TabsContent value="manual">
    <Steps>
      <Step>Install the following dependencies</Step>

      ```bash
      npm install @ncdai/react-wheel-picker cn
      ```

      <Step>Add a cn helper</Step>

      ```ts title="lib/utils.ts" 
      export { cn } from "cn"

      ```

      <Step>Copy and paste the following code into your project</Step>

      ```tsx title="components/wheel-picker.tsx" 
      import "@ncdai/react-wheel-picker/style.css"

      import type { ComponentProps } from "react"
      import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker"

      import { cn } from "@/lib/utils"

      type WheelPickerValue = WheelPickerPrimitive.WheelPickerValue

      type WheelPickerOption<T extends WheelPickerValue = string> =
        WheelPickerPrimitive.WheelPickerOption<T>

      type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames

      function WheelPickerWrapper({
        className,
        ...props
      }: ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) {
        return (
          <WheelPickerPrimitive.WheelPickerWrapper
            className={cn(
              "w-56 rounded-lg border border-zinc-200 bg-white px-1 shadow-xs dark:border-zinc-700/80 dark:bg-zinc-900",
              "*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md",
              "*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md",
              className
            )}
            {...props}
          />
        )
      }

      function WheelPicker<T extends WheelPickerValue = string>({
        classNames,
        ...props
      }: WheelPickerPrimitive.WheelPickerProps<T>) {
        return (
          <WheelPickerPrimitive.WheelPicker
            classNames={{
              optionItem: cn(
                "text-zinc-400 dark:text-zinc-500 data-disabled:opacity-40",
                classNames?.optionItem
              ),
              highlightWrapper: cn(
                "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50",
                "data-rwp-focused:inset-ring-2 data-rwp-focused:inset-ring-zinc-300 dark:data-rwp-focused:inset-ring-zinc-600",
                classNames?.highlightWrapper
              ),
              highlightItem: cn(
                "data-disabled:opacity-40",
                classNames?.highlightItem
              ),
            }}
            {...props}
          />
        )
      }

      export { WheelPicker, WheelPickerWrapper }
      export type { WheelPickerClassNames, WheelPickerOption }

      ```

      <Step>Update the import paths to match your project setup</Step>
    </Steps>
  </TabsContent>
</CodeTabs>

## Usage

```tsx
import {
  WheelPicker,
  WheelPickerWrapper,
  type WheelPickerOption,
} from "@/components/wheel-picker"
```

```tsx
const options: WheelPickerOption[] = [
  {
    label: "React",
    value: "react",
  },
  {
    label: "Vue",
    value: "vue",
  },
  {
    label: "Angular",
    value: "angular",
    disabled: true,
  },
  {
    label: "Svelte",
    value: "svelte",
  },
]

export function WheelPickerDemo() {
  const [value, setValue] = useState("react")

  return (
    <WheelPickerWrapper>
      <WheelPicker options={options} value={value} onValueChange={setValue} />
    </WheelPickerWrapper>
  )
}
```

See the [React Wheel Picker](https://react-wheel-picker.chanhdai.com/docs/getting-started) documentation for more information.

## Composition

Use the following composition to build a `WheelPicker`

```text
WheelPickerWrapper
└── WheelPicker
```

## Examples

### Multiple pickers, infinite loop

```tsx
import type { WheelPickerOption } from "@/components/wheel-picker"
import {
  WheelPicker,
  WheelPickerWrapper,
} from "@/components/wheel-picker"

export default function WheelPickerDemo() {
  return (
    <div className="w-56">
      <WheelPickerWrapper>
        <WheelPicker options={hourOptions} defaultValue={9} infinite />
        <WheelPicker options={minuteOptions} defaultValue={41} infinite />
        <WheelPicker options={meridiemOptions} defaultValue="AM" />
      </WheelPickerWrapper>
    </div>
  )
}

const createArray = (length: number, add = 0): WheelPickerOption<number>[] =>
  Array.from({ length }, (_, i) => {
    const value = i + add
    return {
      label: value.toString().padStart(2, "0"),
      value: value,
    }
  })

const hourOptions = createArray(12, 1)
const minuteOptions = createArray(60)
const meridiemOptions: WheelPickerOption[] = [
  { label: "AM", value: "AM" },
  { label: "PM", value: "PM" },
]

```

### React Hook Form

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import type { WheelPickerOption } from "@/components/wheel-picker"
import {
  WheelPicker,
  WheelPickerWrapper,
} from "@/components/wheel-picker"

const formSchema = z.object({
  framework: z.string(),
})

type FormSchema = z.infer<typeof formSchema>

export default function WheelPickerFormDemo() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: "nextjs",
    },
  })

  const onSubmit: SubmitHandler<FormSchema> = (values) => {
    toast.add({
      title: "You submitted the following values:",
      // Toast descriptions render a <p>, so the block uses <code> instead of <pre>.
      description: (
        <code className="mt-2 block w-full rounded-md border p-4 whitespace-pre">
          {JSON.stringify(values, null, 2)}
        </code>
      ),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-56 max-w-full">
      <FieldGroup>
        <Controller
          control={control}
          name="framework"
          render={({ field }) => (
            <Field data-invalid={!!errors.framework}>
              <FieldLabel>Framework</FieldLabel>

              <WheelPickerWrapper>
                <WheelPicker
                  options={options}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </WheelPickerWrapper>

              {errors.framework && (
                <FieldError>{errors.framework.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Field>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

const options: WheelPickerOption[] = [
  {
    label: "Vite",
    value: "vite",
  },
  {
    label: "Laravel",
    value: "laravel",
    disabled: true,
  },
  {
    label: "React Router",
    value: "react-router",
  },
  {
    label: "Next.js",
    value: "nextjs",
  },
  {
    label: "Astro",
    value: "astro",
  },
  {
    label: "TanStack Start",
    value: "tanstack-start",
  },
  {
    label: "TanStack Router",
    value: "tanstack-router",
  },
  {
    label: "Gatsby",
    value: "gatsby",
  },
]

```

## Accessibility

* Full keyboard navigation and type-ahead search.

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on February 8, 2026