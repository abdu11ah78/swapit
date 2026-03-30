// components/common/pronavbar/SearchModal.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-lg flex items-start justify-center pt-16 sm:pt-24"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: -40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-3xl mx-4"
                    >
                        <div className="relative bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-6 sm:left-8 top-1/2 transform -translate-y-1/2 w-5 sm:w-6 h-5 sm:h-6 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products, collections, or categories..."
                                    autoFocus
                                    className="w-full pl-14 sm:pl-16 pr-6 sm:pr-8 py-5 sm:py-6 text-base sm:text-lg outline-none bg-transparent text-white placeholder:text-gray-500"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400" />
                                </button>
                            </div>

                            {/* Search Tags */}
                            <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-white/5">
                                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Quick Search</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Products', 'New Arrivals', 'Sale', 'Electronics', 'Fashion'].map((tag) => (
                                        <motion.button
                                            key={tag}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-all border border-white/10"
                                        >
                                            {tag}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}