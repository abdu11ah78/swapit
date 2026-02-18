"use client"

import React from "react"
import Link from "next/link"
import { Smartphone, Car, Home, Camera, Bike, Briefcase, Dog, Heart, Book, Palette } from "lucide-react"

const categories = [
    { id: "mobiles", name: "Mobiles", icon: Smartphone, color: "bg-blue-50" },
    { id: "vehicles", name: "Vehicles", icon: Car, color: "bg-red-50" },
    { id: "property-for-sale", name: "Property For Sale", icon: Home, color: "bg-green-50" },
    { id: "property-for-rent", name: "Property For Rent", icon: Home, color: "bg-yellow-50" },
    { id: "electronics", name: "Electronics", icon: Camera, color: "bg-purple-50" },
    { id: "bikes", name: "Bikes", icon: Bike, color: "bg-orange-50" },
    { id: "business", name: "Business", icon: Briefcase, color: "bg-indigo-50" },
    { id: "services", name: "Services", icon: Palette, color: "bg-pink-50" },
    { id: "jobs", name: "Jobs", icon: Briefcase, color: "bg-slate-50" },
    { id: "animals", name: "Animals", icon: Dog, color: "bg-cyan-50" },
]

interface Props {
    selectedCategory: string | null
    onSelectCategory: (id: string | null) => void
}

export function CategoryNav({ selectedCategory, onSelectCategory }: Props) {
    return (
        <div className="border-b border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-12">
                    {/* Categories */}
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar mask-gradient-right">
                        <button
                            onClick={() => onSelectCategory(null)}
                            className="flex items-center gap-2 group whitespace-nowrap min-w-fit"
                        >
                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${!selectedCategory ? 'text-[#115e59] border-b-2 border-[#115e59]' : 'text-slate-400 hover:text-[#115e59]'}`}>
                                All Categories
                            </span>
                        </button>

                        <div className="h-4 w-px bg-slate-200 mx-2" />

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id)}
                                className="flex items-center gap-2 group min-w-fit px-1"
                            >
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'text-[#4d7c0f] border-b-2 border-[#4d7c0f]' : 'text-slate-400 hover:text-[#4d7c0f]'}`}>
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Right Side spacer */}
                    <div className="w-4 flex-shrink-0" />
                </div>
            </div>
        </div>
    )
}
