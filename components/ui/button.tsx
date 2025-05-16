import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-70",
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-white shadow-sm",
          "hover:bg-primary/90 hover:shadow-md",
          "active:bg-primary/80 active:shadow-sm",
        ],
        secondary: [
          "bg-gray-100 text-gray-700 border border-gray-200",
          "hover:bg-gray-200 hover:border-gray-300",
          "active:bg-gray-300",
        ],
        outline: [
          "border border-gray-300 bg-white text-gray-700",
          "hover:border-gray-400 hover:bg-gray-50",
          "active:bg-gray-100",
        ],
        text: [
          "text-gray-700 hover:bg-gray-100",
          "hover:text-gray-900",
          "active:bg-gray-200",
        ],
        alert: [
          "bg-red-600 text-white shadow-sm",
          "hover:bg-red-700 hover:shadow-md",
          "active:bg-red-800",
        ],
      },
      size: {
        md: "h-9 px-4 py-2 text-sm rounded-[3px]",
        sm: "h-8 px-3 text-sm rounded-[2px]",
        lg: "h-10 px-5 text-base rounded-[4px]",
        icon: "h-9 w-9 rounded-[3px]",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "active:scale-[0.98] transition-transform duration-100 ease-out"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
