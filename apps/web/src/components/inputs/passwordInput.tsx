"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";

export interface PasswordInputProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, "type"> {}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  return (
    <Input.Root>
      <Input.Field type={hidePassword ? "password" : "text"} {...props} />
      <Button
        variant={"ghost"}
        type="button"
        className="h-full px-2 rounded-none"
        onClick={() => setHidePassword(!hidePassword)}
      >
        {hidePassword ? <Eye size={16} /> : <EyeOff size={16} />}
      </Button>
    </Input.Root>
  );
}
