"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTrade,
  type CreateTradePayload,
  getTrades,
  updateTradeStatus,
  type UpdateTradeStatusPayload,
} from "@/features/trades/trades.api";
import { toast } from "sonner";

export const tradesQueryKey = ["trades"] as const;

export function useTradesQuery() {
  return useQuery({
    queryKey: tradesQueryKey,
    queryFn: getTrades,
  });
}

export function useCreateTradeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTradePayload) => createTrade(payload),
    onSuccess: () => {
      toast.success("Trade created successfully.");
      queryClient.invalidateQueries({ queryKey: tradesQueryKey });
    },
    onError: () => {
      toast.error("Failed to create trade.");
    },
  });
}

export function useUpdateTradeStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTradeStatusPayload) => updateTradeStatus(payload),
    onSuccess: () => {
      toast.success("Trade updated successfully.");
      queryClient.invalidateQueries({ queryKey: tradesQueryKey });
    },
    onError: () => {
      toast.error("Failed to update trade.");
    },
  });
}
