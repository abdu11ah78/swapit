// components/common/pronavbar/MobileMenu.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Heart, User } from "lucide-react"
import { NavItem, MegaMenuSection, DropdownItem } from "../types"

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    navItems: NavItem[]
    wishlistCount: number
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navItems, wishlistCount }) => {
    const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
                    />

                    {/* Side Menu */}
                    <motion.div
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 h-screen z-[60] w-72 sm:w-80 bg-white overflow-y-auto pt-20 pb-8 shadow-2xl"
                    >
                        {/* Navigation Items */}
                        <nav className="space-y-0">
                            {navItems.map((item) => {
                                const isActive = activeMobileDropdown === item.id

                                return (
                                    <div key={item.id}>
                                        <button
                                            onClick={() => {
                                                setActiveMobileDropdown(isActive ? null : item.id);
                                            }}
                                            className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                        >
                                            <span>{item.label}</span>
                                            <motion.div
                                                animate={{ rotate: isActive ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ChevronDown className="w-4 h-4 text-gray-500" />
                                            </motion.div>
                                        </button>

                                        {/* Subcategories */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                >
                                                    {/* Mobile Mega Menu Rendering */}
                                                    {item.type === 'mega' && item.megaSections ? (
                                                        <div className="py-2">
                                                            {item.megaSections.map((section: MegaMenuSection, sIdx: number) => (
                                                                <div key={sIdx} className="px-6 mb-4 last:mb-0">
                                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2">{section.title}</h4>
                                                                    <div className="space-y-1 ml-2 border-l border-gray-200 pl-4">
                                                                        {section.items.map((subItem: DropdownItem, idx: number) => (
                                                                            <a
                                                                                key={idx}
                                                                                href={subItem.href}
                                                                                onClick={onClose}
                                                                                className="block py-1.5 text-sm text-gray-600 hover:text-black transition-colors"
                                                                            >
                                                                                {subItem.label}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        // Standard Mobile Dropdown Rendering
                                                        (item.items || []).map((subItem: DropdownItem, idx: number) => (
                                                            <a
                                                                key={idx}
                                                                href={subItem.href}
                                                                onClick={onClose}
                                                                className="block px-6 py-3 pl-12 text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                                                            >
                                                                {subItem.label}
                                                            </a>
                                                        ))
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Mobile Additional Links */}
                        <div className="px-6 mt-8 space-y-4">
                            <button className="w-full flex items-center gap-3 text-sm font-medium text-gray-800 hover:text-black transition-colors">
                                <Heart className="w-4 h-4" />
                                <span>Wishlist ({wishlistCount})</span>
                            </button>
                            <button className="w-full flex items-center gap-3 text-sm font-medium text-gray-800 hover:text-black transition-colors">
                                <User className="w-4 h-4" />
                                <span>Account</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}