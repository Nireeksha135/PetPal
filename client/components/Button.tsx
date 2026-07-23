import React from "react";

type Variant = "primary" | "secondary" | "destructive";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md font-medium";
  const vw = fullWidth ? "w-full" : "inline-block";
  const sz = size === "sm" ? "px-2 py-1 text-sm" : "px-3 py-2 text-sm";
  const variantClass =
    variant === "secondary"
      ? "bg-muted text-foreground"
      : variant === "destructive"
      ? "bg-destructive text-destructive-foreground"
      : "bg-primary text-primary-foreground";

  return (
    <button
      className={[base, vw, sz, variantClass, className].filter(Boolean).join(" ")}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
}
