import { jwtDecode } from "jwt-decode";

// Types for JWT token payload
type TokenPayload = {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};

// Types for auth state
export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  roles: string[];
};

export type AuthResponse = {
  tokens: AuthTokens;
  user: AuthUser;
};

// Constants
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

// Client-side auth functions
export function setAuthCookies(authResponse: AuthResponse) {
  document.cookie = `${ACCESS_TOKEN_KEY}=${authResponse.tokens.accessToken}; path=/; max-age=3600; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${authResponse.tokens.refreshToken}; path=/; max-age=604800; SameSite=Lax`;
  document.cookie = `${USER_KEY}=${encodeURIComponent(
    JSON.stringify(authResponse.user)
  )}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAuthCookies() {
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${USER_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAuthFromCookies(): {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  isAuthenticated: boolean;
  isAdmin: boolean;
} {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const accessToken = cookies[ACCESS_TOKEN_KEY];
  const refreshToken = cookies[REFRESH_TOKEN_KEY];
  const userJson = cookies[USER_KEY];

  let user: AuthUser | undefined;
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

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    return true;
  }
}

export function hasAdminRole(user: AuthUser | null | undefined): boolean {
  return user?.roles?.includes("ADMIN") || false;
}
