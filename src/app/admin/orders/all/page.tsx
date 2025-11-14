"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../../components/ui/Table"
import { useAdmin } from "../../context/AdminContext"
import { formatCurrency, formatDate } from "../../lib/utils"
import { Eye, Download } from "lucide-react"

export default function AllOrdersPage() {
  const { orders } = useAdmin()

  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">All Orders</h1>
        <p className="text-muted-foreground">Total: {orders.length} orders</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Order #</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Total</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Payment</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "success"
                            : order.status === "processing"
                              ? "warning"
                              : order.status === "pending"
                                ? "info"
                                : "error"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.paymentStatus === "paid"
                            ? "success"
                            : order.paymentStatus === "pending"
                              ? "warning"
                              : "error"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
