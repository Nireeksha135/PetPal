import { forwardRef, InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name?.toString();

    return (
      <label className={["flex flex-col", className].filter(Boolean).join(" ")}>
        {label && (
          <span className="mb-1 text-sm font-medium" htmlFor={fieldId}>
            {label}
          </span>
        )}
        <input
          id={fieldId}
          ref={ref}
          className="rounded-md border px-3 py-2 text-sm bg-input"
          {...props}
        />
        {error && <span className="mt-1 text-xs text-destructive">{error}</span>}
      </label>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
