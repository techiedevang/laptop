import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        success:
          "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
        warning:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
        error:
          "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
        info:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
        "grade-aplus":
          "bg-emerald-500 text-white dark:bg-emerald-600",
        "grade-a":
          "bg-green-500 text-white dark:bg-green-600",
        "grade-b":
          "bg-yellow-500 text-white dark:bg-yellow-600",
        default:
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export function GradeBadge({ grade }: { grade: "A+" | "A" | "B" }) {
  const variantMap: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
    "A+": "grade-aplus",
    A: "grade-a",
    B: "grade-b",
  };
  return <Badge variant={variantMap[grade]}>Grade {grade}</Badge>;
}

export { Badge, badgeVariants };
