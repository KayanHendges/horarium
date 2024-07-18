import { Text } from "@/components/typography/text";
import { cn } from "@/lib/utils";
import { Check, Info, X } from "lucide-react";
import { z } from "zod";

interface Props {
  password: string;
  schema: z.ZodString;
}

export function PasswordValidation({ password, schema }: Props) {
  const minimumPasswordLength =
    schema._def.checks.find((check) => check.kind === "min")?.value || 8;

  const matchMinimumLength = password.length >= minimumPasswordLength;

  if (matchMinimumLength)
    return (
      <Text size="sm" className={"flex items-center text-positive"}>
        <Check className="mr-1" size={16} /> Contém ao menos{" "}
        {minimumPasswordLength} caracteres.
      </Text>
    );

  return (
    <Text
      size="sm"
      className={cn("flex items-center", password.length && "text-destructive")}
    >
      {password.length ? (
        <X className="mr-1" size={16} />
      ) : (
        <Info className="mr-1" size={16} />
      )}{" "}
      Precisa conter ao menos {minimumPasswordLength} caracteres.
    </Text>
  );
}
