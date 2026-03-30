"use client";

import { type NotificationDto } from "@/features/notifications/notifications.api";

type Props = {
  notifications: NotificationDto[];
  onMarkRead: (id: string) => void;
  isUpdating: boolean;
};

export function NotificationsList({
  notifications,
  onMarkRead,
  isUpdating,
}: Props) {
  if (notifications.length === 0) {
    return <p className="text-slate-500 font-bold">No notifications found.</p>;
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="rounded-lg border border-slate-200 bg-white p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-[#115e59] text-sm font-semibold">{n.message}</p>
            <p className="text-slate-400 text-xs mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 font-bold">
              {n.type}
            </span>
            {n.read ? (
              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                Read
              </span>
            ) : (
              <button
                onClick={() => onMarkRead(n.id)}
                disabled={isUpdating}
                className="text-[10px] px-3 py-1 rounded-full bg-[#115e59] text-white font-bold disabled:opacity-60"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
