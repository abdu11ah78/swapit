import { useQuery, useMutation } from "@tanstack/react-query";
import { getCategories, getProvinces, submitSuggestion, type SuggestionPayload } from "./taxonomy.api";
import { toast } from "sonner";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
  });
}

export function useSubmitSuggestion() {
  return useMutation({
    mutationFn: (payload: SuggestionPayload) => submitSuggestion(payload),
    onSuccess: () => {
      toast.success("Suggestion submitted for approval.");
    },
    onError: () => {
      toast.error("Failed to submit suggestion.");
    },
  });
}
