import { variables } from "@/config/variables";
import { getCookie } from "cookies-next";
import { getCookieStore } from ".";

export const isAuthenticated = async () => {
  const cookieStore = await getCookieStore();

  return !!getCookie(variables.accessTokenVar, { cookies: cookieStore });
};
