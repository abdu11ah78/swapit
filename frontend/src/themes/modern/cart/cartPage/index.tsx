"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Wallet, ArrowRight, Heart, Zap, ShieldCheck, History, Check, Gavel } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"

interface RecommendedAsset {
  id: string
  name: string
  price: number
  imageUrl: string
  href: string
}

export function WalletPage() {
  const { wallet, removeFromWallet, updateQuantity, wishlist, addToWishlist, removeFromWishlist } = useAppContext()
  const router = useRouter()
  const [agreedToProtocol, setAgreedToProtocol] = useState(false)

  // Calculate totals in LTC
  const subtotal = wallet.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
  const assetCount = wallet.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const networkFee = wallet.length > 0 ? (subtotal > 1000 ? 0 : 25) : 0
  const governanceFee = subtotal * 0.05 // 5% protocol fee
  const totalLTC = subtotal + networkFee + governanceFee

  // Mock recommended assets
  const recommendedAssets: RecommendedAsset[] = useMemo(() => {
    return [
      { id: "sim1", name: "Neural Link Core", price: 850, imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80", href: "/items/sim1" },
      { id: "sim2", name: "Data Shard Rev 4", price: 420, imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80", href: "/items/sim2" },
      { id: "sim3", name: "Uplink Module", price: 1200, imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80", href: "/items/sim3" },
      { id: "sim4", name: "Sync Processor", price: 310, imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=300&q=80", href: "/items/sim4" },
    ]
  }, [])

  const handleConfirmTrades = () => {
    router.push("/confirm-trade")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 sm:pt-30 pb-12 selection:bg-indigo-500/30">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wallet-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wallet-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Trading Terminal Active</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Digital Wallet</h1>
            <p className="text-slate-500 mt-2 font-medium">{assetCount} ACTIVE TRADE SIGNALS DETECTED</p>
          </div>

          <div className="p-6 rounded-[2rem] bg-indigo-600/10 border border-indigo-600/20 backdrop-blur-xl">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Total Trading Power</div>
            <div className="text-3xl font-black">{totalLTC.toFixed(0)} LTC</div>
          </div>
        </motion.div>

        {wallet.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/50 rounded-[3rem] border border-slate-800"
          >
            <Wallet className="w-20 h-20 text-slate-800 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">No Active Bids</h2>
            <p className="text-slate-500 mb-10 max-w-sm">Your wallet is currently offline. Synchronize with the network to start trading assets.</p>
            <motion.button
              onClick={() => router.push("/shop")}
              className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter Global Shop <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {wallet.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative flex gap-6 p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/30 rounded-[2.5rem] transition-all"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-700">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={10} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Record</span>
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-tight truncate">{item.name}</h3>
                      <div className="text-2xl font-black text-indigo-400 mt-1">{item.price} LTC</div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <motion.button
                        onClick={() => removeFromWallet(item.id)}
                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                      <div className="flex items-center gap-3 bg-slate-950 rounded-2xl p-1.5 border border-slate-800">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-black text-sm">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border border-slate-800 p-8 sticky top-30">
                <div className="flex items-center gap-2 mb-8">
                  <History size={18} className="text-indigo-400" />
                  <h2 className="text-xl font-black uppercase tracking-tighter">Trade Intel</h2>
                </div>
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-800">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-500">Gross Asset Value</span>
                    <span>{subtotal.toFixed(0)} LTC</span>
                  </div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-500">Network Transmission</span>
                    <span>
                      {networkFee === 0 ? (
                        <span className="text-indigo-400 italic">PRIORITY FREE</span>
                      ) : (
                        `${networkFee} LTC`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-500">Protocol Governance (5%)</span>
                    <span>{governanceFee.toFixed(0)} LTC</span>
                  </div>
                </div>
                <div className="mb-10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Consolidated Bid Power</div>
                  <motion.div
                    className="text-5xl font-black text-white"
                    key={totalLTC}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    {totalLTC.toFixed(0)}<span className="text-indigo-500 ml-2">LTC</span>
                  </motion.div>
                </div>
                <label className="flex items-start gap-3 mb-8 cursor-pointer group">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={agreedToProtocol}
                      onChange={(e) => setAgreedToProtocol(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-slate-700 rounded-lg peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all" />
                    <Check size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-tight">
                    I confirm my identity and adhere to the <a href="#" className="text-white underline decoration-indigo-500">SwapIt Protocol V2.1</a> terms.
                  </span>
                </label>
                <motion.button
                  onClick={handleConfirmTrades}
                  disabled={!agreedToProtocol}
                  className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${agreedToProtocol
                      ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-indigo-500"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    }`}
                  whileHover={agreedToProtocol ? { scale: 1.02 } : {}}
                  whileTap={agreedToProtocol ? { scale: 0.98 } : {}}
                >
                  Confirm Active Bids <Gavel size={14} className={agreedToProtocol ? "text-white" : "text-slate-600"} />
                </motion.button>
                <button
                  onClick={() => router.push("/shop")}
                  className="w-full mt-4 py-4 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  Continue Browsing Signals
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {wallet.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <div className="flex items-center gap-4 mb-10">
              <ShieldCheck size={24} className="text-indigo-400" />
              <h2 className="text-2xl font-black uppercase tracking-tighter">AI-Matched Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-4 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all"
                >
                  <Link href={asset.href}>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 mb-6">
                      <Image
                        src={asset.imageUrl}
                        alt={asset.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0"
                      />
                    </div>
                  </Link>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors line-clamp-1 mb-2">
                    {asset.name}
                  </h3>
                  <div className="text-xl font-black mb-6">{asset.price} LTC</div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="w-full py-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    Quick Signal
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default WalletPage