// components/common/pronavbar/NavDropdown.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface DropdownItem {
    label: string
    href: string
    icon: LucideIcon
}

interface NavDropdownProps {
    isOpen: boolean
    title: string
    items: DropdownItem[]
    close: () => void
}

export const NavDropdown: React.FC<NavDropdownProps> = ({ isOpen, title, items, close }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 z-50"
                >
                    <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden p-2">
                        {items.map((item: DropdownItem, idx: number) => (
                            <motion.a
                                key={idx}
                                href={item.href}
                                onClick={close}
                                whileHover={{ x: 4, backgroundColor: "rgba(0, 0, 0, 0.03)" }}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-black rounded-lg transition-all"
                            >
                                <item.icon className="w-4 h-4 opacity-50" />
                                {item.label}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}