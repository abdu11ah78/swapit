import { apiClient } from "@/api/axios";
import { ItemResponse } from "@/features/items/items.api";

export type ProfileResponse = {
  id: string;
  name?: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  role: string;
  ltpBalance: number;
  isLocationPublic: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
  trustScore: number;
  createdAt: string;
};

export type UpdateProfilePayload = {
  name?: string;
  image?: string;
  isLocationPublic?: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
};

export async function getProfileRequest(): Promise<ProfileResponse> {
  const { data } = await apiClient.get<ProfileResponse>("/profile");
  return data;
}

export async function getMyPostsRequest(): Promise<ItemResponse[]> {
  const { data } = await apiClient.get<ItemResponse[]>("/profile/posts");
  return data;
}

export async function updateProfileRequest(payload: UpdateProfilePayload): Promise<boolean> {
  const { data } = await apiClient.put<boolean>("/profile", payload);
  return data;
}
