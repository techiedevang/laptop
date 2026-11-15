"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
        outline:
          "border border-blue-700 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30",
        ghost:
          "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
        danger:
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  iconPrefix?: React.ReactNode;
  iconSuffix?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      disabled,
      iconPrefix,
      iconSuffix,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          iconPrefix && <span className="shrink-0">{iconPrefix}</span>
        )}
        {children}
        {!loading && iconSuffix && (
          <span className="shrink-0">{iconSuffix}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
