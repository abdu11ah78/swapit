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
import { useAdminDisputes } from "@/features/admin/admin.hooks"
import { Loader2, Gavel, Scale, AlertCircle, CheckCircle2 } from "lucide-react"

export default function DisputesPage() {
  const { data: disputes, isLoading } = useAdminDisputes()

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
            Dispute <span className="text-[var(--admin-primary)]">Resolution</span>
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1 font-medium">
            Arbitrate conflicts and maintain platform integrity.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Cases & Evidence</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Linked Trade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes?.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-[var(--admin-text-muted)]">#{d.id.slice(-6).toUpperCase()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-[var(--admin-text)]">{d.reporterName}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="text-[var(--admin-text)]">{d.reason}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] cursor-pointer">
                      <Scale size={14} />
                      <span className="text-xs font-mono">#{d.tradeId.slice(-6).toUpperCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.status === 'Resolved' ? "success" : d.status === 'Open' ? "destructive" : "warning"} className="capitalize">
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="p-2 hover:bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] rounded-lg transition-colors group" title="Resolve Case">
                      <Gavel size={18} className="group-hover:-rotate-12 transition-transform" />
                    </button>
                    <button className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors group ml-2" title="Mark as Resolved">
                      <CheckCircle2 size={18} />
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
