import { apiClient } from "@/api/axios";

export type OfferDto = {
  id: string;
  tradeId: string;
  makerId: string;
  offeredLtp: number;
  message: string | null;
  status: string;
  expiresAt: string | null;
  offeredItemId: string | null;
  parentOfferId: string | null;
  tradeTitle?: string;
  itemIds: string[];
  createdAt: string;
};

export type CreateOfferPayload = {
  tradeId: string;
  offeredLtp: number;
  offeredItemId?: string;
  offeredItemIds?: string[];
  message?: string;
  expiresAt?: string;
  parentOfferId?: string;
};

export type DecideOfferPayload = {
  offerId: string;
  action: "ACCEPT" | "REJECT" | "COUNTER";
};

type OffersResponse = {
  offers: OfferDto[];
};

export async function getOffers(): Promise<OffersResponse> {
  const { data } = await apiClient.get<OffersResponse>("/offers");
  return data;
}

export async function createOffer(payload: CreateOfferPayload): Promise<OfferDto> {
  const { data } = await apiClient.post<OfferDto>("/offers", payload);
  return data;
}

export async function decideOffer(payload: DecideOfferPayload): Promise<OfferDto> {
  const { data } = await apiClient.patch<OfferDto>("/offers", payload);
  return data;
}
