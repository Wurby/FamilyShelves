import { type ButtonHTMLAttributes } from "react";
import { Link } from "react-router";

// Colocated types
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "link";
  to?: string; // Optional route path for link buttons
  external?: boolean; // Optional flag for external links
  className?: string;
}

export function Button({
  variant = "solid",
  to,
  external,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const styles = {
    solid:
      "px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-sky-600 hover:bg-sky-700 active:bg-sky-800 dark:bg-sky-500 dark:hover:bg-sky-600 dark:active:bg-sky-700 border-2 border-sky-600 dark:border-sky-500 text-white dark:text-white",
    outline:
      "px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent hover:bg-sky-50 active:bg-sky-100 dark:bg-transparent dark:hover:bg-sky-950 dark:active:bg-sky-900 border-2 border-sky-600 dark:border-sky-500 text-sky-600 dark:text-sky-400",
    link: "font-light text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors inline",
  };

  const style = `${styles[variant]} ${className}`.trim();

  // If it's a link, use the appropriate component
  if (to) {
    if (external) {
      return (
        <a
          href={to}
          className={style}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link to={to} className={style}>
        {children}
      </Link>
    );
  }

  // Otherwise render as a button
  return (
    <button className={style} {...props}>
      {children}
    </button>
  );
}
