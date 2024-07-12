import clsx from "clsx";
import { Slot } from "@radix-ui/react-slot";
import { ComponentProps } from "react";

export interface HeadingProps extends ComponentProps<"h2"> {
  size?: "sm" | "md" | "lg";
  truncate?: boolean;
  asChild?: boolean;
}

export function Heading({
  size = "md",
  truncate = true,
  children,
  asChild,
  className,
}: HeadingProps) {
  const Component = asChild ? Slot : "h2";

  return (
    <Component
      className={clsx(
        "text-black dark:text-white font-bold font-sans",
        {
          "text-lg": size === "sm",
          "text-xl": size === "md",
          "text-2xl": size === "lg",
          "truncate": truncate
        },
        className
      )}
    >
      {children}
    </Component>
  );
}
