"use client";

import { type NotificationDto } from "@/features/notifications/notifications.api";
import { Bell, Eye, Heart, ShoppingBag, MessageCircle, Sparkles, AlertTriangle, Info, ArrowRightLeft, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Props = {
  notifications: NotificationDto[];
  onMarkRead: (id: string) => void;
  isUpdating: boolean;
};

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  INFO: { icon: <Info size={16} />, color: "text-blue-500", bgColor: "bg-blue-50", label: "Info" },
  NEW_MESSAGE: { icon: <MessageCircle size={16} />, color: "text-[#115e59]", bgColor: "bg-[#115e59]/5", label: "Message" },
  OFFER_RECEIVED: { icon: <ShoppingBag size={16} />, color: "text-[#4d7c0f]", bgColor: "bg-[#4d7c0f]/10", label: "New Offer" },
  OFFER_UPDATED: { icon: <ArrowRightLeft size={16} />, color: "text-amber-600", bgColor: "bg-amber-50", label: "Offer Updated" },
  OFFER_ACCEPTED: { icon: <CheckCircle size={16} />, color: "text-emerald-600", bgColor: "bg-emerald-50", label: "Accepted" },
  OFFER_REJECTED: { icon: <AlertTriangle size={16} />, color: "text-red-500", bgColor: "bg-red-50", label: "Rejected" },
  TRADE_UPDATE: { icon: <ArrowRightLeft size={16} />, color: "text-indigo-600", bgColor: "bg-indigo-50", label: "Trade" },
  SMART_MATCH: { icon: <Sparkles size={16} />, color: "text-[#4d7c0f]", bgColor: "bg-[#4d7c0f]/10", label: "Smart Match" },
  DISPUTE_UPDATE: { icon: <AlertTriangle size={16} />, color: "text-orange-600", bgColor: "bg-orange-50", label: "Dispute" },
  ITEM_VIEW: { icon: <Eye size={16} />, color: "text-slate-500", bgColor: "bg-slate-50", label: "View" },
  ITEM_LIKED: { icon: <Heart size={16} />, color: "text-pink-500", bgColor: "bg-pink-50", label: "Liked" },
};

const defaultConfig = { icon: <Bell size={16} />, color: "text-slate-400", bgColor: "bg-slate-50", label: "Notification" };

export function NotificationsList({
  notifications,
  onMarkRead,
  isUpdating,
}: Props) {
  if (notifications.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 bg-[#115e59]/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <Bell className="w-10 h-10 text-[#115e59]/15" />
        </div>
        <h3 className="text-xl font-black text-[#115e59] uppercase tracking-tighter mb-2">All Clear</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No notifications to show</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => {
        const config = typeConfig[n.type?.toUpperCase()] ?? defaultConfig;
        return (
          <div
            key={n.id}
            className={`rounded-3xl border p-5 flex items-center gap-4 transition-all ${n.read ? 'bg-white border-slate-100 opacity-70' : 'bg-white border-slate-200 shadow-sm'}`}
          >
            <div className={`w-12 h-12 rounded-2xl ${config.bgColor} flex items-center justify-center flex-shrink-0 ${config.color}`}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#115e59] leading-snug">{n.message}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className={`text-[8px] px-2 py-0.5 rounded-full ${config.bgColor} ${config.color} font-black uppercase tracking-widest`}>
                  {config.label}
                </span>
                <span className="text-[9px] text-slate-400 font-bold">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {n.read ? (
                <span className="text-[9px] px-3 py-1.5 rounded-full bg-slate-50 text-slate-400 font-black uppercase tracking-widest">
                  Read
                </span>
              ) : (
                <button
                  onClick={() => onMarkRead(n.id)}
                  disabled={isUpdating}
                  className="text-[9px] px-4 py-2 rounded-full bg-[#115e59] text-white font-black uppercase tracking-widest hover:bg-[#134e4a] transition-all active:scale-95 disabled:opacity-60"
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
