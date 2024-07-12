"use client";

import { FormInput } from "@/components/inputs/formInput";
import { PasswordInput } from "@/components/inputs/passwordInput";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authProvider } from "@/providers/api/auth";
import { loginUserDTO } from "@repo/global";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { setCookie } from "cookies-next";
import { variables } from "@/config/variables";
import { useHandleForm } from "@/hooks/useHandleForm";
import { redirect } from "next/navigation";

export function SignInForm() {
  const {
    isSubmitting,
    register,
    handleForm,
    formState: { errors },
  } = useHandleForm(loginUserDTO);

  const handleSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    handleForm(
      async (data) => {
        const { accessToken } = await authProvider.signIn(data);

        const { exp } = jwtDecode(accessToken);

        const maxAgeFallback = 60 * 60 * 24; // 1 day
        const now = new Date().getTime() / 1000;
        const maxAge = typeof exp === "number" ? exp - now : maxAgeFallback;

        setCookie(variables.accessTokenVar, accessToken, {
          path: "/",
          maxAge,
        });

        redirect("/")
      },
      {
        onApiErrorStatus: {
          401: { toast: { title: "Combinação inválida" } },
        },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <form onSubmit={handleSignIn}>
        <Card className="min-w-[400px]">
          <CardHeader>
            <Heading className="text-center">Entre com sua conta</Heading>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormInput
              label="email"
              {...register("email")}
              errorMessage={errors.email?.message}
            />
            <FormInput label="senha" errorMessage={errors.password?.message}>
              <PasswordInput {...register("password")} />
              <Link href={"/auth/forgot-password"}>
                <Text className="hover:underline" size="md">
                  Esqueci a senha
                </Text>
              </Link>
            </FormInput>
            <div className="flex flex-col gap-2">
              <Button type="submit" isLoading={isSubmitting}>
                Entrar
              </Button>
              <Button type="button" variant={"secondary"}>
                Entre com o Google
              </Button>
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
