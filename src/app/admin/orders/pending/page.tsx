"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { useAdmin } from "../../context/AdminContext"
import { formatDate, formatCurrency } from "../../lib/utils"

export default function PendingOrdersPage() {
  const { orders } = useAdmin()
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing")

  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Pending Orders</h1>
        <p className="text-muted-foreground">Manage orders that need attention</p>
      </motion.div>

      <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {pendingOrders.map((order) => (
          <motion.div key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-bold text-foreground">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="warning">{order.status}</Badge>
                    <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
