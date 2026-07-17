import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly Option[];
  error?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            className={cn(
              "h-11 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-10 text-sm text-foreground",
              "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
