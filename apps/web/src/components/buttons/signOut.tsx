"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "@/utils/auth/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      size={"icon"}
      variant={"ghost"}
      onClick={() => signOut(router.push)}
    >
      <LogOut size={16} />
    </Button>
  );
}
