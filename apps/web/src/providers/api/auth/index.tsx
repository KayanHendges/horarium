import { api } from "@/providers/api";
import {
  LoginUserDTO,
  LoginUserResponse,
  RegisterUserDTO,
  RegisterUserResponse,
  RequestPasswordRecoveryDTO,
  ResetPasswordDTO,
} from "@repo/global";
import { handleAPIResponse } from "../utils";

class AuthProvider {
  signIn = async (payload: LoginUserDTO): Promise<LoginUserResponse> =>
    handleAPIResponse(api.post("auth/login", payload));

  signUp = async (payload: RegisterUserDTO): Promise<RegisterUserResponse> =>
    handleAPIResponse(api.post("auth/register", payload));

  requestPasswordRecoveryCode = async (
    payload: RequestPasswordRecoveryDTO
  ): Promise<void> => {
    handleAPIResponse(api.post("auth/recovery-password", payload));
  };

  resetPassword = async (payload: ResetPasswordDTO): Promise<void> => {
    handleAPIResponse(api.post("auth/reset-password", payload));
  };
}

export const authProvider = new AuthProvider();
