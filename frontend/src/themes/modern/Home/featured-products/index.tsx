"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coins, Heart, Repeat, ShieldCheck, Zap, ArrowRight } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export type ItemImage = {
  url: string
  alt?: string
}

export type Item = {
  id: string
  name: string
  price: string // LT Coins
  href: string
  images: ItemImage[]
  rating?: number
  description?: string
  aiValue?: string
  isSwapAvailable?: boolean
  trustScore?: number
}

type Props = {
  items?: Item[]
}

const demoItems: Item[] = [
  {
    id: "1",
    name: "MacBook Pro M1 (Used)",
    price: "4500 LTC",
    href: "/items/1",
    rating: 4.9,
    description: "Mint condition, 16GB RAM, 512GB SSD. Looking for a high-end camera swap or LTC.",
    aiValue: "4200 LTC",
    isSwapAvailable: true,
    trustScore: 98,
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60",
        alt: "MacBook Pro",
      },
    ],
  },
  {
    id: "2",
    name: "Canon EOS R5",
    price: "8500 LTC",
    href: "/items/2",
    rating: 4.8,
    description: "Professional mirrorless camera. Barely used. AI Fairness: 95%",
    aiValue: "8700 LTC",
    isSwapAvailable: true,
    trustScore: 100,
    images: [
      {
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=60",
        alt: "Canon Camera",
      },
    ],
  },
  {
    id: "3",
    name: "Vintage Vinyl Collection",
    price: "1200 LTC",
    href: "/items/3",
    rating: 4.5,
    description: "30+ classic rock vinyls. All in good condition.",
    aiValue: "1150 LTC",
    isSwapAvailable: true,
    trustScore: 85,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=60",
        alt: "Vinyl Records",
      },
    ],
  },
  {
    id: "4",
    name: "Gaming Chair (Ergonomic)",
    price: "900 LTC",
    href: "/items/4",
    rating: 4.2,
    description: "High back support, adjustable armrests. A few minor scratches.",
    aiValue: "850 LTC",
    isSwapAvailable: true,
    trustScore: 92,
    images: [
      {
        url: "https://images.unsplash.com/photo-1598550476439-6847785fce6e?auto=format&fit=crop&w=500&q=60",
        alt: "Gaming Chair",
      },
    ],
  },
]

interface ItemCardProps {
  item: Item
  isHovered: boolean
  setHoveredItem: (id: string | null) => void
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isHovered,
  setHoveredItem,
}) => {
  const { wallet, wishlist, addToWallet, addToWishlist, removeFromWishlist } = useAppContext()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const imageCount = item.images.length

  const isInWishlist = wishlist.some((w) => w.id === item.id)
  const isInWallet = wallet.some((w) => w.id === item.id)

  const priceNumber = parseFloat(item.price.replace(' LTC', ''))

  const walletItem = {
    id: item.id,
    name: item.name,
    price: priceNumber,
    imageUrl: item.images[0]?.url || '',
    quantity: 1
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(walletItem)
    }
  }

  const handleAddToWallet = () => {
    if (!isInWallet) {
      addToWallet(walletItem)
    }
  }

  React.useEffect(() => {
    if (!isHovered || imageCount <= 1) return

    const interval = setInterval(() => {
      setDirection("left")
      setCurrentImageIndex((prev) => (prev + 1) % imageCount)
    }, 2000)

    return () => clearInterval(interval)
  }, [isHovered, imageCount])

  const slideVariants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "left" ? 400 : -400,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: "left" | "right") => ({
      zIndex: 0,
      x: dir === "left" ? -400 : 400,
      opacity: 0,
    }),
  }

  return (
    <motion.div
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      className="group relative w-full h-[420px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer"
    >
      {/* AI Estimated Value Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {item.aiValue && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-indigo-400/30 uppercase tracking-widest"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            AI Value: {item.aiValue}
          </motion.div>
        )}
        {item.isSwapAvailable && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-emerald-400/30 uppercase tracking-widest"
          >
            <Repeat className="w-3 h-3" />
            Swap Ready
          </motion.div>
        )}
      </div>

      {/* Image Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${item.id}-${currentImageIndex}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={item.images[currentImageIndex].url}
              alt={item.images[currentImageIndex].alt || item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"
          animate={{
            opacity: isHovered ? 0.9 : 0.5,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Wishlist Button */}
        <motion.button
          className={`absolute top-4 right-4 p-2.5 cursor-pointer rounded-full shadow-lg transition-all z-20 ${isInWishlist ? 'bg-indigo-600 text-white' : 'bg-slate-800/80 text-slate-300 backdrop-blur-md border border-slate-700 hover:bg-slate-700'
            }`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isHovered ? 1 : 0.7, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleWishlistToggle()
          }}
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Content Panel */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 10, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Trust Score */}
            {item.trustScore && (
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Trust Score: {item.trustScore}%</span>
              </div>
            )}

            <h3 className="text-xl font-black text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {item.name}
            </h3>

            <p className="text-sm text-slate-400 mb-4 line-clamp-2 font-medium">
              {item.description}
            </p>

            {/* Footer with Price and Button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asking Value</span>
                <p className="text-2xl font-black text-white">{item.price}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 font-black rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all text-xs tracking-widest uppercase shadow-xl ${isInWallet
                  ? 'bg-emerald-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                  }`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAddToWallet()
                }}
                disabled={isInWallet}
              >
                <Coins className="w-4 h-4" />
                {isInWallet ? 'Saved' : 'Bid'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedProducts({ items = demoItems }: Props) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const visible = items.slice(0, 8)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-slate-900 hidden md:block" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-slate-900 hidden md:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 md:flex md:items-end md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-[2px] bg-indigo-500" />
              <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em]">Protocol Selection</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter">
              FEATURED SWAPS
            </h2>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors group font-black text-xs uppercase tracking-widest">
            Browse All Terminal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visible.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isHovered={hoveredItem === item.id}
              setHoveredItem={setHoveredItem}
            />
          ))}
        </div>

        <div className="mt-12 md:hidden">
          <Link href="/shop" className="flex items-center justify-center gap-2 py-5 border border-slate-800 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest">
            Browse All Terminal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
