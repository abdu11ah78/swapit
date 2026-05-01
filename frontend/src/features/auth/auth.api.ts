import { apiClient } from "@/api/axios";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name?: string;
  email: string;
  phoneNumber?: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  role: string;
  userId: string;
};

type RegisterResponse = {
  userId: string;
};

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return data;
}
