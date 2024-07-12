"use client";

import { FormInput } from "@/components/inputs/formInput";
import { PasswordInput } from "@/components/inputs/passwordInput";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useHandleForm } from "@/hooks/useHandleForm";
import { signIn } from "@/utils/auth/client";
import { loginUserDTO } from "@repo/global";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const {
    isSubmitting,
    register,
    handleForm,
    formState: { errors },
  } = useHandleForm(loginUserDTO);

  const router = useRouter();

  const handleSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    handleForm(async (data) => signIn(data, router.push), {
      onApiErrorStatus: {
        401: { toast: { title: "Combinação inválida" } },
      },
    });
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
              label="Email"
              {...register("email")}
              errorMessage={errors.email?.message}
            />
            <FormInput label="Senha" errorMessage={errors.password?.message}>
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
              <Link href={"/auth/sign-up"}>
                <strong className="text-brand underline">
                  Crie sua conta.
                </strong>
              </Link>
            </Text>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
