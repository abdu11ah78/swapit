import { apiClient } from "@/api/axios";

export type TradeEventDto = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  actorId: string | null;
  note: string | null;
  createdAt: string;
};

export type TradeDto = {
  id: string;
  buyerId: string;
  sellerId: string;
  itemId: string;
  status: string;
  escrowHold: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lifecycle: TradeEventDto[];
  offers?: {
    id: string;
    tradeId: string;
    makerId: string;
    offeredLtp: number;
    message: string | null;
    status: string;
    expiresAt: string | null;
    offeredItemId: string | null;
    parentOfferId: string | null;
    itemIds: string[];
    createdAt: string;
  }[];
};

type TradesResponse = {
  trades: TradeDto[];
};

export type CreateTradePayload = {
  itemId: string;
  sellerId: string;
};

export type UpdateTradeStatusPayload = {
  tradeId: string;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "DISPUTED"
    | "CANCELLED";
  note?: string;
};

export async function getTrades(): Promise<TradesResponse> {
  const { data } = await apiClient.get<TradesResponse>("/trades");
  return data;
}

export async function createTrade(payload: CreateTradePayload): Promise<TradeDto> {
  const { data } = await apiClient.post<TradeDto>("/trades", payload);
  return data;
}

export async function updateTradeStatus(
  payload: UpdateTradeStatusPayload,
): Promise<TradeDto> {
  const { tradeId, ...body } = payload;
  const { data } = await apiClient.patch<TradeDto>(
    `/trades/${tradeId}/status`,
    body,
  );
  return data;
}
