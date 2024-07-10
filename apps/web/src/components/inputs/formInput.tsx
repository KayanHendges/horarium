import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function FormInput({
  label,
  className,
  children,
  ...props
}: FormInputProps) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {label && <Label>{label}</Label>}
      {children ? (
        children
      ) : (
        <Input.Root>
          <Input.Field {...props} />
        </Input.Root>
      )}
    </div>
  );
}
