"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../../components/ui/Table"
import { useAdmin } from "../../context/AdminContext"
import { formatDate } from "../../lib/utils"
import { Eye, Terminal, Download, ShieldCheck, RefreshCw } from "lucide-react"

export default function GlobalSwapLedgerPage() {
  const { orders } = useAdmin()

  return (
    <div className="pt-24 md:pt-32 space-y-8 bg-slate-950 min-h-screen px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full" />
            Global Swap Ledger
          </h1>
          <p className="text-slate-500 font-mono text-[10px] mt-1 uppercase tracking-widest">
            SYNCHRONIZED WITH MAINNODE-ASSET-LOG // TOTAL PROTOCOL SWAPS: {orders.length}
          </p>
        </div>
        <button className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2">
          <Download size={14} />
          Export Ledger
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
          <CardContent className="pt-6 overflow-x-auto">
            <Table>
              <TableHead className="border-b border-slate-800">
                <TableRow>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4">Handshake ID</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4">Authorized Trader</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4">Value (LTC)</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4">Protocol Status</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4">Escrow State</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4">Timestamp</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4 text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-indigo-500" />
                        <span className="font-mono text-xs font-black text-white tracking-widest">{order.orderNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <span className="text-slate-500 text-[8px] font-black">NODE</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase italic">{order.customer}</p>
                          <p className="text-[9px] text-slate-500 font-bold tracking-tighter">{order.customerEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 font-black text-indigo-400 text-sm tracking-tighter">
                      {order.total.toLocaleString()} LTC
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge
                        className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${order.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : order.status === "processing"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : order.status === "pending"
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                      >
                        {order.status === "completed" ? "Validated" : order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge
                        className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${order.paymentStatus === "paid"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : order.paymentStatus === "pending"
                              ? "bg-slate-800/50 text-slate-500 border-slate-700"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                      >
                        {order.paymentStatus === "paid" ? "Handshake Confirmed" : "Awaiting Bond"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 font-mono text-[10px] text-slate-500 font-bold uppercase">
                      {formatDate(order.date)}
                    </TableCell>
                    <TableCell className="py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-indigo-400 border border-slate-800 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-emerald-400 border border-slate-800 rounded-lg transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
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

      {/* Protocol Health Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-slate-900/30 border-slate-800 p-4 flex items-center gap-4 group hover:border-indigo-500/30 transition-colors cursor-pointer">
          <div className="bg-indigo-600/10 p-3 rounded-xl">
            <RefreshCw className="text-indigo-500 w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Sync</p>
            <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">Last Sync: 2 minutes ago</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
