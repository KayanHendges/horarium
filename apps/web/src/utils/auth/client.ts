import { variables } from "@/config/variables";
import { authProvider } from "@/providers/api/auth";
import { LoginUserDTO } from "@repo/global";
import { deleteCookie, setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

export const saveAccessToken = (accessToken: string) => {
  const { exp } = jwtDecode(accessToken);

  const maxAgeFallback = 60 * 60 * 24; // 1 day
  const now = new Date().getTime() / 1000;
  const maxAge = typeof exp === "number" ? exp - now : maxAgeFallback;

  setCookie(variables.accessTokenVar, accessToken, {
    path: "/",
    maxAge,
  });
};

export const signIn = async (
  payload: LoginUserDTO,
  redirectFn: (path: string) => void
) => {
  const { accessToken } = await authProvider.signIn(payload);

  saveAccessToken(accessToken);

  redirectFn("/");
};

export const signInWithGoogle = async (redirectFn: (path: string) => void) => {
  const apiSingInUrl = new URL(
    "/auth/google/callback",
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  redirectFn(apiSingInUrl.toString());
};

export const signOut = (redirectFn: (path: string) => void) => {
  deleteCookie(variables.accessTokenVar);

  redirectFn("/auth/sign-in");
};
