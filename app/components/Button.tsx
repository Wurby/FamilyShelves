import { type ComponentProps } from "react";
import { Link } from "react-router";

type ButtonVariant = "solid" | "outline" | "link" | "icon";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  to?: string;
  warning?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  solid: "px-4 py-2 rounded-md font-medium transition-colors",
  outline: "px-4 py-2 rounded-md font-medium border transition-colors",
  link: "font-medium transition-colors",
  icon: "p-1.5 rounded-md transition-colors",
};

const variantColors = {
  normal: {
    solid:
      "bg-sky-500 text-white hover:bg-sky-600 disabled:bg-sky-300 dark:disabled:bg-sky-800",
    outline:
      "border-sky-500 text-sky-600 hover:bg-sky-50 disabled:border-sky-300 disabled:text-sky-300 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-950 dark:disabled:text-sky-700 dark:disabled:border-sky-800",
    link: "text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300",
    icon: "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200",
  },
  warning: {
    solid:
      "bg-pink-500 text-white hover:bg-pink-600 disabled:bg-pink-300 dark:disabled:bg-pink-800",
    outline:
      "border-pink-500 text-pink-600 hover:bg-pink-50 disabled:border-pink-300 disabled:text-pink-300 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-950 dark:disabled:text-pink-700 dark:disabled:border-pink-800",
    link: "text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300",
    icon: "text-pink-500 hover:bg-pink-50 hover:text-pink-700 dark:text-pink-400 dark:hover:bg-pink-900/20 dark:hover:text-pink-300",
  },
};

export function Button({
  variant = "solid",
  className = "",
  to,
  warning = false,
  ...props
}: ButtonProps) {
  const baseStyles = variantStyles[variant];
  const colorStyles = warning
    ? variantColors.warning[variant]
    : variantColors.normal[variant];
  const combinedClassName = `${baseStyles} ${colorStyles} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {props.children}
      </Link>
    );
  }

  return <button className={combinedClassName} {...props} />;
}
