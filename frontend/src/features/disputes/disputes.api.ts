import { apiClient } from "@/api/axios";

export type CreateDisputePayload = {
  tradeId: string;
  reason: string;
  evidence?: string;
};

export type DisputeDto = {
  id: string;
  tradeId: string;
  reporterId: string;
  reviewerId: string | null;
  reason: string;
  evidence: string | null;
  status: string;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createDispute(
  payload: CreateDisputePayload,
): Promise<DisputeDto> {
  const { data } = await apiClient.post<DisputeDto>("/disputes", payload);
  return data;
}
