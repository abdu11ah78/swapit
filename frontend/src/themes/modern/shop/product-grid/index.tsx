"use client"

import { motion, Variants } from "framer-motion"
import { ItemCard, type ItemCardProps } from "../product-card"

export type Listing = {
  id: string
  name: string
  price: number
  category?: string
  imageUrl: string
  href: string
  aiValue?: number
  trustScore?: number
  isSwapReady?: boolean
}

type ListingGridProps = {
  listings: Listing[]
}

// --- FRAMER VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, rotateY: -10 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  hover: {
    y: -8,
    scale: 1.04,
    boxShadow: "0 25px 50px rgba(99, 102, 241, 0.1)",
    transition: { type: "spring", stiffness: 250, damping: 18 },
  },
}

const emptyVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

// --- MODERN LISTING GRID ---
export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <section className="relative w-full min-h-screen bg-slate-950 overflow-hidden">
        {/* Animated Background Elements */}
        {/* ... (svg grid and orbs logic simplified for brevity but following the dark theme) */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-empty" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-empty)" />
            </svg>
          </div>
        </div>

        <motion.div
          className="relative max-w-7xl mx-auto px-4 md:px-8 h-screen flex items-center justify-center z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={emptyVariants}
        >
          <div className="text-center">
            <motion.div
              className="inline-block mb-4 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-md border border-slate-700/50"
              animate={{ boxShadow: ["0 0 20px rgba(99, 102, 241, 0)", "0 0 40px rgba(99, 102, 241, 0.2)", "0 0 20px rgba(99, 102, 241, 0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Protocol Insight: 0 Results</span>
            </motion.div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-4 uppercase tracking-tighter">No listings detected</p>
            <p className="text-slate-500 text-base mt-2">The protocol could not find any active signals matching your query.</p>
          </div>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="relative w-full py-16 md:py-24 bg-slate-950 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-4 md:px-8 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Section Header */}
        <motion.div className="mb-12 md:mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 mb-4"
          >
            <motion.div
              className="w-2 h-2 bg-indigo-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Active Trade Signals</span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {listings.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover="hover"
              className="relative group"
              custom={index}
            >
              <motion.div
                className="relative h-full overflow-hidden rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 transition-all duration-300 group-hover:border-indigo-500/30"
              >
                <div className="relative z-10">
                  <ItemCard {...item} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
