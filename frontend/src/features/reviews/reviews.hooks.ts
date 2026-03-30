"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitReview,
  type SubmitReviewPayload,
} from "@/features/reviews/reviews.api";
import { tradesQueryKey } from "@/features/trades/trades.hooks";
import { toast } from "sonner";

export const reviewsQueryKey = ["reviews"] as const;

export function useSubmitReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) => submitReview(payload),
    onSuccess: () => {
      toast.success("Review submitted successfully.");
      queryClient.invalidateQueries({ queryKey: tradesQueryKey });
      queryClient.invalidateQueries({ queryKey: reviewsQueryKey });
    },
    onError: () => {
      toast.error("Failed to submit review.");
    },
  });
}
