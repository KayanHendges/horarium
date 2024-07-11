"use client";

import { FormInput } from "@/components/inputs/formInput";
import { PasswordInput } from "@/components/inputs/passwordInput";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authProvider } from "@/providers/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserDTO, loginUserDTO } from "@repo/global";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { setCookie } from "cookies-next";
import { variables } from "@/config/variables";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { FetchApiException } from "@/providers/api";

export function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDTO>({
    resolver: zodResolver(loginUserDTO),
  });

  const handleSignIn = async (data: LoginUserDTO) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      console.log("before");
      const { accessToken } = await authProvider.signIn(data);

      const { exp } = jwtDecode(accessToken);

      const maxAgeFallback = 60 * 60 * 24; // 1 day
      const maxAge = typeof exp === "number" ? exp * 1000 : maxAgeFallback;

      setCookie(variables.accessTokenVar, accessToken, {
        path: "/",
        maxAge,
      });
    } catch (err) {
      if (err instanceof FetchApiException && err.response.status === 401) {
        console.log(err.response);
        toast({
          title: "Combinação inválida.",
          duration: 2 * 1000,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Falha ao fazer login.",
          description: "Tente novamente em alguns minutos",
          duration: 2 * 1000,
          variant: "destructive",
        });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <form onSubmit={handleSubmit(handleSignIn)}>
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
