"use client"

import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { Input } from "@/components/ui/minput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/mselect"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Search, Filter, SortAsc, Sparkles } from "lucide-react"

export type Filters = {
  search: string
  category?: string
  priceRange: [number, number]
  sortBy: string
}

type ShopFiltersProps = {
  categories?: string[]
  onChange: (filters: Filters) => void
}

// --- FRAMER VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
}

const buttonVariants: Variants = {
  hover: {
    scale: 1.08,
    y: -4,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    transition: { type: "spring", stiffness: 300, damping: 18 },
  },
  tap: { scale: 0.95 },
}

// --- MODERN SHOP FILTERS ---
export function ShopFilters({
  categories = ["Clothing", "Electronics", "Bakery", "Beauty"],
  onChange,
}: ShopFiltersProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string | undefined>()
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState("latest")
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  const handleApply = () => {
    onChange({ search, category, priceRange, sortBy })
  }

  return (
    <section className="relative w-full py-16 md:py-20 bg-gradient-to-t from-gray-400 to-neutral-300  overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-4">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="filters-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#filters-grid)" />
        </svg>
      </div>

      {/* Floating Shadow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 22, repeat: Infinity }}
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
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        {/* Section Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
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
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">Advanced Filters</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 md:items-end md:justify-between border-2 border-white/40 hover:border-white/60 transition-all duration-300 relative overflow-visible"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
        >
          {/* Glow Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          />

          {/* Search */}
          <motion.div
            className="w-full md:flex-1 relative z-10"
            whileHover={{ scale: 1.02 }}
            onMouseEnter={() => setHoveredElement("search")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <div className="relative group overflow-hidden rounded-2xl">
              <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700/60 group-hover:text-gray-800 transition-colors z-10 pointer-events-none" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 bg-white/50 border-2 border-white/30 text-gray-900 placeholder-gray-600/50 focus:border-gray-600/50 focus:ring-gray-400 rounded-2xl font-medium focus:bg-white/70 transition-all duration-300 backdrop-blur-sm"
              />
              {/* Dynamic Glow on Hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-300/20 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredElement === "search" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Category */}
          <motion.div
            className="w-full md:w-[220px] relative z-10"
            whileHover={{ scale: 1.02 }}
            onMouseEnter={() => setHoveredElement("category")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <div className="relative group overflow-hidden rounded-2xl">
              <Filter size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700/60 group-hover:text-gray-800 transition-colors z-20 pointer-events-none" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full pl-12 bg-white/50 border-2 border-white/30 text-gray-900 focus:border-gray-600/50 focus:ring-gray-400 rounded-2xl font-medium hover:bg-white/70 transition-all duration-300 backdrop-blur-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-2 border-white/40 text-gray-900 rounded-2xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="hover:bg-gray-400/20 focus:bg-gray-400/20">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Dynamic Glow on Hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-300/20 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredElement === "category" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Price Range */}
          <motion.div
            className="w-full md:w-[280px] relative z-10"
            whileHover={{ scale: 1.02 }}
            onMouseEnter={() => setHoveredElement("price")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-800">
              <Sparkles size={16} />
              Price Range
            </label>
            <div className="relative group">
              <Slider
                value={priceRange}
                onValueChange={(val) => setPriceRange(val as [number, number])}
                min={0}
                max={1000}
                step={10}
                className="bg-white/50 rounded-2xl backdrop-blur-sm"
              />
              <motion.span
                className="text-xs mt-3 block text-gray-800/70 font-semibold"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ${priceRange[0]} – ${priceRange[1]}
              </motion.span>
              {/* Dynamic Glow on Hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-300/20 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredElement === "price" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Sort By */}
          <motion.div
            className="w-full md:w-[210px] relative z-10"
            whileHover={{ scale: 1.02 }}
            onMouseEnter={() => setHoveredElement("sort")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <div className="relative group overflow-hidden rounded-2xl">
              <SortAsc size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700/60 group-hover:text-gray-800 transition-colors z-20 pointer-events-none" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full pl-12 bg-white/50 border-2 border-white/30 text-gray-900 focus:border-gray-600/50 focus:ring-gray-400 rounded-2xl font-medium hover:bg-white/70 transition-all duration-300 backdrop-blur-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-2 border-white/40 text-gray-900 rounded-2xl">
                  <SelectItem value="latest" className="hover:bg-gray-400/20 focus:bg-gray-400/20">Latest</SelectItem>
                  <SelectItem value="price_low" className="hover:bg-gray-400/20 focus:bg-gray-400/20">Price: Low to High</SelectItem>
                  <SelectItem value="price_high" className="hover:bg-gray-400/20 focus:bg-gray-400/20">Price: High to Low</SelectItem>
                  <SelectItem value="bestseller" className="hover:bg-gray-400/20 focus:bg-gray-400/20">Best Sellers</SelectItem>
                </SelectContent>
              </Select>
              {/* Dynamic Glow on Hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-300/20 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredElement === "sort" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Apply Button */}
          <motion.div
            className="w-full md:w-auto relative z-10"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onMouseEnter={() => setHoveredElement("apply")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <Button
              onClick={handleApply}
              className="relative w-full md:w-auto bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 px-8 py-3 rounded-2xl font-semibold overflow-hidden border-2 border-gray-800/40 hover:border-gray-900/60 transition-all duration-300 shadow-lg hover:shadow-2xl group"
            >
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />
              {/* Sparkle Animation */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-gray-700/0 via-gray-600/50 to-gray-700/0 opacity-0 group-hover:opacity-100 blur-lg pointer-events-none"
                animate={hoveredElement === "apply" ? { x: [0, 100, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={16} />
                Apply Filters
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}