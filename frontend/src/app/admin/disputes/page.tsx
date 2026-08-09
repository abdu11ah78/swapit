"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { useAdminDisputes, useUpdateDisputeStatus } from "@/features/admin/admin.hooks"
import { Loader2, Gavel, Scale, AlertCircle, CheckCircle2, X, User } from "lucide-react"

export default function DisputesPage() {
  const { data: disputes, isLoading } = useAdminDisputes()
  const updateDispute = useUpdateDisputeStatus()

  const [resolveModal, setResolveModal] = useState<{ id: string; action: "Resolved" | "Closed" } | null>(null)
  const [resolution, setResolution] = useState("")

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolveModal) return
    await updateDispute.mutateAsync({
      disputeId: resolveModal.id,
      status: resolveModal.action,
      resolution
    })
    setResolveModal(null)
    setResolution("")
  }

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
          <CardTitle>Open Cases &amp; Evidence</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes?.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-[var(--admin-text-muted)">#{d.id.slice(-6).toUpperCase()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-[var(--admin-text)]">{d.reporterName}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                      <span className="text-[var(--admin-text)] line-clamp-2 max-w-[200px]">{d.reason}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {d.tradeId ? (
                      <div className="flex items-center gap-1 text-[var(--admin-text-muted)]">
                        <Scale size={14} />
                        <span className="text-xs font-mono">#{d.tradeId.slice(-6).toUpperCase()}</span>
                      </div>
                    ) : d.reportedUserName ? (
                      <div className="flex items-center gap-1 text-[var(--admin-text-muted)]">
                        <User size={14} />
                        <span className="text-xs">{d.reportedUserName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--admin-text-muted)]">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.status === 'Resolved' ? "success" : d.status === 'Open' ? "destructive" : "warning"} className="capitalize">
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {d.status === 'Open' && (
                      <>
                        <button
                          onClick={() => setResolveModal({ id: d.id, action: "Resolved" })}
                          className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors group"
                          title="Mark as Resolved"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => setResolveModal({ id: d.id, action: "Closed" })}
                          className="p-2 hover:bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] rounded-lg transition-colors group ml-2"
                          title="Close Case"
                        >
                          <Gavel size={18} className="group-hover:-rotate-12 transition-transform" />
                        </button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resolve Modal */}
      <AnimatePresence>
        {resolveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative"
            >
              <button
                onClick={() => { setResolveModal(null); setResolution("") }}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-black text-slate-800 mb-2">
                {resolveModal.action === "Resolved" ? "Resolve Case" : "Close Case"}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Provide a resolution note. If this is an account reopening request set to &quot;Resolved&quot;, the user will be automatically unbanned.
              </p>
              <form onSubmit={handleResolve} className="space-y-4">
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Enter resolution details..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#115e59]/20 text-sm resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={updateDispute.isPending}
                  className="w-full py-3 bg-[#115e59] text-white font-black text-xs tracking-widest rounded-2xl disabled:opacity-50 hover:bg-[#4d7c0f] transition-colors"
                >
                  {updateDispute.isPending ? "UPDATING..." : `CONFIRM ${resolveModal.action.toUpperCase()}`}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

