import { api } from "@/providers/api";
import {
  LoginUserDTO,
  LoginUserResponse,
  RegisterUserDTO,
  RegisterUserResponse,
  RequestPasswordRecoveryDTO,
  ResetPasswordDTO,
} from "@repo/global";

class AuthProvider {
  signIn = async (payload: LoginUserDTO): Promise<LoginUserResponse> =>
    (await api.post("auth/login", payload)).data;

  signUp = async (payload: RegisterUserDTO): Promise<RegisterUserResponse> =>
    (await api.post("auth/register", payload)).data;

  requestPasswordRecoveryCode = async (
    payload: RequestPasswordRecoveryDTO
  ): Promise<void> => {
    (await api.post("auth/recovery-password", payload)).data;
  };

  resetPassword = async (payload: ResetPasswordDTO): Promise<void> => {
    (await api.post("auth/reset-password", payload)).data;
  };
}

export const authProvider = new AuthProvider();
