export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName?: string;
  email: string;
  role?: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
