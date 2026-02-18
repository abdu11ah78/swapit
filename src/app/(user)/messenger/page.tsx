"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Send, MoreVertical, Phone, Video, Image as ImageIcon, Smile, ArrowLeft, ShieldCheck, Mail, Zap, User } from "lucide-react"
import { useRouter } from "next/navigation"

const mockChats = [
    { id: 1, name: "Nexus_Trader", lastMsg: "The valve condition is mint.", time: "2m ago", status: "online", trust: 5.0, avatar: "NT" },
    { id: 2, name: "Quantum_Swap", lastMsg: "LTP adjustment sounds fair.", time: "15m ago", status: "offline", trust: 4.8, avatar: "QS" },
    { id: 3, name: "Cyber_Relic", lastMsg: "Send more photos please.", time: "1h ago", status: "online", trust: 4.9, avatar: "CR" },
    { id: 4, name: "Techno_Nomad", lastMsg: "Deal confirmed.", time: "2h ago", status: "offline", trust: 5.0, avatar: "TN" },
]

const mockMessages = [
    { id: 1, sender: "Nexus_Trader", text: "Hey! I'm interested in the Vintage Camera swap.", time: "10:00 AM", isMe: false },
    { id: 2, sender: "Me", text: "Hi! It's still available. What are you offering?", time: "10:05 AM", isMe: true },
    { id: 3, sender: "Nexus_Trader", text: "I have a Lens Set with 1,200 LTP value. Interested?", time: "10:10 AM", isMe: false },
    { id: 4, sender: "Me", text: "That sounds like a great match. Let's discuss details.", time: "10:15 AM", isMe: true },
    { id: 5, sender: "Nexus_Trader", text: "The valve condition is mint.", time: "10:20 AM", isMe: false },
]

export default function MessengerPage() {
    const router = useRouter()
    const [selectedChat, setSelectedChat] = useState(mockChats[0])
    const [message, setMessage] = useState("")

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59] selection:bg-[#4d7c0f]/20 font-sans pt-32 pb-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto h-[750px] bg-white border border-slate-100 rounded-[40px] overflow-hidden flex shadow-2xl relative">

                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#4d7c0f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0" />

                {/* Sidebar: Chat List */}
                <div className="w-full md:w-80 lg:w-96 border-r border-slate-50 flex flex-col relative z-10 bg-white/50 backdrop-blur-md">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Secure<br /><span className="text-[#4d7c0f] not-italic">Messages</span></h2>
                            <div className="w-10 h-10 rounded-2xl bg-[#115e59]/5 flex items-center justify-center text-[#115e59]">
                                <Mail size={20} />
                            </div>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Protocol Nodes..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#115e59] transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
                        {mockChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 ${selectedChat.id === chat.id ? 'bg-[#115e59] text-white shadow-xl shadow-[#115e59]/20' : 'hover:bg-slate-50 text-[#115e59]'}`}
                            >
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm ${selectedChat.id === chat.id ? 'bg-white/20' : 'bg-[#4d7c0f]/10 text-[#4d7c0f]'}`}>
                                        {chat.avatar || 'U'}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${selectedChat.id === chat.id ? 'border-[#115e59]' : 'border-white'} ${chat.status === 'online' ? 'bg-[#4d7c0f]' : 'bg-slate-300'}`} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-black text-[11px] uppercase tracking-widest">{chat.name}</span>
                                        <span className={`text-[8px] font-black uppercase ${selectedChat.id === chat.id ? 'text-white/50' : 'text-slate-400'}`}>{chat.time}</span>
                                    </div>
                                    <p className={`text-[10px] truncate max-w-[150px] font-medium ${selectedChat.id === chat.id ? 'text-white/70' : 'text-slate-500'}`}>{chat.lastMsg}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="hidden md:flex flex-1 flex-col bg-white relative z-10">
                    {/* Chat Header */}
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#4d7c0f]/10 flex items-center justify-center font-black text-[#4d7c0f] text-xs">
                                {selectedChat.avatar || 'U'}
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest text-[#115e59]">{selectedChat.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${selectedChat.status === 'online' ? 'bg-[#4d7c0f]' : 'bg-slate-300'}`} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedChat.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-3 text-[#115e59] hover:bg-slate-50 rounded-2xl transition-all"><Phone size={18} /></button>
                            <button className="p-3 text-[#115e59] hover:bg-slate-50 rounded-2xl transition-all"><Video size={18} /></button>
                            <button className="p-3 text-[#115e59] hover:bg-slate-50 rounded-2xl transition-all"><MoreVertical size={18} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scroll bg-slate-50/30">
                        {mockMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${msg.isMe ? 'order-2' : ''}`}>
                                    <div className={`p-5 rounded-3xl text-sm font-medium shadow-sm ${msg.isMe ? 'bg-[#115e59] text-white rounded-tr-none' : 'bg-white text-[#115e59] border border-slate-100 rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                    <p className={`text-[8px] font-black uppercase tracking-widest mt-2 ${msg.isMe ? 'text-right text-[#115e59]/40' : 'text-left text-slate-400'}`}>
                                        {msg.time} {msg.isMe && '• Seen'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-8 pt-0 bg-white/50 backdrop-blur-md">
                        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-3 flex items-center gap-3 shadow-inner">
                            <button className="p-3 text-slate-400 hover:text-[#115e59] transition-colors"><ImageIcon size={20} /></button>
                            <button className="p-3 text-slate-400 hover:text-[#115e59] transition-colors"><Smile size={20} /></button>
                            <input
                                type="text"
                                placeholder="Quantum Message Protocol..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 bg-transparent border-none text-sm font-bold text-[#115e59] focus:outline-none px-4"
                            />
                            <button
                                className="w-12 h-12 bg-[#115e59] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#115e59]/20 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4d7c0f]/10 rounded-full">
                                <ShieldCheck size={12} className="text-[#4d7c0f]" />
                                <span className="text-[8px] font-black text-[#4d7c0f] uppercase tracking-widest">End-to-End Encrypted</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#115e59]/5 rounded-full">
                                <Zap size={12} className="text-[#115e59]" />
                                <span className="text-[8px] font-black text-[#115e59] uppercase tracking-widest">LTP Secure Transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
