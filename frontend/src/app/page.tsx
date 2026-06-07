"use client"

import React, { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { MarketplaceHeader } from "@/components/layout/Header"
import { CategoryNav } from "@/components/layout/CategoryNav"
import { MarketplaceCard, MarketplaceItem } from "@/components/products/MarketplaceCard"
import { ArrowRight, Sparkles, SearchX } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useItemsQuery } from "@/features/items/items.hooks"
import { formatDistanceToNow } from "date-fns"



export default function LandingPage() {
    const { isLoggedIn } = useAppContext()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    // Fetch real items from backend
    const { data: itemsData, isLoading } = useItemsQuery({
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
        sort: "latest"
    })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const filteredItems = useMemo(() => {
        if (!itemsData?.items) return []

        return itemsData.items.map(item => ({
            id: item.id,
            name: item.title,
            price: `Rs ${item.ltpValue.toLocaleString()}`,
            points: `${item.ltpValue.toLocaleString()} LTP`,
            tradeFor: "Negotiable Swap", // Default since backend doesn't have tradeFor field yet
            location: item.location,
            date: formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }),
            image: item.images[0] 
                ? (item.images[0].startsWith("http") 
                    ? item.images[0].replace(/\\/g, '/') 
                    : `${(process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7052/api").replace(/\/api$/, '')}/${item.images[0].replace(/\\/g, '/').startsWith('/') ? item.images[0].replace(/\\/g, '/').slice(1) : item.images[0].replace(/\\/g, '/')}`)
                : "/placeholder.png",
            condition: item.condition,
            description: item.description,
            category: item.category
        }))
    }, [itemsData])

    if (!isMounted) return null

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59] selection:bg-[#4d7c0f]/20 font-sans">
            <MarketplaceHeader onSearch={setSearchQuery} />
            <CategoryNav selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Hero section only shown when no filters are active AND user is not logged in */}
                {!searchQuery && !selectedCategory && !isLoggedIn && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-[2.5rem] overflow-hidden mb-16 bg-gradient-to-br from-[#115e59]/5 to-white border border-[#115e59]/10 p-1"
                    >
                        <div className="bg-white/40 backdrop-blur-sm rounded-[2.4rem] overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-10 sm:p-16 flex flex-col justify-center relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4d7c0f]/10 border border-[#4d7c0f]/20 rounded-full mb-8 w-fit shadow-sm">
                                        <Sparkles size={14} className="text-[#4d7c0f] animate-pulse" />
                                        <span className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest leading-none">Pakistan&apos;s Premium Barter Hub</span>
                                    </div>
                                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-[#115e59] leading-[1] mb-8">
                                        UPGRADE YOUR<br />
                                        LIFESTYLE <span className="text-[#4d7c0f]">TOGETHER.</span>
                                    </h1>
                                    <p className="text-xl text-slate-500 max-w-lg mb-10 font-medium leading-relaxed">
                                        Swap high-value assets securely. No cash, no hassle. Experience the future of decentralized trade.
                                    </p>
                                    <div className="flex flex-wrap gap-5">
                                        <Link href="/signup">
                                            <button className="px-10 py-5 bg-[#115e59] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-[#134e4a] transition-all shadow-xl shadow-[#115e59]/20 hover:scale-105 active:scale-95">
                                                Get Started
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => setSelectedCategory('electronics')}
                                            className="px-10 py-5 bg-white/50 backdrop-blur-md border border-slate-200 text-[#115e59] text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all hover:scale-105 active:scale-95"
                                        >
                                            Explore assets
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden lg:block relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-l from-[#fcfcfc] via-transparent to-transparent z-10" />
                                    <img
                                        src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&w=1200&q=90"
                                        alt="Premium Marketplace"
                                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]"
                                    />
                                    {/* Glass decorative elements */}
                                    <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 z-20 animate-bounce-slow" />
                                    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#4d7c0f]/10 backdrop-blur-3xl rounded-full border border-white/20 z-0 shadow-2xl" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Results Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-[#115e59] uppercase tracking-tighter">
                            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` : "Featured Assets"}
                        </h2>
                        {!searchQuery && !selectedCategory && <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-2">Verified listings nationwide</p>}
                    </div>
                    {(searchQuery || selectedCategory) && (
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory(null) }}
                            className="bg-[#115e59]/5 px-5 py-2 rounded-full text-[#115e59] font-black text-[10px] uppercase tracking-widest hover:bg-[#115e59] hover:text-white transition-all shadow-sm"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {/* Grid */}
                <AnimatePresence mode="popLayout">
                    {filteredItems.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {filteredItems.map((item) => (
                                <MarketplaceCard key={item.id} item={item} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-20 h-20 bg-[#115e59]/5 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                                <SearchX className="text-[#115e59]/30" size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-[#115e59] mb-3 uppercase tracking-tighter">Asset not found</h3>
                            <p className="text-slate-500 max-w-sm mb-10 font-medium">Try broadening your search or choosing a different category.</p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory(null) }}
                                className="px-10 py-4 bg-[#115e59] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#115e59]/20 transition-all hover:scale-105"
                            >
                                Show All Assets
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Featured Section (Always show some context if needed) */}
                {!selectedCategory && !searchQuery && (
                    <div className="mt-24">
                        <div className="bg-gradient-to-br from-[#115e59] to-[#134e4a] rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl">
                            {/* Decorative background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4d7c0f]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                            <div className="relative z-10">
                                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Ready to evolve your assets?</h2>
                                <p className="text-[#ccfbf1] font-medium mb-12 max-w-md mx-auto text-lg leading-relaxed">
                                    List your items in seconds and start receiving premium swap offers.
                                </p>
                                <Link href="/signup">
                                    <button className="px-12 py-6 bg-white text-[#115e59] font-black uppercase tracking-[0.2em] text-sm rounded-2xl hover:bg-[#4d7c0f] hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95 group">
                                        Post Your Listing <ArrowRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Marketplace Footer */}
            <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-2 md:col-span-1">
                            <span className="text-3xl font-black tracking-tighter text-[#115e59] italic mb-8 block">
                                Swap<span className="text-[#4d7c0f] italic">It</span>
                            </span>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-loose">
                                Reimagining asset liquidity through the world&apos;s first decentralized barter network.
                            </p>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#115e59] mb-8 opacity-50">Discovery</h5>
                            <ul className="space-y-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">
                                <li><button onClick={() => setSelectedCategory('mobiles')} className="hover:text-[#4d7c0f] transition-colors">Tech Hub</button></li>
                                <li><button onClick={() => setSelectedCategory('vehicles')} className="hover:text-[#4d7c0f] transition-colors">Auto Lounge</button></li>
                                <li><button onClick={() => setSelectedCategory('electronics')} className="hover:text-[#4d7c0f] transition-colors">Electronics</button></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#115e59] mb-8 opacity-50">Support</h5>
                            <ul className="space-y-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">
                                <li><Link href="#" className="hover:text-[#4d7c0f] transition-colors">Protocol FAQs</Link></li>
                                <li><Link href="#" className="hover:text-[#4d7c0f] transition-colors">Security Center</Link></li>
                                <li><Link href="#" className="hover:text-[#4d7c0f] transition-colors">Safety Logic</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#115e59] mb-8 opacity-50">Institutional</h5>
                            <ul className="space-y-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">
                                <li><Link href="#" className="hover:text-[#4d7c0f] transition-colors">Privacy Layer</Link></li>
                                <li><Link href="#" className="hover:text-[#4d7c0f] transition-colors">User Agreement</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2026 SwapIt Protocol. Pakistan&apos;s Asset Exchange.</p>
                        <div className="flex gap-6">
                            {['fb', 'tw', 'ig', 'li'].map(social => (
                                <div key={social} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#115e59]/30 text-[10px] font-black uppercase cursor-pointer hover:bg-[#115e59] hover:text-white hover:scale-110 transition-all">
                                    {social}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
