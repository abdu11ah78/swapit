"use client"

import React from "react"
import { motion } from "framer-motion"
import { Package, SearchX, Plus, Edit3, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useMyPostsQuery } from "@/features/profile/profile.hooks"
import { useDeleteItemMutation } from "@/features/items/items.hooks"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') ?? "https://localhost:7052";

export default function MyPostsPage() {
    const { data: myPosts, isLoading } = useMyPostsQuery()
    const deleteItemMutation = useDeleteItemMutation()

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to remove this item from the exchange?")) {
            await deleteItemMutation.mutateAsync(id)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <Loader2 className="w-10 h-10 text-[#115e59] animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59]">
            <main className="max-w-7xl mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">My <span className="text-[#4d7c0f] not-italic">Listings</span></h1>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Manage your active ads</p>
                    </div>
                    <Link href="/post-asset">
                        <button className="px-10 py-5 bg-[#115e59] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#115e59]/20 hover:scale-105 transition-all flex items-center gap-3">
                            <Plus size={16} /> Post New Ad
                        </button>
                    </Link>
                </div>

                {!myPosts || myPosts.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 shadow-2xl shadow-[#115e59]/5 border border-slate-100 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SearchX className="text-slate-300" size={40} />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-[#115e59] mb-2">No active listings</h2>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-8">You haven&apos;t posted any items yet.</p>
                        <Link href="/post-asset">
                            <button className="px-8 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#115e59] hover:text-white transition-all">
                                Create Your First Listing
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-1 shadow-2xl shadow-[#115e59]/5 border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-50 bg-slate-50/50">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Item Identity</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Valuation</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {myPosts.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-[#115e59] uppercase tracking-tighter mb-1">{post.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.category} • {post.location}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-sm font-black text-[#4d7c0f]">{post.ltpValue} LTP</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${post.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-3 text-[#115e59] hover:bg-[#115e59]/5 rounded-xl transition-all" title="Edit">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(post.id)}
                                                        disabled={deleteItemMutation.isPending}
                                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50" 
                                                        title="Delete"
                                                    >
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
                )}
            </main>
        </div>
    )
}
