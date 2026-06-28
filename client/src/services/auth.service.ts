import { api } from "../api/axios";
import type { ApiResponse } from "../types/api.types";
import type { LoginPayload, RegisterPayload, User } from "../types/auth.types";

const deriveUsername = (email: string): string => {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}_${suffix}`;
};

const splitName = (name: string): { firstName: string; lastName?: string } => {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] ?? name.trim();
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
  return { firstName, lastName };
};

export const authService = {
  async register({ name, email, password }: RegisterPayload): Promise<User> {
    const { firstName, lastName } = splitName(name);
    const { data } = await api.post<ApiResponse<User>>("/auth/register", {
      firstName,
      lastName,
      username: deriveUsername(email),
      email,
      password,
    });
    return data.data;
  },

  async login({ email, password }: LoginPayload): Promise<User> {
    const { data } = await api.post<ApiResponse<{ user: User }>>("/auth/login", {
      email,
      password,
    });
    return data.data.user;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>("/auth/get-user");
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async refreshToken(): Promise<void> {
    await api.post("/auth/refresh-token");
  },
};
