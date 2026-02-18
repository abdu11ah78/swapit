"use client"

import { useAppContext } from "@/context/AppContext"
import { Trash2, ShoppingCart, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, addToWallet } = useAppContext()

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Heart size={40} className="text-slate-300" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                    Your Watchlist is Empty
                </h1>
                <p className="text-slate-500 mb-8 max-w-md">
                    Start tracking items you're interested in. We'll notify you of price drops and updates.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-[#115e59] text-white rounded-xl font-bold hover:bg-[#0f524e] transition-colors flex items-center gap-2"
                >
                    Explore Marketplace <ArrowRight size={18} />
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-24">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#115e59]/10 rounded-2xl">
                    <Heart size={28} className="text-[#115e59]" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                        My Watchlist
                    </h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                        {wishlist.length} Items Saved
                    </p>
                </div>
            </div>

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
                            <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">{item.name}</h3>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[#115e59] font-black text-xl">
                                    {item.price} <span className="text-xs font-bold uppercase text-slate-400">LTP</span>
                                </span>
                            </div>

                            <div className="mt-auto flex gap-2">
                                <button
                                    onClick={() => addToWallet(item)}
                                    className="flex-1 py-3 bg-[#115e59] text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#0f524e] transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={16} /> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
