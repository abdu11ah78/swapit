"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/Table"
import { useAdminTrades } from "@/features/admin/admin.hooks"
import { Loader2, RefreshCw, Handshake, ShieldCheck, ShieldAlert } from "lucide-react"

export default function TradesPage() {
  const { data: trades, isLoading } = useAdminTrades()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[var(--admin-primary)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--admin-text)] tracking-tight">
            Trade <span className="text-[var(--admin-primary)]">Management</span>
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1 font-medium">
            Oversight of all marketplace transactions and escrow holds.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trade ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Escrow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-[var(--admin-text-muted)]">#{t.id.slice(-6).toUpperCase()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Handshake size={16} className="text-[var(--admin-primary)]" />
                      <span className="font-bold text-[var(--admin-text)]">{t.mainItemTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[var(--admin-text)]">{t.buyerName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[var(--admin-text)]">{t.sellerName}</span>
                  </TableCell>
                  <TableCell>
                    {t.escrowHold ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-black uppercase">Secured</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[var(--admin-text-muted)]">
                        <ShieldAlert size={16} />
                        <span className="text-xs font-black uppercase">None</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'Completed' ? "success" : t.status === 'Cancelled' ? "destructive" : "warning"} className="capitalize">
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="p-2 hover:bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] rounded-lg transition-colors group" title="Update Status">
                      <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
