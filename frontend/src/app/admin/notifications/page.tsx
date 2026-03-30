"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useAdmin } from "../context/AdminContext";

export default function NotificationsPage() {
  const { notifications } = useAdmin();

  return (
    <div className="pt-24 md:pt-32 space-y-6 bg-slate-950 min-h-screen px-4 pb-12">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white">
        Notifications Management
      </motion.h1>

      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">System Notifications</CardTitle>
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">Trigger Manual Notification</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm">{n.message}</p>
                <p className="text-slate-400 text-xs mt-1">{n.createdAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{n.type}</Badge>
                <Badge variant={n.read ? "success" : "warning"}>{n.read ? "Read" : "Unread"}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
