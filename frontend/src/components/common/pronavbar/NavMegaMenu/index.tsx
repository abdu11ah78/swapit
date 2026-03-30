// components/common/pronavbar/NavMegaMenu.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface DropdownItem {
    label: string
    href: string
    icon: LucideIcon
}

interface MegaMenuSection {
    title: string
    items: DropdownItem[]
}

interface MegaMenuFeatured {
    title: string
    image: string
    href: string
}

interface NavMegaMenuProps {
    isOpen: boolean
    sections?: MegaMenuSection[]
    featured?: MegaMenuFeatured[]
    close: () => void
}

export const NavMegaMenu: React.FC<NavMegaMenuProps> = ({ isOpen, sections, featured, close }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full left-0 w-screen max-w-screen-xl pt-6 z-50"
                    style={{ left: '50%', transform: 'translateX(-50%)', width: '90vw', maxWidth: '1200px' }}
                >
                    <div className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden">
                        <div className="flex p-8 gap-8">
                            {/* Sections Column */}
                            <div className="flex-1 grid grid-cols-3 gap-8 border-r border-gray-100 pr-8">
                                {sections?.map((section, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase">{section.title}</h3>
                                        <ul className="space-y-2">
                                            {section.items.map((item, i) => (
                                                <li key={i}>
                                                    <a
                                                        href={item.href}
                                                        onClick={close}
                                                        className="group flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                                                    >
                                                        <span className="w-0 group-hover:w-2 h-0.5 bg-black transition-all"></span>
                                                        {item.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Featured Column */}
                            <div className="w-1/3 space-y-4">
                                <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase">Featured</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {featured?.map((feat, idx) => (
                                        <a key={idx} href={feat.href} onClick={close} className="group relative block aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                                            <div className="absolute inset-0 bg-slate-200 group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/20 group-hover:bg-black/10 transition-colors">
                                                <span className="text-white text-lg font-bold tracking-wider uppercase border-2 border-white px-4 py-2 opacity-90">{feat.title}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}