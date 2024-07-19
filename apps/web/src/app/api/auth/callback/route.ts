import { saveAccessToken } from "@/utils/auth/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const accessToken = searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json(
      { message: "OAuth code was not found." },
      { status: 400 }
    );
  }

  saveAccessToken(accessToken);

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = "/";
  redirectUrl.search = "";

  return NextResponse.redirect(redirectUrl);
}
