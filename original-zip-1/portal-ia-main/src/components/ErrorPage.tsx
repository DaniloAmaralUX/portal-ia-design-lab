import { useEffect, type ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { documentTitle } from "@/lib/page-head";

// The page that takes the place of the content when there is none, so the browser tests tell it from a real page by data-error-page.
export function ErrorPage({
  kind,
  heading,
  title,
  text,
  children,
}: {
  kind: "not-found" | "failed";
  heading: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = documentTitle(title);
  }, [title]);
  return (
    <Container data-error-page={kind} className="py-24 sm:py-32">
      <h1 className="max-w-xl font-display text-title font-extrabold text-balance">{heading}</h1>
      <p className="mt-5 max-w-lg text-lead text-muted-foreground">{text}</p>
      {children}
    </Container>
  );
}
