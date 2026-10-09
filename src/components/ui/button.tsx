import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
  Hierarchy: red = the one primary action, outline = secondary, link = tertiary.
  Primary flips to ink on hover (paper in dark mode): a hard, deliberate state change.
*/
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap font-semibold tracking-[-0.01em] ring-offset-background transition-[background-color,color,border-color,transform] duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[1.15em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
        destructive: "bg-destructive text-destructive-foreground hover:bg-foreground hover:text-background",
        outline: "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        secondary: "bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background",
        ghost: "text-foreground hover:bg-accent",
        link: "text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:text-primary",
      },
      size: {
        default: "h-12 px-6 text-[0.9375rem]",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
