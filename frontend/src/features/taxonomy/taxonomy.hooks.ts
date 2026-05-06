"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getProvinces } from "./taxonomy.api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
