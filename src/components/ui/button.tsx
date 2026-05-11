import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] shadow-[var(--shadow-card)]",
        secondary:
          "bg-[var(--color-surface-2)] text-[var(--color-fg)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]",
        ghost:
          "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]",
        soft:
          "bg-[var(--color-primary-soft)] text-[var(--color-primary-soft-fg)] hover:brightness-[0.97]",
        danger:
          "bg-[var(--color-danger)] text-white hover:brightness-110",
        outline:
          "bg-transparent text-[var(--color-fg)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
