import { apiClient } from "@/api/axios";

export type CategoryAttribute = {
  id: string;
  name: string;
  type: string;
  isRequired: boolean;
  options?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  parentId?: string;
  attributes: CategoryAttribute[];
};

export type Province = {
  id: string;
  name: string;
};

export type SuggestionPayload = {
  type: string;
  name: string;
};

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/taxonomy/categories");
  return data;
}

export async function getProvinces(): Promise<Province[]> {
  const { data } = await apiClient.get<Province[]>("/taxonomy/provinces");
  return data;
}

export async function submitSuggestion(payload: SuggestionPayload): Promise<void> {
  await apiClient.post("/taxonomy/suggestions", payload);
}
