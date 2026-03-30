"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOffer,
  decideOffer,
  getOffers,
  type CreateOfferPayload,
  type DecideOfferPayload,
} from "@/features/offers/offers.api";
import { tradesQueryKey } from "@/features/trades/trades.hooks";
import { toast } from "sonner";

export const offersQueryKey = ["offers"] as const;

export function useOffersQuery() {
  return useQuery({
    queryKey: offersQueryKey,
    queryFn: getOffers,
  });
}

export function useCreateOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOfferPayload) => createOffer(payload),
    onSuccess: () => {
      toast.success("Offer sent successfully!");
      queryClient.invalidateQueries({ queryKey: tradesQueryKey });
      queryClient.invalidateQueries({ queryKey: offersQueryKey });
    },
    onError: () => {
      toast.error("Failed to send offer.");
    },
  });
}

export function useDecideOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DecideOfferPayload) => decideOffer(payload),
    onSuccess: () => {
      toast.success("Offer updated successfully.");
      queryClient.invalidateQueries({ queryKey: tradesQueryKey });
      queryClient.invalidateQueries({ queryKey: offersQueryKey });
    },
    onError: () => {
      toast.error("Failed to update offer.");
    },
  });
}
