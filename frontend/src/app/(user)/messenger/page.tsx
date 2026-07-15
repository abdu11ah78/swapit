"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import { Search, Send, MoreVertical, Phone, Video, Image as ImageIcon, Smile, ShieldCheck, Mail, Zap, Loader2, ShieldAlert, X } from "lucide-react"
import { useConversationsQuery, useChatMessagesQuery, useSendMessageMutation, useUserConversationQuery } from "@/features/messages/messages.hooks"
import { useAppContext } from "@/context/AppContext"
import { formatDistanceToNow } from "date-fns"
import type { ConversationDto } from "@/features/messages/messages.api"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/api/axios"
import toast from "react-hot-toast"

export default function MessengerPage() {
    const { isLoggedIn } = useAppContext()
    const searchParams = useSearchParams()
    const targetUserId = searchParams.get("userId")
    const [selectedChat, setSelectedChat] = useState<ConversationDto | null>(null)
    const [message, setMessage] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState<"chats" | "requests">("chats")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Option menu & Report modal states
    const [showMenu, setShowMenu] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [reportReason, setReportReason] = useState("")
    const [isSubmittingReport, setIsSubmittingReport] = useState(false)

    // Live data
    const { data: convoData, isLoading: convoLoading } = useConversationsQuery(isLoggedIn)
    const conversations = useMemo(() => convoData?.conversations ?? [], [convoData])

    // Load pre-initialized chat if userId param is present but not in main conversation list
    const hasExistingConvo = conversations.some(c => c.userId === targetUserId)
    const { data: targetConvo } = useUserConversationQuery(
        targetUserId,
        isLoggedIn && !!targetUserId && !hasExistingConvo
    )

    const { data: chatData, isLoading: chatLoading } = useChatMessagesQuery(
        selectedChat?.userId ?? null,
        isLoggedIn && !!selectedChat
    )
    const chatMessages = useMemo(() => chatData?.messages ?? [], [chatData])

    const sendMutation = useSendMessageMutation()

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages])

    // Auto-select conversation by userId query param, else first conversation
    useEffect(() => {
        if (targetUserId) {
            const match = conversations.find(c => c.userId === targetUserId)
            if (match) {
                setSelectedChat(match)
            } else if (targetConvo) {
                setSelectedChat(targetConvo)
            }
        } else if (!selectedChat && conversations.length > 0) {
            // Find first active chat
            const firstActive = conversations.find(c => !c.isRequest)
            if (firstActive) setSelectedChat(firstActive)
        }
    }, [conversations, targetUserId, targetConvo])

    const handleSend = () => {
        if (!message.trim() || !selectedChat) return
        sendMutation.mutate({
            receiverId: selectedChat.userId,
            content: message.trim(),
        })
        setMessage("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleReport = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!reportReason.trim() || !selectedChat) return
        setIsSubmittingReport(true)
        try {
            await apiClient.post("/disputes", {
                reportedUserId: selectedChat.userId,
                reason: `Chat Conversation Report: ${reportReason.trim()}`,
                evidence: "Reported directly via messenger chat options."
            })
            setShowReportModal(false)
            setReportReason("")
            toast.success("User has been reported. A dispute case has been raised in the admin panel.")
        } catch {
            toast.error("Failed to report user. Please try again.")
        } finally {
            setIsSubmittingReport(false)
        }
    }

    // Separate chats and requests
    const activeChats = conversations.filter(c => !c.isRequest)
    const requestChats = conversations.filter(c => c.isRequest)

    const activeList = activeTab === "chats" ? activeChats : requestChats
    const filteredConversations = activeList.filter(c =>
        c.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getInitials = (name: string) => {
        return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59] selection:bg-[#4d7c0f]/20 font-sans pt-32 pb-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto h-[750px] bg-white border border-slate-100 rounded-[40px] overflow-hidden flex shadow-2xl relative">

                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#4d7c0f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0" />

                {/* Sidebar: Chat List */}
                <div className="w-full md:w-80 lg:w-96 border-r border-slate-50 flex flex-col relative z-10 bg-white/50 backdrop-blur-md">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Secure<br /><span className="text-[#4d7c0f] not-italic">Messages</span></h2>
                            <div className="w-10 h-10 rounded-2xl bg-[#115e59]/5 flex items-center justify-center text-[#115e59]">
                                <Mail size={20} />
                            </div>
                        </div>
                        <div className="relative group mb-4">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#115e59] transition-all"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab("chats")}
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === "chats" ? "bg-[#115e59] text-white" : "bg-slate-50 text-slate-400 hover:text-[#115e59]"}`}
                            >
                                Chats
                            </button>
                            <button
                                onClick={() => setActiveTab("requests")}
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all relative ${activeTab === "requests" ? "bg-[#115e59] text-white" : "bg-slate-50 text-slate-400 hover:text-[#115e59]"}`}
                            >
                                Requests
                                {requestChats.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                                        {requestChats.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
                        {convoLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-6 h-6 animate-spin text-[#115e59]/30" />
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="text-center py-20">
                                <Mail className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No conversations yet</p>
                                <p className="text-[9px] text-slate-400 mt-2">Start a trade to begin messaging</p>
                            </div>
                        ) : (
                            filteredConversations.map((chat) => (
                                <button
                                    key={chat.userId}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 ${selectedChat?.userId === chat.userId ? 'bg-[#115e59] text-white shadow-xl shadow-[#115e59]/20' : 'hover:bg-slate-50 text-[#115e59]'}`}
                                >
                                    <div className="relative">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm ${selectedChat?.userId === chat.userId ? 'bg-white/20' : 'bg-[#4d7c0f]/10 text-[#4d7c0f]'}`}>
                                            {getInitials(chat.userName)}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${selectedChat?.userId === chat.userId ? 'border-[#115e59]' : 'border-white'} ${chat.isOnline ? 'bg-[#4d7c0f]' : 'bg-slate-300'}`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-black text-[11px] uppercase tracking-widest">{chat.userName}</span>
                                            <span className={`text-[8px] font-black uppercase ${selectedChat?.userId === chat.userId ? 'text-white/50' : 'text-slate-400'}`}>
                                                {chat.lastMessageAt ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false }) : ""}
                                            </span>
                                        </div>
                                        <p className={`text-[10px] truncate max-w-[150px] font-medium ${selectedChat?.userId === chat.userId ? 'text-white/70' : 'text-slate-500'}`}>
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="hidden md:flex flex-1 flex-col bg-white relative z-10">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md relative">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#4d7c0f]/10 flex items-center justify-center font-black text-[#4d7c0f] text-xs">
                                        {getInitials(selectedChat.userName)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-widest text-[#115e59]">{selectedChat.userName}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${selectedChat.isOnline ? 'bg-[#4d7c0f]' : 'bg-slate-300'}`} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {selectedChat.isOnline ? 'Online' : 'Offline'}
                                            </span>
                                            <span className="text-[8px] text-slate-300 mx-1">•</span>
                                            <span className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">
                                                Trust: {selectedChat.userTrustScore.toFixed(0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedChat.userPhoneNumber ? (
                                        <a href={`tel:${selectedChat.userPhoneNumber}`} className="p-3 text-[#115e59] hover:bg-slate-50 rounded-2xl transition-all" title="Call Seller">
                                            <Phone size={18} />
                                        </a>
                                    ) : (
                                        <button onClick={() => toast.error("Seller phone number not available")} className="p-3 text-slate-300 rounded-2xl cursor-not-allowed" title="No Phone Available">
                                            <Phone size={18} />
                                        </button>
                                    )}
                                    <button className="p-3 text-[#115e59] hover:bg-slate-50 rounded-2xl transition-all"><Video size={18} /></button>
                                    <div className="relative">
                                        <button onClick={() => setShowMenu(!showMenu)} className="p-3 text-[#115e59] hover:bg-slate-50 rounded-2xl transition-all">
                                            <MoreVertical size={18} />
                                        </button>
                                        {showMenu && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-2">
                                                <button
                                                    onClick={() => {
                                                        setShowMenu(false)
                                                        setShowReportModal(true)
                                                    }}
                                                    className="w-full px-4 py-3 text-left text-xs font-black text-red-500 hover:bg-red-50 transition-colors uppercase tracking-widest flex items-center gap-2"
                                                >
                                                    <ShieldAlert size={14} />
                                                    Report Chat
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Message Request Accept Banner */}
                            {selectedChat.isRequest && (
                                <div className="p-6 bg-[#4d7c0f]/5 border-b border-[#4d7c0f]/10 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="text-left">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-[#4d7c0f]">Message Request</h4>
                                        <p className="text-[10px] text-slate-500 mt-1">Accepting this request will allow the user to see your status and message you.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            sendMutation.mutate({
                                                receiverId: selectedChat.userId,
                                                content: "Hello! Request accepted."
                                            })
                                            // Optimistically accept locally
                                            setSelectedChat(prev => prev ? { ...prev, isRequest: false } : null)
                                            toast.success("Request accepted!")
                                        }}
                                        className="px-6 py-2.5 bg-[#115e59] hover:bg-[#4d7c0f] text-white font-black text-[10px] tracking-widest rounded-xl transition-all shadow-md"
                                    >
                                        ACCEPT REQUEST
                                    </button>
                                </div>
                            )}

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scroll bg-slate-50/30">
                                {chatLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#115e59]/20" />
                                    </div>
                                ) : chatMessages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-[#115e59]/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                                <Mail className="w-8 h-8 text-[#115e59]/20" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No messages yet</p>
                                            <p className="text-[9px] text-slate-400 mt-2">Say hello to start the conversation!</p>
                                        </div>
                                    </div>
                                ) : (
                                    chatMessages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%]`}>
                                                <div className={`p-5 rounded-3xl text-sm font-medium shadow-sm ${msg.isMine ? 'bg-[#115e59] text-white rounded-tr-none' : 'bg-white text-[#115e59] border border-slate-100 rounded-tl-none'}`}>
                                                    {msg.content}
                                                </div>
                                                <p className={`text-[8px] font-black uppercase tracking-widest mt-2 ${msg.isMine ? 'text-right text-[#115e59]/40' : 'text-left text-slate-400'}`}>
                                                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                                    {msg.isMine && msg.isRead && ' • Seen'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-8 pt-0 bg-white/50 backdrop-blur-md">
                                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-3 flex items-center gap-3 shadow-inner">
                                    <button className="p-3 text-slate-400 hover:text-[#115e59] transition-colors"><ImageIcon size={20} /></button>
                                    <button className="p-3 text-slate-400 hover:text-[#115e59] transition-colors"><Smile size={20} /></button>
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 bg-transparent border-none text-sm font-bold text-[#115e59] focus:outline-none px-4"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!message.trim() || sendMutation.isPending}
                                        className="w-12 h-12 bg-[#115e59] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#115e59]/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {sendMutation.isPending ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Send size={20} />
                                        )}
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
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-[#115e59]/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-12 h-12 text-[#115e59]/15" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter text-[#115e59] mb-2">Select a Conversation</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Choose a chat from the sidebar to begin</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Conversation Modal */}
            <AnimatePresence>
                {showReportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => { setShowReportModal(false); setReportReason("") }}
                                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-black text-slate-800 mb-2">Report Conversation</h2>
                            <p className="text-slate-500 text-sm mb-6">
                                Explain the reason for reporting this chat. An administrator will review the conversation logs.
                            </p>
                            <form onSubmit={handleReport} className="space-y-4">
                                <textarea
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    placeholder="Describe the issue (e.g., harassment, scams, policy violations)..."
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#115e59]/20 text-sm resize-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmittingReport}
                                    className="w-full py-3 bg-red-600 text-white font-black text-xs tracking-widest rounded-2xl disabled:opacity-50 hover:bg-red-700 transition-colors"
                                >
                                    {isSubmittingReport ? "SUBMITTING REPORT..." : "SUBMIT REPORT"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
