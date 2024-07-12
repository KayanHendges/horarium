import { toast, ToastOptions } from "@/components/ui/use-toast";
import { FetchApiException } from "@/providers/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  useForm,
  UseFormProps,
} from "react-hook-form";
import { z } from "zod";

interface ErrorOptions<Err> {
  onError?: (error: Err) => void;
  toast?: ToastOptions;
  preventToast?: boolean;
}

interface ActionOptions<T extends z.ZodType> {
  onSubmitError?: ErrorOptions<FieldErrors<z.TypeOf<T>>>;
  onApiError?: ErrorOptions<FetchApiException>;
  onApiErrorStatus?: Record<number, ErrorOptions<FetchApiException>>;
}

interface UseHandleFormOptions<T extends FieldValues> extends UseFormProps<T> {}

export function useHandleForm<T extends z.ZodObject<any>>(
  schema: T,
  options?: UseHandleFormOptions<z.infer<T>>
) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    ...options,
  });

  const handleForm = async (
    action: (data: z.TypeOf<T>) => Promise<void> | void,
    actionOptions?: ActionOptions<T>
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const data = await new Promise<z.TypeOf<T> | void>((resolve) => {
        form.handleSubmit(resolve, (error) => {
          if (actionOptions?.onSubmitError?.onError)
            actionOptions.onSubmitError.onError(error);

          if (!actionOptions?.onSubmitError?.preventToast)
            toast({
              title: "Formulário inválido",
              duration: 1 * 1000,
              variant: "destructive",
              ...actionOptions?.onSubmitError?.toast,
            });

          resolve();
        })();
      });

      if (data) await action(data);
    } catch (error) {
      if (!(error instanceof FetchApiException)) {
        toast({
          title: "Houve uma falha",
          description: "Tente novamente em alguns minutos",
          duration: 2 * 1000,
          variant: "destructive",
        });
        return;
      }

      const statusErrorOptions =
        actionOptions?.onApiErrorStatus &&
        actionOptions?.onApiErrorStatus[error.response.status];

      const errorOptionFunction =
        statusErrorOptions?.onError || actionOptions?.onApiError?.onError;

      if (errorOptionFunction) errorOptionFunction(error);

      const preventToast =
        statusErrorOptions?.preventToast ||
        actionOptions?.onApiError?.preventToast;

      const toastOptions =
        statusErrorOptions?.toast || actionOptions?.onApiError?.toast;

      if (!preventToast)
        toast({
          title: "Houve uma falha",
          description: toastOptions
            ? toastOptions.description
            : "Tente novamente em alguns minutos.",
          duration: 2 * 1000,
          variant: "destructive",
          ...toastOptions,
        });
    }

    setIsSubmitting(false);
  };

  return { ...form, isSubmitting, handleForm };
}
