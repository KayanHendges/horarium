"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface PasswordInputProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, "type"> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [hidePassword, setHidePassword] = useState<boolean>(true);

    return (
      <Input.Root>
        <Input.Field
          ref={ref}
          type={hidePassword ? "password" : "text"}
          {...props}
        />
        <Button
          tabIndex={-1}
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
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
