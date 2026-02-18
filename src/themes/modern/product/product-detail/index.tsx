"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useAppContext } from "@/context/AppContext"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  Minus, Plus, Star, Heart,
  ArrowLeft, Sparkles, Check,
  ShieldCheck, Info, Zap,
  Gavel, RefreshCw, MapPin,
  Clock, TrendingUp, AlertTriangle,
  Mail, MessageSquare, History
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import toast from 'react-hot-toast'

export type Item = {
  id: string
  name: string
  price: number // LT Coins
  aiEstimatedValue: number
  highestBid: number
  isAuctionEnabled: boolean
  isBarterEnabled: boolean
  location: string
  condition: string
  ownerTrustScore: number
  images: string[]
  description: string
  usage?: string
  defects?: string
  sku: string
  stock: number
  reviews: { user: string; rating: number; comment: string }[]
}

const ITEMS: Item[] = [
  {
    id: "1",
    name: "Quantum Series X-1 Prototype",
    price: 1250,
    aiEstimatedValue: 1200,
    highestBid: 1100,
    isAuctionEnabled: true,
    isBarterEnabled: true,
    location: "Lahore, DHA Phase 6",
    condition: "Mint Prototype",
    ownerTrustScore: 98,
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    ],
    description: "A rare experimental hardware core. Features neural-link capabilities and advanced heat dissipation. Only 5 units produced for the global marketplace.",
    usage: "Used for 3 months in a controlled lab environment. Minimal wear.",
    defects: "None. System integrity is at 100%.",
    sku: "SWP-X1-PROTO",
    stock: 1,
    reviews: [
      { user: "Hiroshi T.", rating: 5, comment: "Authentic hardware. AI valuation was spot on." },
      { user: "Elena V.", rating: 4, comment: "High quality but heavy power requirements." },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.8,
    },
  },
} as Variants

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
} as Variants

