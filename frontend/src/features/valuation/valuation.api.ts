import { apiClient } from "@/api/axios";

export interface AppraiseRequest {
  description: string;
  mileage: number;
  damageCount: number;
  anchorPricePkr?: number;
}

export interface AppraiseResponse {
  retentionPct: number;
  estimatedValuePkr: number;
  anchorPricePkr: number;
  confidence: "High" | "Medium" | "Low";
}

export async function appraiseItem(
  data: AppraiseRequest
): Promise<AppraiseResponse> {
  const response = await apiClient.post<AppraiseResponse>(
    "/valuation/appraise",
    {
      description: data.description,
      mileage: data.mileage,
      damageCount: data.damageCount,
      anchorPricePkr: data.anchorPricePkr ?? 238500,
    }
  );
  return response.data;
}
