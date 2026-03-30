"use client";

import { useMutation } from "@tanstack/react-query";
import {
  type LoginPayload,
  loginRequest,
  type RegisterPayload,
  registerRequest,
} from "@/features/auth/auth.api";
import { setAccessToken } from "@/lib/auth-storage";
import { toast } from "sonner";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      setAccessToken(data.token);
      toast.success("Login successful.");
    },
    onError: () => {
      toast.error("Login failed.");
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await registerRequest(payload);
      return loginRequest({ email: payload.email, password: payload.password });
    },
    onSuccess: (data) => {
      setAccessToken(data.token);
      toast.success("Account created and logged in.");
    },
    onError: () => {
      toast.error("Registration failed.");
    },
  });
}
