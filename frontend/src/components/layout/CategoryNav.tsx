"use client"

import React from "react"
import { Smartphone, Car, Home, Camera, Bike, Briefcase, Dog, Heart, Book, Palette, HelpCircle, Sparkles, Smile, Microwave, Cpu, BookOpen, Trophy } from "lucide-react"
import { useCategories } from "@/features/taxonomy/taxonomy.hooks"

const IconMap: Record<string, any> = {
    Smartphone, Car, Home, Camera, Bike, Briefcase, Dog, Heart, Book, Palette, HelpCircle, Sparkles, Smile, Microwave, Cpu, BookOpen, Trophy
}

interface Props {
    selectedCategory: string | null
    onSelectCategory: (id: string | null) => void
}

export function CategoryNav({ selectedCategory, onSelectCategory }: Props) {
    const { data: categories = [] } = useCategories()
    
    // Filter only Level 1 active root categories
    const rootCategories = categories.filter(c => !c.parentId && c.isActive)

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

                        {rootCategories.map((cat) => {
                            const Icon = IconMap[cat.icon] || HelpCircle
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => onSelectCategory(cat.name)} // Filter by category name
                                    className="flex items-center gap-2 group min-w-fit px-1"
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.name ? 'text-[#4d7c0f] border-b-2 border-[#4d7c0f]' : 'text-slate-400 hover:text-[#4d7c0f]'}`}>
                                        {cat.name}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Right Side spacer */}
                    <div className="w-4 flex-shrink-0" />
                </div>
            </div>
        </div>
    )
}
