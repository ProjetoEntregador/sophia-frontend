import { getUserToken } from "@/app/actions/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getUserToken();

  if (["/entrar", "/cadastrar"].includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!entrar|cadastrar|_next/static|_next/image|favicon.ico).*)"],
};
