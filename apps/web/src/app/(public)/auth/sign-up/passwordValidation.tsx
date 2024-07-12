import { Text } from "@/components/typography/text";
import { Check, X } from "lucide-react";
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
      <Text size="sm" className={"flex items-center text-green-400"}>
        <Check className="mr-1" size={16} /> Contém ao menos{" "}
        {minimumPasswordLength} caracteres.
      </Text>
    );

  return (
    <Text size="sm" className={"flex items-center text-destructive"}>
      <X className="mr-1" size={16} /> Precisa conter ao menos{" "}
      {minimumPasswordLength} caracteres.
    </Text>
  );
}
