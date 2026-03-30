import { apiClient } from "@/api/axios";

export type SubmitReviewPayload = {
  tradeId: string;
  targetId: string;
  rating: number;
  comment?: string;
};

export type ReviewDto = {
  id: string;
  authorId: string;
  targetId: string;
  tradeId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  trustScore: number;
};

export async function submitReview(
  payload: SubmitReviewPayload,
): Promise<ReviewDto> {
  const { data } = await apiClient.post<ReviewDto>("/reviews", payload);
  return data;
}