export function ItemDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { addToWallet, addToWishlist, removeFromWishlist, wishlist, updateQuantity, wallet } =
    useAppContext()
  const item = ITEMS.find((p) => p.id === id) || ITEMS[0] // Fallback for demo

  const [quantity, setQuantity] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [addedToWallet, setAddedToWallet] = useState(false)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    setSelectedIndex(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (!item) return null

  const isInWishlist = wishlist.some((w) => w.id === item.id)
  const avgRating = item.reviews.length > 0
    ? Math.round((item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length) * 10) / 10
    : 0

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(item.id)
      toast.success("Item removed from watchlist")
    } else {
      addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.images[0] ?? "",
        quantity: 1,
      })
      toast.success("Item added to watchlist")
    }
  }

  const [bidAmount, setBidAmount] = useState("")
  const [bids, setBids] = useState([
    { id: 1, user: "RogueTrader", amount: 1100, time: "2h ago" },
    { id: 2, user: "Echo_Trader", amount: 1050, time: "4h ago" },
    { id: 3, user: "Cyber_Relic", amount: 950, time: "Yesterday" },
  ])

  const handleBidAction = () => {
    if (!bidAmount) return toast.error("Enter bid amount")
    const newBid = {
      id: bids.length + 1,
      user: "Me (You)",
      amount: parseInt(bidAmount),
      time: "Just now"
    }
    setBids([newBid, ...bids])
    setBidAmount("")
    toast.success(`Bid of ${bidAmount} LTP registered!`)
  }

  const handleSmartMatch = () => {
    toast.loading("Analyzing Point Parity matches...", { duration: 2000 })
    setTimeout(() => {
      toast.success("Found 3 High-Accuracy Matches in your location!")
      router.push('/')
    }, 2000)
  }

  const fairnessScore = Math.min(100, Math.max(0, 100 - Math.abs((item.price - item.aiEstimatedValue) / item.aiEstimatedValue * 100)))
  const fairnessColor = fairnessScore > 90 ? "bg-green-500" : fairnessScore > 75 ? "bg-indigo-500" : "bg-orange-500"

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#115e59] selection:bg-[#4d7c0f]/20 pt-10">
      {/* Background Artifacts */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="item-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#item-grid)" />
        </svg>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 lg:p-12 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Navigation Layer */}
        <motion.div variants={itemVariants} className="mb-10">
          <Link href="/">
            <motion.button
              className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white font-bold rounded-2xl transition-all"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              BACK TO MARKET
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* VISUAL CORE: Image Cluster */}
          <motion.div variants={itemVariants} className="relative w-full">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-6 shadow-2xl">
              <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
                <CarouselContent>
                  {item.images.map((img, i) => (
                    <CarouselItem
                      key={i}
                      className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden"
                    >
                      <Image src={img} alt={item.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute top-6 right-6 z-20">
                  <div className="px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800 text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                    Item Gallery
                  </div>
                </div>
                <CarouselPrevious className="left-4 bg-slate-900/80 border-slate-700 text-white" />
                <CarouselNext className="right-4 bg-slate-900/80 border-slate-700 text-white" />
              </Carousel>
            </div>

            <div className="flex gap-4 mt-8 justify-center">
              {item.images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedIndex === i ? "border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" : "border-slate-800 opacity-50 hover:opacity-100"
                    }`}
                  whileHover={{ y: -4 }}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* DATA CORE: Item Information */}
          <motion.div variants={itemVariants} className="flex flex-col gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                  Verified Item
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  <MapPin size={10} /> {item.location}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none uppercase">
                {item.name}
              </h1>

              <div className="space-y-6 mt-8">
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest mb-2">Detailed Description</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Clock size={14} /> Usage History
                    </h4>
                    <p className="text-slate-500 font-medium text-xs">
                      {item.usage || "No usage history provided."}
                    </p>
                  </div>

                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlertTriangle size={14} /> Known Defects
                    </h4>
                    <p className="text-slate-500 font-medium text-xs">
                      {item.defects || "No known defects."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Zap size={14} className="text-teal-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI ESTIMATED</span>
                </div>
                <div className="text-3xl font-black">{item.aiEstimatedValue} LTP</div>
              </div>
              <div className="p-6 rounded-[2rem] bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <TrendingUp size={14} className="text-lime-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">HIGHEST BID</span>
                </div>
                <div className="text-3xl font-black">{item.highestBid} LTP</div>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-teal-500/5 border border-teal-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-teal-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Fair Price Meter</span>
                </div>
                <div className="text-xs font-black text-indigo-400">{fairnessScore}% DEAL ACCURACY</div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fairnessScore}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${fairnessColor} shadow-[0_0_10px_rgba(99,102,241,0.5)]`}
                />
              </div>
              <p className="text-slate-500 text-[10px] mt-4 uppercase tracking-widest font-black flex items-center gap-2">
                <Info size={12} /> Valuation based on 2,400+ similar market transactions
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white text-black">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Current Price</div>
                  <div className="text-4xl font-black leading-none">{item.price} LTC</div>
                </div>
                <div className="flex items-center gap-2 h-12 bg-black/5 rounded-2xl px-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-black/10 rounded-lg transition-colors"><Minus size={14} /></button>
                  <span className="w-8 text-center font-black text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/10 rounded-lg transition-colors"><Plus size={14} /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 p-8 rounded-[2rem] bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 mb-6">
                    <Gavel size={18} className="text-[#4d7c0f]" />
                    <span className="text-xs font-black uppercase tracking-widest">Call a Bid</span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-[#115e59]"
                      placeholder="Enter LTP amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <button
                      onClick={handleBidAction}
                      className="px-8 py-4 bg-[#115e59] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#4d7c0f] transition-all shadow-xl shadow-[#115e59]/20"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={() => router.push('/messenger')}
                  className="py-6 bg-[#115e59] text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#115e59]/20"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> MESSAGE AUTHOR
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => toast.success("Retrieving Encrypted Contact Member...")}
                  className="py-6 bg-white text-[#115e59] border border-slate-200 rounded-[2rem] font-black uppercase tracking-widest text-[10px]"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Mail size={16} /> CONTACT AUTHOR
                  </div>
                </motion.button>
              </div>

              <motion.button
                onClick={handleSmartMatch}
                className="w-full py-5 bg-gradient-to-r from-[#115e59] to-[#4d7c0f] rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#115e59]/20"
                whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(77, 124, 15, 0.4)" }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <Sparkles size={16} className="text-[#ccfbf1] animate-pulse" />
                  Contextual Smart Match AI
                </div>
              </motion.button>

              <button
                onClick={handleWishlistToggle}
                className="w-full flex items-center justify-center gap-3 py-4 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
              >
                <Heart size={16} className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
                {isInWishlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-xl font-black">
                    {item.ownerTrustScore}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest">Member Trust Score</div>
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase">
                    <ShieldCheck size={12} className="text-indigo-500" /> Verified Member
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                View Trade History
              </button>
            </div>
          </motion.div>
        </div>

        <motion.section variants={itemVariants} className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Verified Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-indigo-500"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <span className="font-black text-lg">{avgRating} / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {item.reviews.map((rev, i) => (
                <div key={i} className="p-8 rounded-[3rem] bg-white border border-slate-100 hover:border-[#115e59]/20 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-black text-xs uppercase tracking-widest text-[#115e59]">{rev.user}</div>
                    <div className="flex text-[#4d7c0f]">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={10} fill={j < rev.rating ? "currentColor" : "none"} className={j < rev.rating ? "" : "text-slate-200"} />)}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm italic font-medium">"{rev.comment}"</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-8 h-fit">
              <div className="flex items-center gap-2 mb-8">
                <History size={18} className="text-[#115e59]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#115e59]">Recent Bid History</h3>
              </div>
              <div className="space-y-6">
                {bids.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#115e59] uppercase tracking-widest">{bid.user}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{bid.time}</span>
                    </div>
                    <span className="text-sm font-black text-[#4d7c0f]">{bid.amount} LTP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}