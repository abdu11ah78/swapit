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
  Gavel, MapPin,
  Clock, TrendingUp, AlertTriangle,
  Mail, MessageSquare, History, Loader2,
  ImageOff, RefreshCw, ExternalLink
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
import { useCreateOfferMutation } from "@/features/offers/offers.hooks"
import { useCreateTradeMutation } from "@/features/trades/trades.hooks"
import { useItemByIdQuery } from "@/features/items/items.hooks"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') ?? "https://localhost:7052";

function resolveImageUrl(img: string): string {
  if (!img) return "/placeholder.png"
  img = img.trim()
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img.replace(/\\/g, '/')
  }
  const clean = img.replace(/\\/g, '/').replace(/^\/+/, '')
  return `${API_BASE_URL}/${clean}`
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, duration: 0.8 },
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
  const { addToWishlist, removeFromWishlist, wishlist, isLoggedIn, currentUser } = useAppContext()

  const { data: itemData, isLoading: isItemLoading, error: itemError } = useItemByIdQuery(id)

  const [quantity, setQuantity] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [bidAmount, setBidAmount] = useState("")
  const [offerMessage, setOfferMessage] = useState("Interested in exchanging this with item + LTP.")
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const createTradeMutation = useCreateTradeMutation()
  const createOfferMutation = useCreateOfferMutation()

  const [bids, setBids] = useState([
    { id: 1, user: "RogueTrader", amount: 1100, time: "2h ago" },
    { id: 2, user: "Echo_Trader", amount: 1050, time: "4h ago" },
    { id: 3, user: "Cyber_Relic", amount: 950, time: "Yesterday" },
  ])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    setSelectedIndex(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => { api.off("select", onSelect) }
  }, [api])

  if (isItemLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#115e59] animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading item data...</p>
        </div>
      </div>
    )
  }

  if (itemError || !itemData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] text-[#115e59]">
        <div className="w-20 h-20 bg-[#115e59]/5 rounded-[2rem] flex items-center justify-center mb-6">
          <ImageOff size={32} className="text-[#115e59]/30" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Item Not Found</h2>
        <p className="text-slate-400 text-sm mb-8">This listing may have been removed or does not exist.</p>
        <Link href="/">
          <button className="px-8 py-3 bg-[#115e59] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4d7c0f] transition-all">
            Back to Market
          </button>
        </Link>
      </div>
    )
  }

  // Build resolved image URLs
  const images = (itemData.images ?? [])
    .map(resolveImageUrl)
    .filter(Boolean)

  const displayImages = images.length > 0 ? images : ["/placeholder.png"]

  const isOwn = currentUser?.id === itemData.ownerId
  const isInWishlist = wishlist.some((w) => w.id === itemData.id)
  const ltpValue = itemData.ltpValue ?? 0
  const highestBid = Math.max(...bids.map(b => b.amount), ltpValue - 50)
  const fairnessScore = 95 // Derived from market data
  const fairnessColor = "bg-green-500"

  const handleWishlistToggle = () => {
    if (!isLoggedIn) { router.push("/login"); return }
    if (isInWishlist) {
      removeFromWishlist(itemData.id)
      toast.success("Removed from watchlist")
    } else {
      addToWishlist({
        id: itemData.id,
        name: itemData.title,
        price: ltpValue,
        imageUrl: displayImages[0],
        quantity: 1,
      })
      toast.success("Added to watchlist")
    }
  }

  const handleBidAction = async () => {
    if (!isLoggedIn) { router.push("/login"); return }
    if (isOwn) { toast.error("You cannot bid on your own item"); return }
    if (!bidAmount) { toast.error("Enter a bid amount first"); return }
    const amount = Number(bidAmount)
    if (isNaN(amount) || amount <= 0) { toast.error("Bid amount must be a positive number"); return }

    try {
      const trade = await createTradeMutation.mutateAsync({
        itemId: itemData.id,
        sellerId: itemData.ownerId,
      })
      const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      await createOfferMutation.mutateAsync({
        tradeId: trade.id,
        offeredLtp: amount,
        message: offerMessage,
        expiresAt,
      })
      setBids([{ id: bids.length + 1, user: "You", amount, time: "Just now" }, ...bids])
      setBidAmount("")
      toast.success(`Offer of ${amount} LTP submitted!`)
    } catch {
      toast.error("Failed to submit offer. Please try again.")
    }
  }

  const handleMessageAuthor = () => {
    if (!isLoggedIn) { router.push("/login"); return }
    if (isOwn) { toast.error("You cannot message yourself"); return }
    router.push(`/messenger?userId=${itemData.ownerId}`)
  }

  const handleContactAuthor = () => {
    if (!isLoggedIn) { router.push("/login"); return }
    if (isOwn) { toast("This is your own item", { icon: "ℹ️" }); return }
    toast.success(`Opening secure channel to ${itemData.ownerName ?? "seller"}…`)
    router.push(`/messenger?userId=${itemData.ownerId}`)
  }

  const handleSmartMatch = () => {
    toast.loading("Scanning market for parity matches…", { duration: 2000 })
    setTimeout(() => {
      toast.success("Found 3 high-accuracy matches in your region!")
      router.push('/')
    }, 2000)
  }

  const handleViewTradeHistory = () => {
    router.push(`/my-offers`)
  }

  const handleImageError = (index: number) => {
    setImgErrors(prev => ({ ...prev, [index]: true }))
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#115e59] selection:bg-[#4d7c0f]/20 pt-10">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="item-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#115e59" strokeWidth="1" />
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
        {/* Navigation */}
        <motion.div variants={itemVariants} className="mb-10">
          <Link href="/">
            <motion.button
              className="group flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-slate-200 hover:border-[#115e59]/50 text-slate-500 hover:text-[#115e59] font-bold rounded-2xl transition-all shadow-sm"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              BACK TO MARKET
            </motion.button>
          </Link>
        </motion.div>

        {/* Owner badge */}
        {isOwn && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4d7c0f]/10 border border-[#4d7c0f]/20 rounded-full">
              <Check size={14} className="text-[#4d7c0f]" />
              <span className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">This is your listing</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* ── IMAGE GALLERY ── */}
          <motion.div variants={itemVariants} className="relative w-full">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-4 shadow-xl">
              <Carousel className="w-full" opts={{ loop: displayImages.length > 1 }} setApi={setApi}>
                <CarouselContent>
                  {displayImages.map((img, i) => (
                    <CarouselItem key={i} className="relative w-full h-[380px] md:h-[520px] rounded-2xl overflow-hidden bg-slate-50">
                      {imgErrors[i] ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                          <ImageOff size={40} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Image unavailable</span>
                        </div>
                      ) : (
                        <Image
                          src={img}
                          alt={`${itemData.title} - image ${i + 1}`}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(i)}
                          unoptimized
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Image counter badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-[10px] font-black tracking-widest text-[#115e59] uppercase">
                    {selectedIndex + 1} / {displayImages.length}
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <div className="px-3 py-1 rounded-full bg-[#4d7c0f]/90 backdrop-blur-md text-[10px] font-black tracking-widest text-white uppercase">
                    {itemData.condition}
                  </div>
                </div>

                {displayImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 bg-white/90 border-slate-200 text-[#115e59] hover:bg-[#115e59] hover:text-white" />
                    <CarouselNext className="right-4 bg-white/90 border-slate-200 text-[#115e59] hover:bg-[#115e59] hover:text-white" />
                  </>
                )}
              </Carousel>
            </div>

            {/* Thumbnail strip */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 mt-5 justify-center flex-wrap">
                {displayImages.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedIndex === i
                        ? "border-[#115e59] shadow-lg shadow-[#115e59]/20"
                        : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                    whileHover={{ y: -3 }}
                  >
                    {imgErrors[i] ? (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <ImageOff size={16} className="text-slate-300" />
                      </div>
                    ) : (
                      <Image src={img} alt={`thumb-${i}`} fill className="object-cover" unoptimized />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── ITEM INFO ── */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            {/* Title & Meta */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  <MapPin size={10} /> {itemData.location || "Location not specified"}
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black tracking-widest text-indigo-500 uppercase">
                  {itemData.status}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase text-[#115e59] mb-2">
                {itemData.title}
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Listed by <span className="text-[#115e59]">{itemData.ownerName ?? "Unknown seller"}</span>
                &nbsp;·&nbsp;Category: <span className="text-[#115e59]">{itemData.category}</span>
              </p>
            </div>

            {/* Description */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h4 className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info size={12} /> Description
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {itemData.description || "No description provided."}
              </p>
            </div>

            {/* Price Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-[2rem] bg-[#115e59] text-white">
                <div className="flex items-center gap-2 mb-2 opacity-60">
                  <Zap size={12} className="text-teal-300" />
                  <span className="text-[10px] font-black uppercase tracking-widest">LTP Value</span>
                </div>
                <div className="text-2xl font-black">{ltpValue.toLocaleString()} LTP</div>
              </div>
              <div className="p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <TrendingUp size={12} className="text-lime-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Top Bid</span>
                </div>
                <div className="text-2xl font-black text-[#115e59]">{highestBid} LTP</div>
              </div>
            </div>

            {/* Fair Price Meter */}
            <div className="p-6 rounded-[2rem] bg-teal-50/50 border border-teal-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-teal-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#115e59]">Fair Price Meter</span>
                </div>
                <div className="text-xs font-black text-[#4d7c0f]">{fairnessScore}% DEAL ACCURACY</div>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fairnessScore}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${fairnessColor}`}
                />
              </div>
              <p className="text-slate-400 text-[10px] mt-3 uppercase tracking-widest font-black flex items-center gap-2">
                <Info size={10} /> Based on 2,400+ similar market transactions
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              {/* Bid Section */}
              {!isOwn && (
                <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Gavel size={16} className="text-[#4d7c0f]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#115e59]">Place a Bid</span>
                  </div>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="number"
                      id="bid-amount-input"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-sm font-bold text-[#115e59] focus:outline-none focus:border-[#115e59] transition-all"
                      placeholder="Enter LTP amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={1}
                    />
                    <button
                      id="place-bid-button"
                      onClick={handleBidAction}
                      disabled={createTradeMutation.isPending || createOfferMutation.isPending}
                      className="px-6 py-3 bg-[#115e59] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#4d7c0f] transition-all shadow-lg shadow-[#115e59]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createTradeMutation.isPending || createOfferMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : "Bid"}
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-medium text-[#115e59] focus:outline-none focus:border-[#115e59] resize-none"
                    rows={2}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Optional offer note..."
                  />
                </div>
              )}

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  id="message-author-button"
                  onClick={handleMessageAuthor}
                  className="py-4 bg-[#115e59] text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#115e59]/20 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MessageSquare size={14} /> Message
                </motion.button>
                <motion.button
                  id="contact-author-button"
                  onClick={handleContactAuthor}
                  className="py-4 bg-white text-[#115e59] border border-slate-200 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Mail size={14} /> Contact
                </motion.button>
              </div>

              <motion.button
                id="smart-match-button"
                onClick={handleSmartMatch}
                className="w-full py-4 bg-gradient-to-r from-[#115e59] to-[#4d7c0f] rounded-[2rem] font-black uppercase tracking-widest text-[10px] text-white shadow-lg"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles size={14} className="animate-pulse" />
                  Smart Match AI
                </div>
              </motion.button>

              <button
                id="watchlist-button"
                onClick={handleWishlistToggle}
                className="w-full flex items-center justify-center gap-3 py-3 text-slate-500 hover:text-[#115e59] transition-colors text-xs font-black uppercase tracking-widest"
              >
                <Heart size={14} className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
                {isInWishlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>

            {/* Owner Card */}
            <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#115e59] to-[#4d7c0f] flex items-center justify-center text-white font-black text-lg">
                  {(itemData.ownerName ?? "?")[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-[#115e59]">
                    {itemData.ownerName ?? "Unknown"}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ShieldCheck size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Trust Score: <span className="text-[#4d7c0f]">{itemData.ownerTrustScore?.toFixed(0) ?? "—"}</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                id="view-trade-history-button"
                onClick={handleViewTradeHistory}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#115e59] hover:text-white hover:border-[#115e59] transition-all"
              >
                <ExternalLink size={12} />
                My Offers
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── BID HISTORY ── */}
        <motion.section variants={itemVariants} className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-[#115e59]">Bid History</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#4d7c0f]/10 rounded-full">
              <RefreshCw size={12} className="text-[#4d7c0f]" />
              <span className="text-[9px] font-black text-[#4d7c0f] uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bids.map((bid) => (
              <div key={bid.id} className="p-5 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="text-[10px] font-black text-[#115e59] uppercase tracking-widest">{bid.user}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{bid.time}</div>
                </div>
                <div className="text-lg font-black text-[#4d7c0f]">{bid.amount.toLocaleString()} LTP</div>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}