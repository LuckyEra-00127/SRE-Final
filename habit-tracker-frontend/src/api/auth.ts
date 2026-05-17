import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import { apiClient } from "./axios";

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", payload);
  return response.data;
}
