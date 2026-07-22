import { api, clearToken, setToken } from "./client";

export type UserRole = "student" | "instructor" | "admin";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: {
    url?: string;
    publicId?: string;
  };
};

type AuthResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};

type MeResponse = {
  success: boolean;
  user: AuthUser;
};

export async function loginRequest(email: string, password: string) {
  const data = await api<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(data.token);
  return data.user;
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
}) {
  const data = await api<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
  setToken(data.token);
  return data.user;
}

export async function getMeRequest() {
  const data = await api<MeResponse>("/api/auth/me", {
    method: "GET",
    auth: true,
  });
  return data.user;
}

export async function logoutRequest() {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

export function dashboardPathForRole(role: UserRole) {
  if (role === "admin") return "/admin" as const;
  if (role === "instructor") return "/instructor/dashboard" as const;
  return "/student/dashboard" as const;
}
