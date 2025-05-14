// lib/server-auth.ts
import { cookies } from "next/headers";
import { AuthUser } from "./auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export function getServerAuth() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;
  const userJson = cookieStore.get(USER_KEY)?.value;

  let user: AuthUser | null = null;
  if (userJson) {
    try {
      user = JSON.parse(decodeURIComponent(userJson));
    } catch (e) {
      console.error("Failed to parse user from cookie", e);
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: !!accessToken && !!user,
    isAdmin: user?.roles?.includes("ADMIN") || false,
  };
}
