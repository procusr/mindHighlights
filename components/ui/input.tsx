import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="search"
          className={cn(
            "h-9 w-full pl-5 pr-3 py-1.5 text-sm bg-transparent",
            "border border-gray-300 hover:border-gray-400",
            "focus:border focus:border-primary focus:outline-none",
            "rounded-md transition-all duration-300 ease-out",
            "placeholder:text-gray-400/80 placeholder:transition-opacity",
            "placeholder-focus:opacity-50 disabled:opacity-40",
            "hide-search-controls",
            "[&::-webkit-search-cancel-button]:hidden",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
