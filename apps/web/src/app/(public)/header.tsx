import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Heading } from "@/components/Typography/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function Header() {
  return (
    <div
      className={cn(
        "w-full flex justify-between p-4 bg-card",
        "border-b-[1px] border-ring rounded-sm"
      )}
    >
      <div className="flex gap-4 items-center">
        <ShoppingCart />
        <Separator orientation="vertical" />
        <Heading>Product</Heading>
      </div>
      <div className="flex gap-4 items-center">
        <ThemeSwitcher />
        <Separator orientation="vertical" />
        <Link href={"/auth/sign-up"}>
          <Button variant={"outline"}>Crie sua conta</Button>
        </Link>
        <Link href={"/auth/sign-in"}>
          <Button>Entrar</Button>
        </Link>
      </div>
    </div>
  );
}
