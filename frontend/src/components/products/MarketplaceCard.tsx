"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, MapPin, Repeat, ShoppingCart } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { motion, AnimatePresence } from "framer-motion"

export type MarketplaceItem = {
    id: string
    name: string
    price: string // e.g., "Rs 95,000"
    points?: string // e.g., "1,450 LTP"
    tradeFor: string // What the user wants in exchange
    location: string
    date: string
    image: string
    condition: string
    description: string
    category?: string
}

interface Props {
    item: MarketplaceItem
}

export function MarketplaceCard({ item }: Props) {
    const router = useRouter()
    const { addToWishlist, wishlist, isAiMode } = useAppContext()
    const [isHovered, setIsHovered] = useState(false)

    const isLiked = wishlist.some(w => w.id === item.id)

    const handleProtectedAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault()
        e.stopPropagation()
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
        if (!isLoggedIn) {
            router.push("/login")
        } else {
            action()
        }
    }

    const handleLike = (e: React.MouseEvent) => {
        handleProtectedAction(e, () => {
            addToWishlist({
                id: item.id,
                name: item.name,
                price: parseInt(item.price.replace(/[^0-9]/g, "")) || 0,
                imageUrl: item.image,
                quantity: 1
            })
        })
    }

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#115e59]/5 transition-all cursor-pointer group flex flex-col h-full relative"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={(e) => router.push(`/items/${item.id}`)}
        >
            {/* Image Section */}
            <div className="block aspect-[4/3] relative overflow-hidden bg-slate-50">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Hover Overlay with Action Buttons */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#115e59]/40 backdrop-blur-[2px] p-6 flex flex-col items-center justify-center gap-3 z-20"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); router.push(`/items/${item.id}`) }}
                                className="w-full py-3 bg-white text-[#115e59] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#4d7c0f] hover:text-white transition-all shadow-2xl active:scale-95"
                            >
                                View Details
                            </button>
                            <button
                                onClick={handleLike}
                                className={`w-full py-3 ${isLiked ? 'bg-[#4d7c0f]' : 'bg-[#115e59]'} text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#4d7c0f] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-2`}
                            >
                                <Heart size={12} className={isLiked ? "fill-current" : ""} />
                                {isLiked ? 'Saved' : 'Save Asset'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Condition Tag (Persistent) */}
                <div className="absolute top-4 left-4 z-10 text-white text-[8px] font-black uppercase tracking-[0.2em] bg-[#4d7c0f]/90 backdrop-blur-md self-start px-2.5 py-1.5 rounded-lg shadow-lg">
                    {item.condition}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1 border-l-4 border-l-transparent group-hover:border-l-[#4d7c0f] transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-[#115e59] tracking-tight">
                        {isAiMode ? (item.points || item.price) : item.price}
                    </h3>
                </div>

                <h4 className="text-slate-600 text-sm font-bold line-clamp-1 mb-4 uppercase tracking-tighter">
                    {item.name}
                </h4>

                {/* Trade For Info (SwapIt Special) */}
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-3">
                    <div className="p-2 bg-[#f0fdf4] rounded-xl">
                        <Repeat className="w-4 h-4 text-[#4d7c0f]" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-1">TRADING FOR</p>
                        <p className="text-xs font-black text-[#4d7c0f] line-clamp-1 uppercase tracking-tight">
                            {item.tradeFor}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#4d7c0f]/50" />
                        <span>{item.location}</span>
                    </div>
                    <span>{item.date}</span>
                </div>
            </div>
        </motion.div>
    )
}
