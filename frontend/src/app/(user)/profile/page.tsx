"use client"

import React from "react"
import { motion } from "framer-motion"
import { User, Mail, MapPin, Shield, Edit3, Loader2 } from "lucide-react"
import { useProfileQuery } from "@/features/profile/profile.hooks"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
    const { data: user, isLoading } = useProfileQuery()
    const router = useRouter()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <Loader2 className="w-10 h-10 text-[#115e59] animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] text-[#115e59]">
                <p className="font-black uppercase tracking-widest">User Profile Not Found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59]">
            <main className="max-w-4xl mx-auto pt-32 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-[#115e59]/5 border border-slate-50 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#4d7c0f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                            <div className="w-32 h-32 bg-gradient-to-br from-[#115e59] to-[#4d7c0f] rounded-full flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-[#115e59]/20 overflow-hidden">
                                {user.image ? (
                                    <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    user.name?.[0] || 'U'
                                )}
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">{user.name || 'Premium Member'}</h1>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Verified SwapIt Member</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 italic">
                                        <Mail size={14} className="text-[#115e59]" />
                                        <span className="text-xs font-bold">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 italic">
                                        <MapPin size={14} className="text-[#4d7c0f]" />
                                        <span className="text-xs font-bold uppercase tracking-widest">{user.city || 'GLOBAL'}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => router.push("/settings")}
                                className="px-8 py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#115e59] hover:text-white transition-all flex items-center gap-2"
                            >
                                <Edit3 size={14} /> Edit Profile
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50">
                            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Trust Score</h3>
                                <div className="flex items-end gap-3">
                                    <span className="text-5xl font-black text-[#115e59]">{user.trustScore.toFixed(1)}</span>
                                    <span className="text-sm font-black text-[#4d7c0f] mb-2">/ 100</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 mt-4 leading-relaxed italic">Your account is in excellent standing with the community.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-[#115e59] text-white overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-6 relative z-10">Point Balance</h3>
                                <div className="flex items-end gap-3 relative z-10">
                                    <span className="text-5xl font-black">{user.ltpBalance.toLocaleString()}</span>
                                    <span className="text-sm font-black text-[#4d7c0f] mb-2">LTP</span>
                                </div>
                                <Shield className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
