import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-surface-2)] text-[var(--color-fg)] border border-[var(--color-border)]",
        primary:
          "bg-[var(--color-primary-soft)] text-[var(--color-primary-soft-fg)]",
        success:
          "bg-[oklch(0.94_0.06_145)] text-[oklch(0.32_0.14_145)] dark:bg-[oklch(0.32_0.1_145)] dark:text-[oklch(0.92_0.06_145)]",
        warning:
          "bg-[oklch(0.96_0.08_75)] text-[oklch(0.42_0.14_75)] dark:bg-[oklch(0.36_0.1_75)] dark:text-[oklch(0.94_0.08_75)]",
        danger:
          "bg-[var(--color-danger-soft)] text-[var(--color-danger)] dark:bg-[oklch(0.32_0.12_27)] dark:text-[oklch(0.92_0.08_27)]",
        outline:
          "border border-[var(--color-border-strong)] text-[var(--color-fg)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
