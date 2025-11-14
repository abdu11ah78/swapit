"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../../components/ui/Table"
import { mockInvoices } from "../../lib/mockData"
import { formatCurrency, formatDate } from "../../lib/utils"
import { Download, Eye } from "lucide-react"

export default function InvoicesListPage() {
  return (
    <div className="pt-24 md:32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Invoice #</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid" ? "success" : invoice.status === "sent" ? "warning" : "error"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <motion.button whileHover={{ scale: 1.1 }} className="p-2 cursor-pointer hover:bg-secondary rounded-lg">
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} className="p-2 cursor-pointer hover:bg-secondary rounded-lg">
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
