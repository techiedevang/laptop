import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-md border px-3 py-2 text-sm transition-colors",
            "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
            "border-gray-300 dark:border-gray-600",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            error && "border-red-500 dark:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
