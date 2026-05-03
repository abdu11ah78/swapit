"use client"

import React, { useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { Trash2, ShoppingCart, ArrowRight, Heart, Gavel, Loader2, SearchX } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useOffersQuery } from "@/features/offers/offers.hooks"

export default function VaultPage() {
    const { wishlist, removeFromWishlist, addToWallet } = useAppContext()
    const { data: offersData, isLoading: offersLoading } = useOffersQuery()
    const [activeTab, setActiveTab] = useState<'liked' | 'bids'>('liked')

    const myBids = offersData?.offers ?? []

    if (offersLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <Loader2 className="w-10 h-10 text-[#115e59] animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-24 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#115e59]/10 rounded-2xl">
                        <Heart size={28} className="text-[#115e59]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
                            My <span className="text-[#4d7c0f] not-italic">Vault</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            Liked Items & Active Biddings
                        </p>
                    </div>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('liked')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'liked' ? 'bg-white text-[#115e59] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Heart size={14} /> Liked Items ({wishlist.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('bids')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bids' ? 'bg-white text-[#115e59] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Gavel size={14} /> My Biddings ({myBids.length})
                    </button>
                </div>
            </div>

            {activeTab === 'liked' ? (
                wishlist.length === 0 ? (
                    <EmptyState 
                        icon={<Heart size={40} />} 
                        title="Your Watchlist is Empty" 
                        description="Start tracking items you're interested in. We'll notify you of updates."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white border border-slate-100 rounded-3xl p-4 transition-all hover:shadow-xl hover:border-[#115e59]/20 flex flex-col"
                            >
                                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100">
                                    {item.imageUrl ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300">
                                            <Heart size={40} />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                        title="Remove from watchlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="px-2 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1 italic uppercase tracking-tighter">{item.name}</h3>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[#115e59] font-black text-xl italic">
                                            {item.price} <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">LTP</span>
                                        </span>
                                    </div>

                                    <div className="mt-auto flex gap-2">
                                        <button
                                            onClick={() => addToWallet(item)}
                                            className="flex-1 py-3 bg-[#115e59] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0f524e] transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart size={14} /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                myBids.length === 0 ? (
                    <EmptyState 
                        icon={<Gavel size={40} />} 
                        title="No Active Biddings" 
                        description="You haven't made any offers on items yet. Explore the marketplace to start trading."
                    />
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-50">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Offered Asset</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">My Offer</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {myBids.map((offer) => (
                                        <tr key={offer.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-[#115e59] italic uppercase tracking-tighter">{offer.tradeTitle || 'Trade Interaction'}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Trade ID: {offer.id.slice(0,8)}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-[#4d7c0f] italic">{offer.offeredLtp} LTP</span>
                                                    {offer.itemIds?.length > 0 && (
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">+ {offer.itemIds.length} Item(s)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    offer.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    offer.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {offer.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="text-[10px] font-black text-[#115e59] hover:text-[#4d7c0f] uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-0 group-hover:opacity-100 transition-all">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                {icon}
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">
                {title}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 max-w-xs mx-auto leading-relaxed">
                {description}
            </p>
            <Link
                href="/"
                className="px-10 py-4 bg-[#115e59] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#115e59]/10 flex items-center gap-2"
            >
                Explore Marketplace <ArrowRight size={14} />
            </Link>
        </div>
    )
}
