import { api } from "@/providers/api";
import {
  LoginUserDTO,
  LoginUserResponse,
  RegisterUserDTO,
  RegisterUserResponse,
} from "@repo/global";

class AuthProvider {
  signIn = async (payload: LoginUserDTO): Promise<LoginUserResponse> =>
    (await api.post("auth/login", payload)).data;

  signUp = async (payload: RegisterUserDTO): Promise<RegisterUserResponse> =>
    (await api.post("auth/register", payload)).data;
}

export const authProvider = new AuthProvider();
