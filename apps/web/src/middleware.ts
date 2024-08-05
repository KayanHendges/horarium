import { hasCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import { variables } from "./config/variables";
import { getCookieStore } from "./utils/auth";

export async function middleware(request: NextRequest) {
  const cookieStore = await getCookieStore();

  const authCookie = hasCookie(variables.accessTokenVar, {
    cookies: cookieStore,
  });

  const path = request.nextUrl.pathname;
  const isAuthRoute = /auth\/.*/.test(path);
  const isPublicRoute = /(welcome|welcome\/).*/.test(path);

  if (authCookie && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (!authCookie && !(isAuthRoute || isPublicRoute)) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
