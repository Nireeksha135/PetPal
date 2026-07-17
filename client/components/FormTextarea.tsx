import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          rows={4}
          className={cn(
            "resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
