"use client"

import React from "react"
import { motion } from "framer-motion"
import { Settings, Shield, Bell, Lock, Smartphone, Globe, ArrowLeft } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59]">
            <main className="max-w-4xl mx-auto pt-32 pb-20 px-4">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">Node <span className="text-[#4d7c0f] not-italic">Settings</span></h1>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Protocol Configuration</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-1 space-y-2">
                        <SettingsTab icon={<Lock size={16} />} label="Security" active />
                        <SettingsTab icon={<Bell size={16} />} label="Notifications" />
                        <SettingsTab icon={<Globe size={16} />} label="Network" />
                        <SettingsTab icon={<Smartphone size={16} />} label="Devices" />
                        <SettingsTab icon={<Shield size={16} />} label="Privacy" />
                    </div>

                    <div className="md:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-[#115e59]/5 border border-slate-50"
                        >
                            <h2 className="text-xl font-black text-[#115e59] mb-8 uppercase tracking-tighter italic">Security Keys</h2>
                            <div className="space-y-8">
                                <SettingItem
                                    title="Two-Factor Auth"
                                    desc="Secure your account with quantum encryption."
                                    enabled
                                />
                                <SettingItem
                                    title="Active Sessions"
                                    desc="Logged in from 2 protocol nodes."
                                    action="Manage"
                                />
                                <SettingItem
                                    title="Password Protocol"
                                    desc="Last updated 12 days ago."
                                    action="Modify"
                                />
                            </div>

                            <button className="mt-12 w-full py-5 bg-[#115e59] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-[#4d7c0f] transition-all shadow-xl shadow-[#115e59]/10">
                                Save Protocol Config
                            </button>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function SettingsTab({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${active ? 'bg-[#115e59] text-white shadow-lg shadow-[#115e59]/20 translate-x-2' : 'bg-white border border-slate-50 text-slate-400 hover:text-[#115e59] hover:bg-slate-50'}`}>
            {icon}
            {label}
        </button>
    )
}

function SettingItem({ title, desc, enabled, action }: { title: string, desc: string, enabled?: boolean, action?: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div>
                <h4 className="text-sm font-black text-[#115e59] uppercase tracking-tighter mb-1">{title}</h4>
                <p className="text-[10px] font-bold text-slate-400 italic">{desc}</p>
            </div>
            {action ? (
                <button className="text-[10px] font-black text-[#115e59] uppercase tracking-widest hover:text-[#4d7c0f] transition-colors">{action}</button>
            ) : (
                <div className={`w-12 h-6 rounded-full p-1 transition-colors relative ${enabled ? 'bg-[#4d7c0f]' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            )}
        </div>
    )
}
