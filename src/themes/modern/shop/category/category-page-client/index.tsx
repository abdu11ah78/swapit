"use client"

import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import { Filters } from "@/themes/classic/shop/shop-filter"
import { Product } from "@/themes/classic/shop/product-grid"
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
    priceRange: [0, 500],
    sortBy: "latest",
  })
  const [products, setProducts] = useState<Product[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tenant, setTenant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    setTenant({ tenantId: "tenant123", name: "Ecommerce", templateId: "classic" })
  }, [])

  useEffect(() => {
    async function fetchProducts() {
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
        if (!res.ok) throw new Error("Failed to fetch products")
        
        const data: Product[] = await res.json()
        setProducts(data)
        setHasSearched(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [filters, slug])

  if (!tenant) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-neutral-300 via-gray-400 to-neutral-300 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-gray-800" />
        </motion.div>
      </div>
    )
  }

  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry]

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div variants={sectionVariants}>
        <theme.Shop.ShopHero
          title={slug.charAt(0).toUpperCase() + slug.slice(1)}
          subtitle={`Explore the best in ${slug}`}
          backgroundUrl="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80"
        />
      </motion.div>

      {/* Filters Section */}
      <motion.div variants={sectionVariants}>
        <theme.Shop.ShopFilters onChange={setFilters} />
      </motion.div>

      {/* Products Section */}
      <motion.section
        className="relative w-full py-16 md:py-24 bg-gradient-to-br from-neutral-300 via-gray-400 to-neutral-300 overflow-hidden"
        variants={sectionVariants}
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-4">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="products-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#products-grid)" />
          </svg>
        </div>

        {/* Floating Shadow Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                <Loader className="w-16 h-16 text-gray-800" />
              </motion.div>
              <motion.p
                className="mt-6 text-lg font-semibold text-gray-800"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading amazing products...
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
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-16 h-16 text-red-500/70" />
              </motion.div>
              <motion.p className="mt-6 text-lg font-semibold text-gray-800">
                Oops! {error}
              </motion.p>
              <motion.p className="text-sm text-gray-600/70 mt-2">
                Please try again later
              </motion.p>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && hasSearched && (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-600/20 backdrop-blur-md border border-gray-600/30 mb-6"
                animate={{ boxShadow: ["0 0 20px rgba(0,0,0,0)", "0 0 40px rgba(0,0,0,0.1)", "0 0 20px rgba(0,0,0,0)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  className="w-2 h-2 bg-gray-700/60 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">No Results</span>
              </motion.div>
              <motion.p className="text-2xl font-bold text-gray-800 mt-4">
                No products found
              </motion.p>
              <motion.p className="text-gray-600/70 text-base mt-2">
                Try adjusting your filters or search criteria
              </motion.p>
            </motion.div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <theme.Shop.ProductGrid products={products} />
            </motion.div>
          )}
        </div>
      </motion.section>
    </motion.div>
  )
}