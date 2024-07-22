import { CookiesFn } from "cookies-next/lib/types";

export const getCookieStore = async () => {
  let cookieStore: CookiesFn | undefined;

  // check if is server side
  if (typeof window === "undefined") {
    const { cookies: serverCookies } = await import("next/headers");

    cookieStore = serverCookies;
  }

  return cookieStore;
};
