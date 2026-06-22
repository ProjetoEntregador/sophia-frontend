"use server";

import { cookies } from "next/headers";

export async function login(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(
    process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME as string,
    token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    },
  );
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set(
    process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME as string,
    "",
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    },
  );
}

export async function getUserToken() {
  const cookieStore = await cookies();

  const cookie = cookieStore.get(
    process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME as string,
  )?.value;

  if (!cookie) {
    return "";
  }

  return cookie;
}
