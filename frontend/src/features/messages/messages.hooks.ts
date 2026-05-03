"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getChatMessages,
  sendMessage,
  type SendMessagePayload,
} from "@/features/messages/messages.api";

export const conversationsQueryKey = ["conversations"] as const;
export const chatMessagesQueryKey = (userId: string) => ["chatMessages", userId] as const;

export function useConversationsQuery(enabled = true) {
  return useQuery({
    queryKey: conversationsQueryKey,
    queryFn: getConversations,
    enabled,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function useChatMessagesQuery(userId: string | null, enabled = true) {
  return useQuery({
    queryKey: chatMessagesQueryKey(userId ?? ""),
    queryFn: () => getChatMessages(userId!),
    enabled: enabled && !!userId,
    refetchInterval: 5000, // Poll every 5 seconds for live chat feel
  });
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey(variables.receiverId) });
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
    },
  });
}
