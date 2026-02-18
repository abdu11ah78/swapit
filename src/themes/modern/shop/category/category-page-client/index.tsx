"use client"

import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import { Filters } from "@/themes/modern/shop/shop-filter"
import { Listing } from "@/themes/modern/shop/product-grid"
import { themeRegistry } from "@/themes"
import { Loader, AlertCircle } from "lucide-react"

type Props = { slug: string }

// --- FRAMER VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const loadingVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
  },
}

export function CategoryPageClient({ slug }: Props) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: slug,
    priceRange: [0, 5000],
    sortBy: "latest",
  })
  const [listings, setListings] = useState<Listing[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tenant, setTenant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    // In a real app, this would be fetched or passed via context
    setTenant({ tenantId: "tenant123", name: "SwapIt", templateId: "modern" })
  }, [])

  useEffect(() => {
    async function fetchListings() {
      try {
        setIsLoading(true)
        setError(null)
        const query = new URLSearchParams()
        if (filters.search) query.append("search", filters.search)
        if (filters.category) query.append("category", filters.category)
        query.append("minPrice", filters.priceRange[0].toString())
        query.append("maxPrice", filters.priceRange[1].toString())
        query.append("sortBy", filters.sortBy)

        const res = await fetch(`/api/shop?${query.toString()}`)
        if (!res.ok) throw new Error("Connection to trade server failed")

        const data: Listing[] = await res.json()
        setListings(data)
        setHasSearched(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Protocol synchronization failed")
        setListings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [filters, slug])

  if (!tenant) {
    return (
      <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-indigo-500" />
        </motion.div>
      </div>
    )
  }

  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry]

  return (
    <motion.div
      className="w-full bg-slate-950 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div variants={sectionVariants}>
        <theme.Shop.ShopHero
          title={slug.charAt(0).toUpperCase() + slug.slice(1)}
          subtitle={`Scanning cluster: ${slug}. Displaying verified barter packets.`}
          backgroundUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
        />
      </motion.div>

      {/* Filters Section */}
      <motion.div variants={sectionVariants}>
        <theme.Shop.ShopFilters onChange={setFilters} />
      </motion.div>

      {/* Listings Section */}
      <motion.section
        className="relative w-full py-16 md:py-24 bg-slate-950 overflow-hidden"
        variants={sectionVariants}
      >
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="listings-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#listings-grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                variants={loadingVariants}
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Loader className="w-16 h-16 text-indigo-500" />
              </motion.div>
              <motion.p
                className="mt-6 text-lg font-black text-white uppercase tracking-tighter"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Synchronizing with trade nodes...
              </motion.p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <AlertCircle className="w-16 h-16 text-red-500/70 mb-6" />
              <motion.p className="text-lg font-black text-white uppercase tracking-tighter">
                SIGNAL TIMEOUT: {error}
              </motion.p>
              <motion.p className="text-slate-500 mt-2">
                Re-establishing handshake... please wait.
              </motion.p>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && listings.length === 0 && hasSearched && (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-md border border-slate-700 mb-6">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Protocol Insight: 0 Results</span>
              </div>
              <motion.p className="text-2xl font-black text-white uppercase tracking-tighter mt-4">
                No signals detected
              </motion.p>
              <motion.p className="text-slate-500 text-base mt-2">
                Try recalibrating your search parameters.
              </motion.p>
            </motion.div>
          )}

          {/* Listings Grid */}
          {!isLoading && !error && listings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <theme.Shop.ListingGrid listings={listings} />
            </motion.div>
          )}
        </div>
      </motion.section>
    </motion.div>
  )
}