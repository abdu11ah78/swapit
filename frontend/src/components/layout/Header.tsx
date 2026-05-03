"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import { Search, MapPin, Plus, User, LogOut, ChevronDown, Mail, ShoppingCart, Bell, Settings, Heart, Package, CreditCard, UserCircle, Sparkles, ShoppingBag, ArrowLeftRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { AnimatePresence, motion } from "framer-motion"
import { useNotificationsQuery } from "@/features/notifications/notifications.hooks"
import { useConversationsQuery } from "@/features/messages/messages.hooks"

interface Props {
    onSearch?: (query: string) => void
}

export function MarketplaceHeader({ onSearch }: Props) {
    const router = useRouter()
    const { wishlist, wallet, isLoggedIn, currentUser, logout, isAiMode, toggleAiMode } = useAppContext()
    const [searchValue, setSearchValue] = useState("")
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { data: notificationsData } = useNotificationsQuery(isLoggedIn)
    const unreadCount = (notificationsData?.notifications ?? []).filter((n) => !n.read).length
    const { data: convoData } = useConversationsQuery(isLoggedIn)
    const messageCount = convoData?.conversations?.length ?? 0

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)
        if (onSearch) onSearch(value)
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !onSearch && searchValue.trim()) {
            router.push(`/?q=${encodeURIComponent(searchValue.trim())}`)
        }
    }

    const handleSellClick = () => {
        if (!isLoggedIn) {
            router.push("/login")
        } else {
            router.push("/post-asset")
        }
    }

    const handleLogout = () => {
        logout()
        setShowProfileMenu(false)
        router.push("/")
    }

    return (
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 sm:h-24 gap-4 sm:gap-10">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#115e59] to-[#4d7c0f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#115e59]/20 group-hover:scale-105 group-hover:rotate-3 transition-all relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-white font-black text-2xl italic relative z-10">S</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-[#115e59] italic hidden lg:block uppercase">
                            Swap<span className="text-[#4d7c0f]">It</span>
                        </span>
                    </Link>

                    {/* Modern Search pill */}
                    <div className="flex-1 max-w-2xl relative group hidden md:block">
                        <div className="relative flex items-center bg-slate-50 border border-slate-100 focus-within:bg-white focus-within:border-[#115e59]/20 focus-within:ring-8 focus-within:ring-[#115e59]/5 rounded-3xl px-6 h-14 transition-all duration-500 shadow-inner">
                            <Search className="w-4 h-4 text-slate-300 mr-4" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="What are you looking for today?"
                                className="flex-1 bg-transparent outline-none text-sm font-bold text-[#115e59] placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-2 sm:gap-4">
                                {/* Navigation Icons */}
                                <div className="flex items-center gap-1 sm:gap-2 mr-2">
                                    <button
                                        onClick={() => router.push("/messenger")}
                                        className="p-3 text-[#115e59] hover:bg-[#115e59]/5 rounded-2xl transition-all relative group"
                                        title="Messages"
                                    >
                                        <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        {messageCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-[#4d7c0f] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                                {messageCount}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => router.push("/my-offers")}
                                        className="p-3 text-[#115e59] hover:bg-[#115e59]/5 rounded-2xl transition-all relative group"
                                        title="My Offers"
                                    >
                                        <ArrowLeftRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => router.push("/notifications")}
                                        className="p-3 text-[#115e59] hover:bg-[#115e59]/5 rounded-2xl transition-all group relative"
                                        title="Notifications"
                                    >
                                        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-[#4d7c0f] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Profile Overlay Trigger */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 border border-slate-100 hover:bg-white hover:border-[#115e59]/20 rounded-full transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#115e59] to-[#4d7c0f] rounded-full flex items-center justify-center shadow-lg shadow-[#115e59]/10 overflow-hidden">
                                            {currentUser?.image ? (
                                                <img src={currentUser.image} alt={currentUser.name || 'User'} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                                            <p className="text-xs font-black text-[#115e59] leading-none italic">{currentUser?.name?.split(' ')[0] || 'Member'}</p>
                                        </div>
                                        <ChevronDown className={`w-3 h-3 text-[#115e59] transition-transform duration-500 ${showProfileMenu ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        )
                            : (
                                <Link
                                    href="/login"
                                    className="text-[11px] font-black uppercase tracking-[0.2em] text-[#115e59] hover:text-[#4d7c0f] transition-all relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#4d7c0f] hover:after:w-full after:transition-all"
                                >
                                    Login
                                </Link>
                            )}

                        {/* AI Price/Points Toggle */}
                        <button
                            onClick={toggleAiMode}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${isAiMode ? 'bg-[#4d7c0f]/10 border-[#4d7c0f] text-[#4d7c0f]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-[#115e59]'}`}
                            title="Toggle AI Valuation"
                        >
                            <Sparkles size={14} className={`${isAiMode ? 'fill-current animate-pulse' : ''}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
                                {isAiMode ? 'AI Valued' : 'Valuate'}
                            </span>
                        </button>

                        <button
                            onClick={handleSellClick}
                            className="relative group overflow-hidden px-6 py-2.5 bg-[#115e59] rounded-xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#115e59]/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                <Plus className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-widest">Post Ad</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Menu Overlay (Portal) */}
            {mounted && createPortal(
                <AnimatePresence>
                    {showProfileMenu && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowProfileMenu(false)}
                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999]"
                            />

                            {/* Menu Container */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="fixed top-20 sm:top-24 inset-x-0 z-[1000] flex justify-center px-4"
                            >
                                <div className="w-full max-w-7xl mx-auto">
                                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Header Portion (Left Side on Desktop) */}
                                            <div className="p-8 bg-slate-50/80 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-100 md:w-1/3 lg:w-1/4 flex flex-col justify-center">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-16 h-16 bg-[#115e59] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#115e59]/20 italic flex-shrink-0 overflow-hidden">
                                                        {currentUser?.image ? (
                                                            <img src={currentUser.image} alt={currentUser.name || 'User'} className="w-full h-full object-cover" />
                                                        ) : (
                                                            currentUser?.name?.[0] || 'U'
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-lg font-black text-[#115e59] truncate uppercase tracking-tighter italic">{currentUser?.name || 'Premium User'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                            Verified Member
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-red-500 border border-red-50 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:border-red-100 shadow-sm"
                                                >
                                                    <LogOut size={16} />
                                                    Sign Out
                                                </button>
                                            </div>

                                            {/* Menu Content (Grid) */}
                                            <div className="p-6 md:p-8 flex-1 bg-white">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <MenuLink icon={<UserCircle size={20} />} label="My Profile" onClick={() => { router.push("/profile"); setShowProfileMenu(false) }} />
                                                    <MenuLink icon={<Heart size={20} />} label="Vault" onClick={() => { router.push("/wishlist"); setShowProfileMenu(false) }} count={wishlist.length} />
                                                    <MenuLink icon={<Package size={20} />} label="Active Ads" onClick={() => { router.push("/my-posts"); setShowProfileMenu(false) }} />
                                                    <MenuLink icon={<Sparkles size={20} />} label="My Offers" onClick={() => { router.push("/my-offers"); setShowProfileMenu(false) }} />
                                                    <MenuLink icon={<Settings size={20} />} label="Settings" onClick={() => { router.push("/settings"); setShowProfileMenu(false) }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </header>
    )
}


function MenuLink({ icon, label, onClick, count }: { icon: React.ReactNode, label: string, onClick: () => void, count?: number }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-[#115e59]/5 border border-slate-100 hover:border-[#115e59]/10 rounded-2xl transition-all group gap-3 animate-in fade-in zoom-in duration-300"
        >
            <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:text-[#115e59] group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-sm ring-1 ring-slate-100">
                {icon}
            </div>
            <div className="text-center relative">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#115e59] transition-colors">{label}</span>
                {count !== undefined && count > 0 && (
                    <span className="absolute -top-1 -right-3 text-[8px] font-black text-white bg-[#4d7c0f] rounded-full px-1.5 py-0.5 min-w-[18px] border border-white shadow-md">{count}</span>
                )}
            </div>
        </button>
    )
}
