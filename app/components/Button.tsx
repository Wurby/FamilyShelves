import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";
import { type ComponentProps } from "react";

type ButtonVariant = "solid" | "outline" | "link" | "icon" | "iconNoBorder";
type ButtonColor = "primary" | "secondary" | "warning" | "success" | "muted";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  to?: string;
  icon?: LucideIcon;
  iconNoBorder?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  solid: "px-4 py-2 rounded-md font-medium transition-colors",
  outline: "px-4 py-2 rounded-md font-medium border transition-colors",
  link: "font-medium transition-colors",
  icon: "p-1.5 border-2 rounded-md transition-colors",
  iconNoBorder: "p-1 rounded-md transition-colors",
};

const colorStyles: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    solid:
      "bg-sky-500 text-white hover:bg-sky-600 disabled:bg-sky-300 dark:disabled:bg-sky-800",
    outline:
      "border-sky-500 text-sky-600 hover:bg-sky-50 disabled:border-sky-300 disabled:text-sky-300 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-950 dark:disabled:text-sky-700 dark:disabled:border-sky-800",
    link: "text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300",
    icon: "text-sky-500 border-sky-500 hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:border-sky-400 dark:hover:bg-sky-900/20 dark:hover:text-sky-300",
    iconNoBorder:
      "text-sky-500 hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-900/20 dark:hover:text-sky-300",
  },
  secondary: {
    solid:
      "bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-800",
    outline:
      "border-gray-500 text-gray-600 hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-300 dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-950 dark:disabled:text-gray-700 dark:disabled:border-gray-800",
    link: "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
    icon: "text-gray-500 border-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:border-gray-400 dark:hover:bg-gray-900/20 dark:hover:text-gray-300",
    iconNoBorder:
      "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900/20 dark:hover:text-gray-300",
  },
  warning: {
    solid:
      "bg-pink-500 text-white hover:bg-pink-600 disabled:bg-pink-300 dark:disabled:bg-pink-800",
    outline:
      "border-pink-500 text-pink-600 hover:bg-pink-50 disabled:border-pink-300 disabled:text-pink-300 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-950 dark:disabled:text-pink-700 dark:disabled:border-pink-800",
    link: "text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300",
    icon: "text-pink-500  border-pink-500 hover:bg-pink-50 hover:text-pink-700 dark:text-pink-400 dark:border-pink-400 dark:hover:bg-pink-900/20 dark:hover:text-pink-300",
    iconNoBorder:
      "text-pink-500 hover:bg-pink-50 hover:text-pink-700 dark:text-pink-400 dark:hover:bg-pink-900/20 dark:hover:text-pink-300",
  },
  success: {
    solid:
      "bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-800",
    outline:
      "border-emerald-500 text-emerald-600 hover:bg-emerald-50 disabled:border-emerald-300 disabled:text-emerald-300 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:disabled:text-emerald-700 dark:disabled:border-emerald-800",
    link: "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300",
    icon: "text-emerald-500 border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300",
    iconNoBorder:
      "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300",
  },
  muted: {
    solid:
      "bg-slate-500 text-white hover:bg-slate-600 disabled:bg-slate-300 dark:disabled:bg-slate-800",
    outline:
      "border-slate-500 text-slate-600 hover:bg-slate-50 disabled:border-slate-300 disabled:text-slate-300 dark:border-slate-400 dark:text-slate-400 dark:hover:bg-slate-950 dark:disabled:text-slate-700 dark:disabled:border-slate-800",
    link: "text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
    icon: "text-slate-500 border-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:border-slate-400 dark:hover:bg-slate-900/20 dark:hover:text-slate-300",
    iconNoBorder:
      "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900/20 dark:hover:text-slate-300",
  },
};

export function Button({
  variant = "outline",
  color = "primary",
  className = "",
  to,
  icon: Icon,
  ...props
}: ButtonProps) {
  const baseStyles = variantStyles[variant];
  const variantColor = colorStyles[color][variant];
  const combinedClassName = `${baseStyles} ${variantColor} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {props.children}
      </Link>
    );
  }

  if ((variant === "icon" || variant === "iconNoBorder") && Icon) {
    return (
      <button className={combinedClassName} {...props}>
        <Icon />
      </button>
    );
  }

  return <button className={combinedClassName} {...props} />;
}
