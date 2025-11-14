"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../admin/components/ui/Card"
import { Activity, BarChart3, TrendingUp, Users, AlertCircle } from "lucide-react"

const widgets = [
  { icon: Activity, label: "Real-time Activity", description: "Monitor live user interactions" },
  { icon: TrendingUp, label: "Sales Analytics", description: "Track sales trends and patterns" },
  { icon: Users, label: "User Management", description: "Manage user accounts and roles" },
  { icon: BarChart3, label: "Reports", description: "Generate business reports" },
  { icon: AlertCircle, label: "Alerts & Notifications", description: "System alerts and warnings" },
]

export default function WidgetsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Widgets</h1>
        <p className="text-muted-foreground">Customize your dashboard with these widgets</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {widgets.map((widget, idx) => {
          const Icon = widget.icon
          return (
            <motion.div
              key={widget.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-all whileHover={{ scale: 1.02 }}">
                <CardContent className="pt-6">
                  <div className="p-4 bg-primary/20 rounded-lg w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{widget.label}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{widget.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
