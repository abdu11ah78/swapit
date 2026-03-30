"use client";

import { Bell, RefreshCcw } from "lucide-react";
import {
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/notifications.hooks";
import { NotificationsList } from "@/features/notifications/components/NotificationsList";

export default function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();

  const notifications = data?.notifications ?? [];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#115e59] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#4d7c0f]" />
            Notifications
          </h1>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-[#115e59] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="text-slate-500 font-bold">Loading notifications...</p>
        ) : isError ? (
          <p className="text-red-500 font-bold">
            Unable to load notifications right now.
          </p>
        ) : (
          <NotificationsList
            notifications={notifications}
            isUpdating={markReadMutation.isPending}
            onMarkRead={(id) => markReadMutation.mutate(id)}
          />
        )}
      </div>
    </div>
  );
}
