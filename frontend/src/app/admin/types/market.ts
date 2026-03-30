export interface Offer {
  id: string;
  tradeId: string;
  fromUser: string;
  toUser: string;
  offeredItems: number;
  offeredLtp: number;
  status: "open" | "countered" | "accepted" | "rejected" | "expired";
  createdAt: string;
  suspicious?: boolean;
}

export interface Dispute {
  id: string;
  tradeId: string;
  reporter: string;
  reason: string;
  status: "open" | "under_review" | "resolved" | "rejected";
  evidenceCount: number;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  type: "info" | "offer" | "trade" | "dispute" | "smart_match";
  message: string;
  createdAt: string;
  read: boolean;
}
