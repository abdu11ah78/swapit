"use client"

import { motion, Variants } from "framer-motion"
import { ProductCard } from "../product-card"

export type Product = {
  id: string
  name: string
  price: number
  category?: string
  imageUrl: string
  href: string
}

type ProductGridProps = {
  products: Product[]
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
    boxShadow: "0 25px 50px rgba(255, 255, 255, 0.1)",
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

const floatingVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
}

// --- MODERN PRODUCT GRID ---
export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="relative w-full min-h-screen bg-gradient-to-b from-gray-100 to-neutral-400 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-empty" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
                <radialGradient id="empty-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.05)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-empty)" />
              <circle cx="50%" cy="50%" r="300" fill="url(#empty-glow)" />
            </svg>
          </div>

          {/* Floating Shadows/Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-80 h-80 bg-black/8 rounded-full blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-black/8 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 22, repeat: Infinity }}
          />
        </div>

        <motion.div
          className="relative max-w-7xl mx-auto px-4 md:px-8 h-screen flex items-center justify-center z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={emptyVariants}
        >
          <motion.div
            className="text-center"
            animate="animate"
            variants={floatingVariants}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
              animate={{ boxShadow: ["0 0 20px rgba(255,255,255,0)", "0 0 40px rgba(255,255,255,0.2)", "0 0 20px rgba(255,255,255,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">No Results</span>
            </motion.div>
            <p className="text-2xl sm:text-3xl font-bold text-white/80 mt-4">No products found</p>
            <p className="text-white/50 text-base mt-2">Try adjusting your filters or search criteria</p>
          </motion.div>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="relative w-full py-16 md:py-24 bg-gradient-to-b from-gray-400 to-neutral-300  overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-3">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Shadow Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-black/8 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-black/8 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-black/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 23, repeat: Infinity }}
        />
      </div>

      {/* Accent Lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      />

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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-600/20 backdrop-blur-md border border-gray-600/30 mb-4"
            animate={{ boxShadow: ["0 0 15px rgba(0,0,0,0)", "0 0 30px rgba(0,0,0,0.1)", "0 0 15px rgba(0,0,0,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              className="w-2 h-2 bg-gray-700/60 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">Featured Collection</span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((p, index) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              whileHover="hover"
              className="relative group"
              custom={index}
            >
              {/* Glow Background Layer */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Border Glow */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
              />

              {/* Main Card Container */}
              <motion.div
                className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-xl border border-white/10 transition-all duration-300"
                whileHover={{
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                {/* Dynamic Glow on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                />

                {/* Animated Background Grid (Card Level) */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`card-grid-${p.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#card-grid-${p.id})`} />
                  </svg>
                </div>

                {/* Accent Corner Lines */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-br-xl" />

                <div className="relative z-10">
                  <ProductCard {...p} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}