import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface TextInputRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  validation?: "error";
}

const InputRoot = ({ className, children, validation, ...props }: TextInputRootProps) => {
  return (
    <div
      className={cn(
        "group h-9 w-full flex items-center overflow-hidden",
        "rounded-md border border-input bg-transparent transition-all ring-black dark:ring-white focus-within:ring-1",
        validation === "error" && "ring-1 ring-red-500 dark:ring-red-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

InputRoot.displayName = "Input.Root";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, id, ...props }, ref) => {
    return (
      <input
        id={id}
        type={type}
        className={cn(
          "group flex-1 h-full bg-transparent px-3 py-1 text-sm transition-colors",
          "placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
InputField.displayName = "Input.Field";

export const Input = { Root: InputRoot, Field: InputField };
