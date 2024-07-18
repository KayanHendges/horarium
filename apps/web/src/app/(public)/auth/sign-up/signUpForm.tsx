"use client";

import { FormInput } from "@/components/inputs/formInput";
import { PasswordInput } from "@/components/inputs/passwordInput";
import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useHandleForm } from "@/hooks/useHandleForm";
import { authProvider } from "@/providers/api/auth";
import { signIn } from "@/utils/auth/client";
import { registerUserDTO } from "@repo/global";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { PasswordValidation } from "./passwordValidation";

const registerSchema = z.object({
  ...registerUserDTO.shape,
  confirmPassword: registerUserDTO.shape.password,
});

export function SignUpForm() {
  const {
    setError,
    isSubmitting,
    register,
    handleForm,
    watch,
    formState: { errors },
  } = useHandleForm(registerSchema);

  const router = useRouter();

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    handleForm(
      async (data) => {
        if (data.password !== data.confirmPassword)
          return setError("confirmPassword", {
            message: "The passwords do not match",
          });

        const { confirmPassword: _, ...payload } = data;

        await authProvider.signUp(payload);

        await signIn(data, router.push);
      },
      {
        onApiErrorStatus: {
          400: {
            toast: {
              title: "Falha ao criar usuário",
              description: "Revise o formulário.",
            },
          },
          409: {
            toast: {
              title: "Um usuário já existe com esse email",
              description:
                "Acesse utilizando esse email ou redefina a sua senha.",
              duration: 2 * 1000, // 2s
              action: (
                <Link href={"/auth/sign-in"}>
                  <ToastAction altText="Vá para a página de acesso">
                    Entrar
                  </ToastAction>
                </Link>
              ),
            },
          },
        },
      }
    );
  };

  const password = watch("password") || "";

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <form onSubmit={handleSignUp}>
        <Card className="min-w-[400px]">
          <CardHeader>
            <Heading className="text-center">Crie sua conta</Heading>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormInput
              label="Nome completo"
              {...register("name")}
              errorMessage={errors.name?.message}
            />
            <FormInput
              label="Email"
              {...register("email")}
              errorMessage={errors.email?.message}
            />
            <FormInput label="Senha" errorMessage={errors.password?.message}>
              <PasswordInput {...register("password")} />
              <PasswordValidation
                password={password}
                schema={registerSchema.shape.password}
              />
            </FormInput>
            <FormInput
              label="Confirme sua senha"
              errorMessage={errors.confirmPassword?.message}
            >
              <PasswordInput {...register("confirmPassword")} />
            </FormInput>
            <div className="flex flex-col gap-2">
              <Button type="submit" isLoading={isSubmitting}>
                Criar
              </Button>
              <Button type="button" variant={"secondary"}>
                Entre com o Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
