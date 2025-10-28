/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, Eye, Heart, Check, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { useState, useRef, useEffect } from "react"

export type ProductCardProps = {
  id: string
  name: string
  price: number
  imageUrl?: string
  href: string
}

export function ProductCard({ id, name, price, imageUrl, href }: ProductCardProps) {
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useAppContext()
  const fallbackImage = "/shop/placeholder-product.jpg"

  const cartItem = { id, name, price, imageUrl: imageUrl ?? fallbackImage, quantity: 1 }

  const isInWishlist = wishlist.some((item) => item.id === id)
  const isInCart = cart.some((item) => item.id === id)

  const [pinnedView, setPinnedView] = useState(false)
  const [pinnedWishlist, setPinnedWishlist] = useState(false)
  const [pinnedCart, setPinnedCart] = useState(false)
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
      addToWishlist(cartItem)
      setPinnedWishlist(true)
    }
  }

  const handleCartToggle = () => {
    if (!isInCart) {
      addToCart(cartItem)
      setPinnedCart(true)
    } else {
      setPinnedCart((prev) => !prev)
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
      className="group relative w-full h-[300px] sm:h-[350px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-700/50 bg-neutral-950"
      whileHover={!isMobile ? { scale: 1.03 } : {}}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      style={
        !isMobile
          ? {
              background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.1), transparent 80%)`
            }
          : {}
      }
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Animated accent lines */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* -------- ACTION BUTTONS (centered, floating layout) -------- */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="flex gap-3 sm:gap-5">
            {/* Quick View */}
            <motion.div
              className={`pointer-events-auto transition-all duration-300 ${
                (pinnedView || (isMobile && shouldShowButtons)) ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={pinnedView ? { boxShadow: ["0 0 20px rgba(255,255,255,0.3)", "0 0 30px rgba(255,255,255,0.5)"] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button
                  size="icon"
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    pinnedView
                      ? "bg-white/20 border-white/60 text-white"
                      : "bg-white/10 border-white/30 text-white/80 hover:bg-white/15 hover:border-white/50"
                  }`}
                  onClick={handleQuickViewToggle}
                >
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Wishlist */}
            <motion.div
              className={`pointer-events-auto transition-all duration-300 ${
                (pinnedWishlist || (isMobile && shouldShowButtons)) ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isInWishlist ? { boxShadow: ["0 0 20px rgba(236,72,153,0.3)", "0 0 30px rgba(236,72,153,0.5)"] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button
                  size="icon"
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    isInWishlist || pinnedWishlist
                      ? "bg-pink-600/80 border-pink-400/80 text-white"
                      : "bg-white/10 border-white/30 text-white/80 hover:bg-pink-600/20 hover:border-pink-400/50"
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                      isInWishlist || pinnedWishlist ? "fill-white text-white scale-110" : "text-white/80"
                    }`}
                  />
                </Button>
              </motion.div>
            </motion.div>

            {/* Add to Cart */}
            <motion.div
              className={`pointer-events-auto transition-all duration-300 ${
                (pinnedCart || (isMobile && shouldShowButtons)) ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isInCart ? { boxShadow: ["0 0 20px rgba(16,185,129,0.3)", "0 0 30px rgba(16,185,129,0.5)"] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button
                  size="icon"
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    isInCart || pinnedCart
                      ? "bg-emerald-500/80 border-emerald-300/80 text-white"
                      : "bg-white/10 border-white/30 text-white/80 hover:bg-emerald-500/20 hover:border-emerald-300/50"
                  }`}
                  onClick={handleCartToggle}
                >
                  {isInCart ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* -------- DETAILS OVERLAY (bottom-left, modern style) -------- */}
        <motion.div
          className="absolute left-0 bottom-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <motion.div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Sparkles className="w-3 h-3 text-white/70" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-widest">Premium</span>
          </motion.div>

          <motion.h3
            className="text-xs sm:text-sm md:text-base font-bold text-white mb-1.5 leading-tight line-clamp-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {name}
          </motion.h3>

          <motion.div
            className="flex items-baseline gap-1.5 mb-2 sm:mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-base sm:text-lg md:text-xl font-black text-white">${price.toFixed(2)}</p>
            <p className="text-xs text-white/50 font-medium">USD</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href={href} className="group inline-flex items-center text-white text-xs font-bold transition-all hover:text-white/80 gap-1.5">
              <span className="relative">
                View Details
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-white/60 to-transparent group-hover:w-full transition-all duration-300"
                />
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}