import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-field text-[15px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-ink hover:brightness-110",
        ghost:
          "bg-ghost text-text border border-primary/12 hover:border-primary/24",
        success: "bg-green text-green-ink hover:brightness-110",
        amber: "bg-amber text-amber-ink hover:brightness-110",
        "amber-ghost":
          "bg-amber/10 text-amber border border-amber/30 hover:bg-amber/16",
        danger:
          "bg-red/12 text-red border border-red/35 hover:bg-red/18",
      },
      size: {
        default: "h-[50px] px-5",
        lg: "h-[56px] px-6 text-base",
        xl: "h-[60px] px-6 text-base",
        sm: "h-9 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
