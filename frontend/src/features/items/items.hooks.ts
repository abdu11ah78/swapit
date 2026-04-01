"use client";

import { useQuery } from "@tanstack/react-query";
import { getItemsRequest, getItemByIdRequest, type GetItemsParams } from "./items.api";

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
