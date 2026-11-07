import type { ButtonHTMLAttributes } from "react";
export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "quiet" | "success";
export function Button({ variant = "primary", size = "sm", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: "xs" | "sm" | "md" }) {
  return <button type="button" {...props} className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 font-medium transition-colors disabled:opacity-40 ${size === "xs" ? "h-7 text-xs" : "h-8 text-[13px]"} ${variant === "accent" ? "bg-blue text-white" : variant === "primary" ? "bg-ink text-surface" : variant === "secondary" ? "bg-field text-ink" : "text-ink hover:bg-hover"} ${className}`} />;
}
