"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Badge } from "../../components/ui/Badge"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../../components/ui/Table"
import { Edit2, Trash2, Search, Plus, Eye, Box, Cpu, ShieldAlert } from "lucide-react"
import { useAdmin } from "../../context/AdminContext"
import Link from "next/link"

export default function AssetRegistryPage() {
  const { products, deleteProduct } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Execute node termination? This asset will be purged from the protocol.")) {
      deleteProduct(id)
    }
  }

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
            Asset Node Registry
          </h1>
          <p className="text-slate-500 font-mono text-[10px] mt-1 uppercase tracking-widest">
            NODE OVERVIEW: ACTIVE ASSETS // NETWORK STATUS: VERIFIED
          </p>
        </div>
        <Link href="/admin/products/create">
          <button className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2 hover:bg-indigo-500 transition-all">
            <Plus size={14} />
            Authorize New Node
          </button>
        </Link>
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl group hover:border-indigo-500/30 transition-colors">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="Scan registry by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-slate-950/50 border-slate-800 text-white text-xs h-12 rounded-xl focus:border-indigo-500 transition-colors placeholder:text-slate-600 font-mono tracking-widest uppercase"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assets Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
          <CardContent className="pt-6 overflow-x-auto">
            <Table>
              <TableHead className="border-b border-slate-800">
                <TableRow>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4 bg-transparent border-none">Asset ID / Name</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4 bg-transparent border-none">Protocol SKU</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4 bg-transparent border-none">Node Class</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4 bg-transparent border-none">Valuation (LTC)</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4 bg-transparent border-none">Node Count</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4 bg-transparent border-none">Network State</TableHeader>
                  <TableHeader className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-4 bg-transparent border-none text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center p-1 overflow-hidden relative">
                            {product.image ? (
                              <img src={product.image} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                            ) : (
                              <Box size={16} className="text-slate-600" />
                            )}
                          </div>
                          <span className="text-xs font-black text-white tracking-widest uppercase italic">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 font-mono text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {product.sku}
                      </TableCell>
                      <TableCell className="py-5">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{product.category}</span>
                      </TableCell>
                      <TableCell className="py-5 font-black text-indigo-400 text-sm tracking-tighter">
                        {product.price.toLocaleString()} LTC
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black ${product.stock > 10 ? "text-emerald-500" : "text-amber-500"}`}>
                            {product.stock}
                          </span>
                          <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Active Nodes</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${product.status === "active"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : product.status === "draft"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                            }`}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 text-right">
                        <div className="flex items-center justify-end gap-2 text-indigo-400">
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 border border-slate-800 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <Link href={`/admin/products/edit`}>
                            <motion.button
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(129, 140, 248, 0.1)" }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product.id)}
                            className="p-2 border border-slate-800 text-red-500 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Node Alert Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-amber-500/5 border-amber-500/20 p-4 flex items-center gap-4 group hover:bg-amber-500/10 transition-colors cursor-pointer">
          <div className="bg-amber-600/10 p-3 rounded-xl border border-amber-500/20">
            <ShieldAlert className="text-amber-500 w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Low Node Frequency</p>
            <p className="text-[8px] text-amber-500/60 font-bold uppercase mt-0.5">3 Assets require replenishment</p>
          </div>
        </Card>
      </div>
    </div>
  )
}