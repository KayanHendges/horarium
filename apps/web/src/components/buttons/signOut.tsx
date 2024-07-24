"use client";

import { signOut } from "@/utils/auth/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipContentProps,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props extends ButtonProps {
  tooltipSide?: TooltipContentProps["side"];
}

export function SignOutButton({ tooltipSide = "right", ...props }: Props) {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size={"icon"}
            variant={"ghost"}
            onClick={() => signOut(router.push)}
          >
            <LogOut size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>Sair</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
