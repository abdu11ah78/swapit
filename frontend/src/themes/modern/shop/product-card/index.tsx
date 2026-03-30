/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Coins, Eye, Heart, Check, ArrowRight, Sparkles, Repeat, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { useState, useRef, useEffect } from "react"

export type ItemCardProps = {
  id: string
  name: string
  price: number // LT Coins
  imageUrl?: string
  href: string
  aiValue?: number
  trustScore?: number
  isSwapReady?: boolean
}

export function ItemCard({ id, name, price, imageUrl, href, aiValue, trustScore, isSwapReady }: ItemCardProps) {
  const { wallet, wishlist, addToWallet, addToWishlist, removeFromWishlist } = useAppContext()
  const fallbackImage = "/shop/placeholder-product.jpg"

  const walletItem = { id, name, price, imageUrl: imageUrl ?? fallbackImage, quantity: 1 }

  const isInWishlist = wishlist.some((item) => item.id === id)
  const isInWallet = wallet.some((item) => item.id === id)

  const [pinnedView, setPinnedView] = useState(false)
  const [pinnedWishlist, setPinnedWishlist] = useState(false)
  const [pinnedWallet, setPinnedWallet] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isInView, setIsInView] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Intersection Observer for mobile - show buttons when card is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.5 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(id)
      setPinnedWishlist(false)
    } else {
      addToWishlist(walletItem)
      setPinnedWishlist(true)
    }
  }

  const handleWalletToggle = () => {
    if (!isInWallet) {
      addToWallet(walletItem)
      setPinnedWallet(true)
    } else {
      setPinnedWallet((prev) => !prev)
    }
  }

  const handleQuickViewToggle = () => {
    setPinnedView((prev) => !prev)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Determine if buttons should be visible
  const shouldShowButtons = isMobile ? isInView : true

  return (
    <motion.div
      ref={cardRef}
      className="group relative w-full h-[300px] sm:h-[350px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950"
      whileHover={!isMobile ? { scale: 1.03 } : {}}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      style={
        !isMobile
          ? {
            background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`
          }
          : {}
      }
    >
      {/* AI & Swap Badges */}
      <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
        {isSwapReady && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-400/30 uppercase tracking-widest"
          >
            <Repeat className="w-3 h-3" />
            Swap Ready
          </motion.div>
        )}
        {aiValue && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-indigo-400/30 uppercase tracking-widest"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            AI: {aiValue} LTC
          </motion.div>
        )}
      </div>

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* IMAGE */}
      <div className="relative w-full h-full">
        <Image
          src={imageUrl || fallbackImage}
          alt={name}
          fill
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />

        {/* Enhanced gradient overlay with glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* -------- ACTION BUTTONS -------- */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="flex gap-4">
            {/* Quick View */}
            <motion.div
              className={`pointer-events-auto transition-all duration-300 ${(pinnedView || (isMobile && shouldShowButtons)) ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
                }`}
            >
              <Button
                size="icon"
                className={`w-12 h-12 rounded-full border-2 backdrop-blur-xl shadow-xl transition-all duration-300 ${pinnedView
                    ? "bg-white/20 border-white/60 text-white"
                    : "bg-white/10 border-white/30 text-white hover:bg-white/15"
                  }`}
                onClick={handleQuickViewToggle}
              >
                <Eye className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Save to Wallet (Bid) */}
            <motion.div
              className={`pointer-events-auto transition-all duration-300 ${(pinnedWallet || (isMobile && shouldShowButtons)) ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
                }`}
            >
              <Button
                size="icon"
                className={`w-12 h-12 rounded-full border-2 backdrop-blur-xl shadow-xl transition-all duration-300 ${isInWallet || pinnedWallet
                    ? "bg-indigo-600/80 border-indigo-400 text-white"
                    : "bg-white/10 border-white/30 text-white hover:bg-indigo-600/20"
                  }`}
                onClick={handleWalletToggle}
              >
                {isInWallet ? <Check className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* -------- DETAILS OVERLAY -------- */}
        <motion.div
          className="absolute left-0 bottom-0 right-0 z-20 p-6 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"
        >
          {trustScore && (
            <motion.div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Trust: {trustScore}%</span>
            </motion.div>
          )}

          <Link href={href}>
            <h3 className="text-lg font-black text-white mb-2 leading-tight line-clamp-2 hover:text-indigo-400 transition-colors">
              {name}
            </h3>
          </Link>

          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-2xl font-black text-white">{price} LTC</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Asking</p>
          </div>

          <Link href={href} className="flex items-center text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] group/link">
            Protocol Details
            <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
