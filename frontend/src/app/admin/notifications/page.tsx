"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Loader2, Bell, Send, CheckCircle, Info, AlertTriangle } from "lucide-react"

// For now using mock notifications until backend is ready, 
// but implementing the theme correctly
const mockNotifications = [
  { id: 1, type: "Info", message: "New user registration: Alex Rivera", createdAt: "2 mins ago", read: false },
  { id: 2, type: "Alert", message: "High volume of trade reports in Electronics", createdAt: "1 hour ago", read: true },
  { id: 3, type: "Update", message: "System maintenance scheduled for 2 AM UTC", createdAt: "5 hours ago", read: false },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--admin-text)] tracking-tight">
            System <span className="text-[var(--admin-primary)]">Notifications</span>
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1 font-medium">
            Manage global alerts and system-wide communications.
          </p>
        </div>
        <button className="admin-button-primary flex items-center gap-2">
          <Send size={18} />
          <span>Broadcast Message</span>
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Alert Stream</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-6">
          {mockNotifications.map((n) => (
            <motion.div 
              key={n.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] hover:border-[var(--admin-primary)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  n.type === "Alert" ? "bg-red-500/10 text-red-500" :
                  n.type === "Info" ? "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]" :
                  "bg-blue-500/10 text-blue-500"
                }`}>
                  {n.type === "Alert" ? <AlertTriangle size={20} /> :
                   n.type === "Info" ? <Info size={20} /> :
                   <Bell size={20} />}
                </div>
                <div>
                  <p className="font-bold text-[var(--admin-text)]">{n.message}</p>
                  <p className="text-xs text-[var(--admin-text-muted)] mt-1 font-medium">{n.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={n.type === "Alert" ? "warning" : "secondary"}>
                  {n.type}
                </Badge>
                {!n.read && (
                  <div className="w-2 h-2 bg-[var(--admin-primary)] rounded-full animate-pulse" />
                )}
                <button className="p-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors opacity-0 group-hover:opacity-100">
                  <CheckCircle size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
