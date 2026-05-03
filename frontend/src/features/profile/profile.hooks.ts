"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileRequest, getMyPostsRequest, updateProfileRequest, UpdateProfilePayload } from "./profile.api";
import { toast } from "sonner";

export function useProfileQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfileRequest,
    enabled,
  });
}

export function useMyPostsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ["profile", "posts"],
    queryFn: getMyPostsRequest,
    enabled,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfileRequest(payload),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update profile.");
    },
  });
}
