import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { docText, markdownBase, measure } from "@/components/markdown-base";
import { cn } from "@/lib/utils";

// The page title is the h1, so the headings of the text start one level below it.
const components: Components = {
  ...markdownBase,
  h1: ({ node: _n, ...p }) => <h2 className={cn(measure, "mb-3 mt-10 font-display text-heading font-bold text-foreground")} {...p} />,
  h2: ({ node: _n, ...p }) => <h2 className={cn(measure, "mb-3 mt-10 font-display text-heading font-bold text-foreground")} {...p} />,
  h3: ({ node: _n, ...p }) => <h3 className={cn(measure, "mb-2 mt-8 font-display text-subheading font-bold text-foreground")} {...p} />,
};

export function RecordingText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn(docText, className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </Markdown>
    </div>
  );
}
