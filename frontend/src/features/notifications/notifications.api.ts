import { apiClient } from "@/api/axios";

export type NotificationDto = {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  notifications: NotificationDto[];
};

export type CreateNotificationPayload = {
  userId: string;
  type:
    | "INFO"
    | "NEW_MESSAGE"
    | "OFFER_RECEIVED"
    | "OFFER_UPDATED"
    | "OFFER_ACCEPTED"
    | "OFFER_REJECTED"
    | "TRADE_UPDATE"
    | "SMART_MATCH"
    | "DISPUTE_UPDATE"
    | "ITEM_VIEW"
    | "ITEM_LIKED";
  message: string;
};

export async function getNotifications(): Promise<NotificationsResponse> {
  const { data } = await apiClient.get<NotificationsResponse>("/notifications");
  return data;
}

export async function createNotification(
  payload: CreateNotificationPayload,
): Promise<NotificationDto> {
  const { data } = await apiClient.post<NotificationDto>("/notifications", payload);
  return data;
}

export async function markNotificationRead(id: string): Promise<NotificationDto> {
  const { data } = await apiClient.patch<NotificationDto>("/notifications", { id });
  return data;
}
