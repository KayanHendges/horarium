import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import logo from "@public/horarium.svg";

export default async function Header() {
  return (
    <div
      className={cn(
        "w-full flex justify-between p-4 bg-card",
        "border-b-[1px] border-ring rounded-sm"
      )}
    >
      <div className="flex gap-4 items-center">
        <Image
          className="text-red-600"
          src={logo}
          alt=""
          width={48}
          height={48}
        />
        <Separator orientation="vertical" />
        <Heading className="text-brand">Horarium</Heading>
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
