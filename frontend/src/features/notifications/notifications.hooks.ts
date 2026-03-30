"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  getNotifications,
  markNotificationRead,
  type CreateNotificationPayload,
} from "@/features/notifications/notifications.api";
import { toast } from "sonner";

export const notificationsQueryKey = ["notifications"] as const;

export function useNotificationsQuery(enabled = true) {
  return useQuery({
    queryKey: notificationsQueryKey,
    queryFn: getNotifications,
    enabled,
  });
}

export function useCreateNotificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNotificationPayload) => createNotification(payload),
    onSuccess: () => {
      toast.success("Notification sent.");
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
    onError: () => {
      toast.error("Failed to send notification.");
    },
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      toast.success("Notification marked as read.");
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
    onError: () => {
      toast.error("Failed to update notification.");
    },
  });
}
