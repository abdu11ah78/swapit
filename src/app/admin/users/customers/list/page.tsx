"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../../../components/ui/Table"
import { useAdmin } from "../../../context/AdminContext"
import { formatDate } from "../../../lib/utils"
import { Mail } from "lucide-react"

export default function CustomersListPage() {
  const { users } = useAdmin()
  const customers = users.filter((u) => u.role === "customer")

  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground">Manage customer accounts and data</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Joined</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {customer.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "active" ? "success" : "error"}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(customer.joinDate)}</TableCell>
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
