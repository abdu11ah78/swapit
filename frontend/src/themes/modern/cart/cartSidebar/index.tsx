"use client"

import { motion, AnimatePresence, type Variants } from "framer-motion"
import { X, Wallet, Zap, ShieldCheck, History, Gavel, Trash2, Check } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

interface WalletSidebarProps {
  close: () => void
}

const sidebarVariants: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export function WalletSidebar({ close }: WalletSidebarProps) {
  const { wallet, removeFromWallet, updateQuantity } = useAppContext()
  const router = useRouter()

  const subtotal = wallet.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
  const assetCount = wallet.reduce((acc, item) => acc + (item.quantity || 1), 0)

  const handleConfirmTrades = () => {
    close()
    router.push("/confirm-trade")
  }

  const handleViewWallet = () => {
    close()
    router.push("/wallet")
  }

  return (
    <AnimatePresence mode="wait">
      {/* Overlay */}
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={close}
      />

      {/* Sidebar */}
      <motion.div
        key="sidebar"
        className="fixed top-0 right-0 w-full sm:w-[480px] h-full bg-slate-900 shadow-2xl z-[101] flex flex-col overflow-hidden border-l border-slate-800"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Trading Node</span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              Digital Wallet ({assetCount})
            </h2>
          </div>
          <motion.button
            onClick={close}
            className="p-2 hover:bg-slate-800 cursor-pointer rounded-full transition-colors group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5 text-slate-500 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Assets List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {wallet.length === 0 ? (
              <motion.div
                className="h-full flex flex-col items-center justify-center text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="p-6 rounded-full bg-slate-800/50 mb-6">
                  <Wallet className="w-12 h-12 text-slate-700" />
                </div>
                <p className="text-white font-black uppercase tracking-widest text-xs">No active signals</p>
                <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest">Connect to trade hub to populate</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {wallet.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex gap-4 p-4 bg-slate-800/30 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-[10px] font-black uppercase tracking-tight text-white truncate">{item.name}</h4>
                      <p className="text-sm font-black text-indigo-400 mt-0.5">{item.price} LTC</p>
                    </div>
                    <div className="flex flex-col items-end justify-between py-1">
                      <button onClick={() => removeFromWallet(item.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                      <div className="text-[10px] font-black text-slate-500">x{item.quantity}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {wallet.length > 0 && (
          <motion.div
            className="p-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Total</span>
                <div className="text-3xl font-black text-white">{subtotal.toFixed(0)} LTC</div>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={handleViewWallet}
                className="py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <History size={14} /> Wallet
              </motion.button>
              <motion.button
                onClick={handleConfirmTrades}
                className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Gavel size={14} /> Trade
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}