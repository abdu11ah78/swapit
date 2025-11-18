"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../../components/ui/Table"
import { formatCurrency, formatDate } from "../../lib/utils"

const purchases = [
  { id: 1, vendor: "Supplier A", items: 150, total: 5000, date: "2024-11-05", status: "delivered" },
  { id: 2, vendor: "Supplier B", items: 200, total: 8000, date: "2024-11-03", status: "in-transit" },
]

export default function PurchasesListPage() {
  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Purchases</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Vendor</TableHeader>
                  <TableHeader>Items</TableHeader>
                  <TableHeader>Total</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.vendor}</TableCell>
                    <TableCell>{purchase.items}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(purchase.total)}</TableCell>
                    <TableCell>{formatDate(purchase.date)}</TableCell>
                    <TableCell>
                      <Badge variant={purchase.status === "delivered" ? "success" : "warning"}>{purchase.status}</Badge>
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
