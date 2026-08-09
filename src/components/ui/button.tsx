import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button.
 *
 * shadcn/ui structure, Vishweshwara palette. Deliberately NOT the default
 * shadcn theme — we own this source, so it is restyled rather than overridden
 * (docs/02 D-05: framework default styling is refused).
 *
 * Note there is no gold variant. Gold is an accent for rules, seals, and
 * certificates — never a button fill (D-03).
 */

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        /** The single sitewide call to action: Request an Orientation. */
        primary: "bg-primary text-parchment-50 hover:bg-maroon-800",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-raised",
        ghost: "bg-transparent text-foreground hover:bg-raised",
        link: "bg-transparent text-primary underline underline-offset-4 hover:text-maroon-800",
        danger: "bg-danger text-parchment-50 hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
