"use client"

import React from "react"
import { motion } from "framer-motion"
import { Package, SearchX, Plus, Edit3, Trash2 } from "lucide-react"
import Link from "next/link"

export default function MyPostsPage() {
    // Mock data for user's own posts
    const myPosts = [
        { id: 1, name: "Premium Mechanical Keyboard", price: "450 LTP", status: "Active", views: 124 },
        { id: 2, name: "Sony WH-1000XM4", price: "680 LTP", status: "Trade Pending", views: 89 }
    ]

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59]">
            <main className="max-w-7xl mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">Operational <span className="text-[#4d7c0f] not-italic">Assets</span></h1>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Your Active Listings</p>
                    </div>
                    <Link href="/post-asset">
                        <button className="px-10 py-5 bg-[#115e59] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#115e59]/20 hover:scale-105 transition-all flex items-center gap-3">
                            <Plus size={16} /> Deploy New Asset
                        </button>
                    </Link>
                </div>

                <div className="bg-white rounded-[3rem] p-1 shadow-2xl shadow-[#115e59]/5 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Valuation</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Node Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {myPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black text-[#115e59] uppercase tracking-tighter mb-1">{post.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.views} Market Interactions</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-sm font-black text-[#4d7c0f]">{post.price}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${post.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-3 text-[#115e59] hover:bg-[#115e59]/5 rounded-xl transition-all" title="Edit">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Recall">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
