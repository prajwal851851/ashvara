import { Link } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type Variant = "ghost" | "solid" | "outline" | "outline-gold" | "filled-strong";

type Props = {
  children: ReactNode;
  variant?: Variant;
  to?: string;
  href?: string;
  fullWidth?: boolean;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "outline",
  to,
  href,
  fullWidth,
  loading,
  disabled,
  className = "",
  type = "button",
  ...rest
}: Props) {
  const classes = [
    "btn",
    `btn--${variant}`,
    fullWidth ? "btn--full" : "",
    loading ? "btn--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      <span className={loading ? "btn__label--hidden" : undefined}>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        onClick={(e) => {
          if (disabled || loading) e.preventDefault();
        }}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        onClick={(e) => {
          if (disabled || loading) e.preventDefault();
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}
