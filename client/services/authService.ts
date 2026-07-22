import { api } from "./api";
import type { User } from "@/types";
import type {
  LoginPayload,
  RegisterPayload,
  TokenResponse,
} from "@/types/auth";

export const authService = {
  async register(payload: RegisterPayload): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>("/auth/register", {
      email: payload.email,
      password: payload.password,
      full_name: payload.fullName,
    });
    return data;
  },

  async login(payload: LoginPayload): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>("/auth/login", payload);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<{
      id: string;
      email: string;
      full_name: string;
      avatar_url: string | null;
      created_at: string;
    }>("/auth/me");

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
