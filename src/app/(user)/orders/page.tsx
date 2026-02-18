"use client"

import React from "react"
import { motion } from "framer-motion"
import { ShoppingBag, SearchX, Clock, CheckCircle2, Truck } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
    const orders = [
        { id: "SW-8271", date: "Feb 12, 2026", item: "Custom Carbon Fiber Bike", status: "In Transit", points: 8500 },
        { id: "SW-7612", date: "Jan 28, 2026", item: "Mechanical Watch V2", status: "Completed", points: 1200 }
    ]

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59]">
            <main className="max-w-7xl mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">Barter <span className="text-[#4d7c0f] not-italic">Ledger</span></h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Protocol Transaction History</p>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-[#115e59]/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-[#115e59]/10 transition-all"
                        >
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#115e59]/20 group-hover:bg-[#115e59]/5 group-hover:text-[#115e59] transition-all">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Order {order.id} • {order.date}</h3>
                                    <p className="text-lg font-black text-[#115e59] uppercase tracking-tighter">{order.item}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Exchange Value</p>
                                    <p className="text-lg font-black text-[#4d7c0f]">{order.points} LTP</p>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                    {order.status === 'In Transit' ? <Truck size={14} className="text-[#115e59]" /> : <CheckCircle2 size={14} className="text-[#4d7c0f]" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {orders.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-50 shadow-inner">
                            <SearchX className="mx-auto text-slate-100 mb-6" size={48} />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No transactions recorded on this node.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
