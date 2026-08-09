"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getItemsRequest, getItemByIdRequest, createItemRequest, deleteItemRequest, type GetItemsParams, type CreateItemPayload } from "./items.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useItemsQuery(params?: GetItemsParams) {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => getItemsRequest(params),
  });
}

export function useItemByIdQuery(id: string) {
  return useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemByIdRequest(id),
    enabled: !!id,
  });
}

export function useCreateItemMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateItemPayload) => createItemRequest(payload),
    onSuccess: () => {
      toast.success("Item posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "posts"] });
      router.push("/my-posts");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to post item");
    },
  });
}

export function useDeleteItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItemRequest(id),
    onSuccess: () => {
      toast.success("Item removed from ledger.");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "posts"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete item");
    },
  });
}

