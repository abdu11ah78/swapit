"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDispute,
  type CreateDisputePayload,
} from "@/features/disputes/disputes.api";
import { tradesQueryKey } from "@/features/trades/trades.hooks";
import { toast } from "sonner";

export const disputesQueryKey = ["disputes"] as const;

export function useCreateDisputeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDisputePayload) => createDispute(payload),
    onSuccess: () => {
      toast.success("Dispute opened successfully.");
      queryClient.invalidateQueries({ queryKey: tradesQueryKey });
      queryClient.invalidateQueries({ queryKey: disputesQueryKey });
    },
    onError: () => {
      toast.error("Failed to open dispute.");
    },
  });
}
