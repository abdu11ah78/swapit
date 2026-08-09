"use client"

import { useAdminSuggestions, useApproveSuggestion } from "@/features/admin/admin.hooks"
import { motion } from "framer-motion"
import { Check, X, HelpCircle, User, Clock, Tag } from "lucide-react"

export default function AdminSuggestionsPage() {
    const { data: suggestions = [], isLoading } = useAdminSuggestions()
    const approveMutation = useApproveSuggestion()

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#115e59] tracking-tighter uppercase">Community <span className="text-[#4d7c0f]">Suggestions</span></h1>
                    <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase mt-1">Review user requests for new taxonomy nodes</p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suggestions.map((s: any) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-[#115e59]/5 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#4d7c0f]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3 rounded-2xl ${s.type === 'Category' ? 'bg-[#115e59]/10 text-[#115e59]' : 'bg-[#4d7c0f]/10 text-[#4d7c0f]'}`}>
                                    {s.type === 'Category' ? <Tag size={20} /> : <HelpCircle size={20} />}
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{s.type}</span>
                                    {s.isApproved && (
                                        <div className="flex items-center gap-1 text-[#4d7c0f] justify-end">
                                            <Check size={10} />
                                            <span className="text-[9px] font-black uppercase">Approved</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-[#115e59] tracking-tight mb-4">{s.name}</h3>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <User size={14} />
                                    <span className="text-[10px] font-bold uppercase">{s.userName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-bold uppercase">{new Date(s.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {!s.isApproved && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => approveMutation.mutate(s.id)}
                                        disabled={approveMutation.isPending}
                                        className="flex-1 bg-[#115e59] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#4d7c0f] transition-all"
                                    >
                                        Approve
                                    </button>
                                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {suggestions.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <HelpCircle className="mx-auto text-slate-200 mb-4" size={48} />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No pending suggestions found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
