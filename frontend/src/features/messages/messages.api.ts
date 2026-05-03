import { apiClient } from "@/api/axios";

// --- Types ---

export type ConversationDto = {
  userId: string;
  userName: string;
  userImage: string | null;
  userTrustScore: number;
  lastMessage: string;
  lastMessageAt: string;
  isOnline: boolean;
};

export type MessageDto = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  isMine: boolean;
  createdAt: string;
};

type ConversationsResponse = {
  conversations: ConversationDto[];
};

type ChatMessagesResponse = {
  messages: MessageDto[];
};

export type SendMessagePayload = {
  receiverId: string;
  content: string;
};

// --- API Calls ---

export async function getConversations(): Promise<ConversationsResponse> {
  const { data } = await apiClient.get<ConversationsResponse>("/messages/conversations");
  return data;
}

export async function getChatMessages(userId: string): Promise<ChatMessagesResponse> {
  const { data } = await apiClient.get<ChatMessagesResponse>(`/messages/${userId}`);
  return data;
}

export async function sendMessage(payload: SendMessagePayload): Promise<MessageDto> {
  const { data } = await apiClient.post<MessageDto>("/messages", payload);
  return data;
}
