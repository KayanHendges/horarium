import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React from "react";
import { Text } from "../Typography/Text";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, className, children, errorMessage, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col items-start gap-2", className)}>
        {label && <Label>{label}</Label>}
        {children ? (
          children
        ) : (
          <Input.Root validation={errorMessage ? "error" : undefined} >
            <Input.Field ref={ref} {...props} />
          </Input.Root>
        )}
        {errorMessage && (
          <Text size="sm" className="text-red-500 dark:text-red-500">
            {errorMessage}
          </Text>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
