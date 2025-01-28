/// <reference types="react" />
import { type HTMLAttributes, createElement, type ElementType } from "react";

// Colocated types
type TextVariant = "title" | "subtitle" | "caption" | "link";

type TextProps = {
  variant?: "default" | "title" | "subtitle" | "link" | "caption";
  muted?: boolean;
  centered?: boolean;
  className?: string;
  as?: "p" | "span" | "a";
  children: React.ReactNode;
} & (
  | { as?: "p" | "span" }
  | ({ as: "a" } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
);

export function Text({
  variant,
  as,
  muted = false,
  centered = false,
  className = "",
  ...props
}: TextProps) {
  const styles = {
    default: "text-base text-slate-900 dark:text-slate-100",
    title: "text-3xl font-thin text-slate-900 dark:text-slate-100",
    subtitle: "text-xl font-light text-slate-800 dark:text-slate-200",
    caption: "text-sm text-slate-600 dark:text-slate-400",
    link: "font-light text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors",
  };

  // Default element mapping for variants
  const defaultElements: Record<TextVariant | "default", ElementType> = {
    default: "p",
    title: "h1",
    subtitle: "h2",
    caption: "span",
    link: "span",
  };

  const element = (as || defaultElements[variant || "default"]) as ElementType;
  const baseStyle = styles[variant || "default"];
  const mutedStyle = muted ? "opacity-75" : "";
  const centerStyle = centered ? "text-center" : "";

  return createElement(element, {
    className: `${baseStyle} ${mutedStyle} ${centerStyle} ${className}`.trim(),
    ...props,
  });
}
