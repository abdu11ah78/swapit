import { apiClient } from "@/api/axios";

export interface ItemResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  location: string;
  ltpValue: number;
  status: string;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerTrustScore: number;
  createdAt: string;
}

export interface GetItemsResponse {
  items: ItemResponse[];
}

export interface GetItemsParams {
  q?: string;
  category?: string;
  location?: string;
  sort?: string;
}

export async function getItemsRequest(params?: GetItemsParams): Promise<GetItemsResponse> {
  const response = await apiClient.get<GetItemsResponse>("/items", { params });
  return response.data;
}

export async function getItemByIdRequest(id: string): Promise<ItemResponse> {
  const response = await apiClient.get<ItemResponse>(`/items/${id}`);
  return response.data;
}
