"use client";

import { FormInput } from "@/components/inputs/formInput";
import { PasswordInput } from "@/components/inputs/passwordInput";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Stepper } from "@/components/ui/stepper";
import { toast } from "@/components/ui/use-toast";
import { useHandleForm } from "@/hooks/useHandleForm";
import { authProvider } from "@/providers/api/auth";
import { signIn } from "@/utils/auth/client";
import {
  requestPasswordRecoverySchema,
  resetPasswordSchema,
} from "@repo/global";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { PasswordValidation } from "../sign-up/passwordValidation";

const resetPasswordFormSchema = z.object({
  ...resetPasswordSchema.shape,
  confirmPassword: resetPasswordSchema.shape.password,
});

export function ResetPasswordForm() {
  const stepperState = useState<number>(0);
  const [currentStep, setStep] = stepperState;
  const recoveryForm = useHandleForm(requestPasswordRecoverySchema);
  const resetPasswordForm = useHandleForm(resetPasswordFormSchema);

  const router = useRouter();

  const handleRequestRecoveryCode = async () => {
    const nextStep = await recoveryForm.handleForm(async (data) => {
      await authProvider.requestPasswordRecoveryCode(data);
      resetPasswordForm.setValue("email", data.email);
      return true;
    });

    return nextStep;
  };

  const handleCodeForm = async () => {
    const valid = await resetPasswordForm.trigger("code");
    if (!valid) {
      toast({ title: "Código inválido", variant: "destructive" });
      return;
    }

    setStep(currentStep + 1);
  };

  const handleResetPassword = async () => {
    const nextStep = await resetPasswordForm.handleForm(
      async (data) => {
        if (data.password !== data.confirmPassword)
          return resetPasswordForm.setError("confirmPassword", {
            message: "The passwords do not match",
          });

        const { confirmPassword: _, ...payload } = data;

        await authProvider.resetPassword(payload);
        signIn({ email: data.email, password: data.password }, router.push);

        return true;
      },
      {
        onApiErrorStatus: {
          401: {
            toast: { title: "Token inválido." },
            onError: () => {
              resetPasswordForm.setValue("code", "");
              setStep(currentStep - 1);
            },
          },
          410: {
            toast: { title: "Token descartado ou expirado." },
            onError: () => {
              resetPasswordForm.setValue("code", "");
              setStep(currentStep - 1);
            },
          },
        },
      }
    );

    return nextStep;
  };

  const password = resetPasswordForm.watch("password") || "";

  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center py-16">
      <Stepper.Root
        className="w-full max-w-[720px] flex-1"
        stepperState={stepperState}
      >
        <Stepper.Header>
          <Stepper.HeaderItem>Email de recuperação</Stepper.HeaderItem>
          <Stepper.HeaderItem>Validação do código</Stepper.HeaderItem>
          <Stepper.HeaderItem>Redefinir senha</Stepper.HeaderItem>
        </Stepper.Header>
        <Stepper.Content>
          <Stepper.ContentItem
            className="flex w-full max-w-96 py-4 flex-col justify-start"
            handleNextStepSubmit={handleRequestRecoveryCode}
          >
            <div className="text-center">
              <Heading className="text-wrap">Email de recuperação</Heading>
              <Text className="text-wrap">
                Digite o email da conta que deseja recuperar
              </Text>
            </div>
            <div className="max-w-96 w-full flex flex-col gap-4 my-auto">
              <FormInput
                label="Email"
                {...recoveryForm.register("email")}
                errorMessage={recoveryForm.formState.errors.email?.message}
              />
              <Stepper.Button
                className="w-full"
                type="submit"
                isLoading={recoveryForm.isSubmitting}
              >
                Enviar
              </Stepper.Button>
            </div>
          </Stepper.ContentItem>
          <Stepper.ContentItem
            className="flex w-full max-w-96 py-4 flex-col justify-start"
            handleNextStepSubmit={handleCodeForm}
          >
            <div className="text-center">
              <Heading className="text-wrap">Valide o seu código</Heading>
              <Text className="text-wrap">
                Digite o código com 6 dígitos que enviamos para o seu email.
              </Text>
            </div>
            <div className="flex flex-col gap-10 my-auto">
              <InputOTP
                maxLength={6}
                onChange={(value) => {
                  resetPasswordForm.setValue("code", value);
                }}
                value={resetPasswordForm.watch("code")}
                onComplete={handleCodeForm}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className="flex flex-col gap-2">
                <Stepper.Button
                  type="submit"
                  isLoading={recoveryForm.isSubmitting}
                >
                  Enviar
                </Stepper.Button>
                <Stepper.Button variant={"secondary"} nav="previous">
                  Voltar
                </Stepper.Button>
              </div>
            </div>
          </Stepper.ContentItem>
          <Stepper.ContentItem
            handleNextStepSubmit={handleResetPassword}
            className="flex w-full max-w-96 py-4 flex-col justify-start"
          >
            <Heading>Redefina sua senha</Heading>
            <div className="max-w-96 w-full flex flex-col gap-4 my-auto">
              <FormInput
                label="Nova senha"
                errorMessage={
                  resetPasswordForm.formState.errors.password?.message
                }
              >
                <PasswordInput {...resetPasswordForm.register("password")} />
                <PasswordValidation
                  password={password}
                  schema={resetPasswordFormSchema.shape.password}
                />
              </FormInput>
              <FormInput
                label="Confirme sua senha"
                errorMessage={
                  resetPasswordForm.formState.errors.confirmPassword?.message
                }
              >
                <PasswordInput
                  {...resetPasswordForm.register("confirmPassword")}
                />
              </FormInput>
              <div className="flex flex-col gap-2">
                <Stepper.Button
                  type="submit"
                  isLoading={resetPasswordForm.isSubmitting}
                >
                  Redefinir
                </Stepper.Button>
                <Stepper.Button variant={"secondary"} nav="previous">
                  Voltar
                </Stepper.Button>
              </div>
            </div>
          </Stepper.ContentItem>
        </Stepper.Content>
      </Stepper.Root>
    </div>
  );
}
