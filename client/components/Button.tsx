import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const variants: Record<string, string> = {
      primary:
        "bg-primary text-primary-foreground shadow-soft hover:shadow-card hover:brightness-105 active:brightness-95",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/70",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-muted",
      ghost: "bg-transparent text-foreground hover:bg-muted",
      destructive:
        "bg-destructive text-destructive-foreground shadow-soft hover:brightness-105",
    };

    const sizes: Record<string, string> = {
      sm: "h-9 px-3.5 text-sm gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium",
          "transition-all duration-150 ease-out active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
