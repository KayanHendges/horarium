"use client";

import { FormInput } from "@/components/inputs/formInput";
import { PasswordInput } from "@/components/inputs/passwordInput";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserDTO, loginUserDTO } from "@repo/global";
import Link from "next/link";
import { useForm } from "react-hook-form";

export function SignInForm() {
  const form = useForm<LoginUserDTO>({ resolver: zodResolver(loginUserDTO) });

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <form>
        <Card className="min-w-[400px]">
          <CardHeader>
            <Heading className="text-center">Entre com sua conta</Heading>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormInput label="email" {...form.register("email")} />
            <FormInput label="senha">
              <PasswordInput {...form.register("password")} />
              <Link href={"/auth/forgot-password"}>
                <Text className="hover:underline" size="md">
                  Esqueci a senha
                </Text>
              </Link>
            </FormInput>
            <div className="flex flex-col gap-2">
              <Button>Entrar</Button>
              <Button variant={"secondary"}>Entre com o Google</Button>
            </div>
            <Separator />
            <Text>
              Ainda não possui conta?{" "}
              <Link href={"/auth/forgot-password"}>
                <strong className="underline">Crie sua conta.</strong>
              </Link>
            </Text>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
