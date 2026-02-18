"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"

// --- TYPES ---

// --- TYPES ---

export type ItemImage = {
  url: string
  alt?: string
}

export type CategoryItem = {
  id: string
  name: string
  href: string
  images: ItemImage[]
}

export type Category = {
  id: string
  title: string
  description?: string
  items: CategoryItem[]
}

type Props = {
  categories?: Category[]
}

// --- DATA ---
const defaultCategories: Category[] = [
  {
    id: "retro-tech",
    title: "Retro Tech Swaps",
    description: "Vintage gadgets and collectible electronics up for barter.",
    items: [
      {
        id: "gameboy",
        name: "GameBoy Color",
        href: "/shop?category=retro-tech",
        images: [
          {
            url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=60",
            alt: "Vintage Gameboy",
          }
        ],
      },
      {
        id: "camera",
        name: "35mm Film Camera",
        href: "/shop?category=retro-tech",
        images: [
          {
            url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=60",
            alt: "Film Camera",
          }
        ],
      }
    ],
  },
  {
    id: "luxury-goods",
    title: "Luxury Barters",
    description: "High-value trade items for premium swap protocols.",
    items: [
      {
        id: "watch-1",
        name: "Mechanical Watch",
        href: "/shop?category=luxury",
        images: [
          {
            url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=60",
            alt: "Luxury Watch",
          }
        ],
      }
    ],
  },
]

// --- ITEM CARD COMPONENT ---

interface ItemCardProps {
  item: CategoryItem
  isHovered: boolean
  setHoveredItem: (id: string | null) => void
}

const SLIDE_INTERVAL_MS = 1500

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isHovered,
  setHoveredItem,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const imageCount = item.images.length
  const intervalRef = useRef<number | null>(null)

  const advanceImage = useCallback(() => {
    setDirection("left")
    setCurrentImageIndex((prev) => (prev + 1) % imageCount)
  }, [imageCount])

  useEffect(() => {
    if (isHovered && imageCount > 1) {
      intervalRef.current = window.setInterval(advanceImage, SLIDE_INTERVAL_MS) as unknown as number
    } else {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setCurrentImageIndex(0)
      setDirection("left")
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, imageCount, advanceImage])

  const slideVariants: Variants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "left" ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: "left" | "right") => ({
      zIndex: 0,
      x: dir === "left" ? -50 : 50,
      opacity: 0,
    }),
  }

  return (
    <motion.div
      initial={{ scale: 1, y: 0, boxShadow: "0 8px 15px -3px rgba(0, 0, 0, 0.2)" }}
      className="relative overflow-hidden rounded-2xl cursor-pointer bg-slate-900 border border-slate-800"
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <Link
        href={item.href}
        className="group block focus:outline-none rounded-2xl"
        aria-label={item.name}
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${item.id}-${currentImageIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={item.images[currentImageIndex].url}
                alt={item.images[currentImageIndex].alt || item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"
            animate={{ opacity: isHovered ? 0.8 : 0.4 }}
          />

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.h4
              className="text-xl font-black text-white uppercase tracking-tighter"
              animate={{ y: isHovered ? -4 : 0 }}
            >
              {item.name}
            </motion.h4>
            <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Explore Protocol</span>
              <ArrowRight className="w-3 h-3 text-indigo-400" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// --- FEATURED CATEGORIES COMPONENT ---

export function FeaturedCategories({ categories = defaultCategories }: Props) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 block">Archive Clusters</span>
          <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
            SWAP CATEGORIES
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Discover specialized networks of traders and curated swap pools across the protocol.
          </p>
        </motion.div>

        {/* Categories Container */}
        <div className="space-y-32">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center justify-between mb-10 border-b border-slate-900 pb-6">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                    {category.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{category.description}</p>
                </div>
                <Link href={category.id} className="text-xs font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest border border-indigo-500/20 px-6 py-2 rounded-full transition-colors flex items-center gap-2 group">
                  Full Category
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isHovered={hoveredItem === item.id}
                    setHoveredItem={setHoveredItem}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-32 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95 group"
          >
            Access All Protocols
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategories