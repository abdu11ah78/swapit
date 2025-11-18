"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"

// --- TYPES ---

export type ProductImage = {
  url: string
  alt?: string
}

export type CategoryProduct = {
  id: string
  name: string
  href: string
  images: ProductImage[]
}

export type Category = {
  id: string
  title: string
  description?: string
  products: CategoryProduct[]
}

type Props = {
  categories?: Category[]
}

// --- DATA ---
const defaultCategories: Category[] = [
  {
    id: "clothing",
    title: "Clothing",
    description: "Premium collection",
    products: [
      {
        id: "shirt-1",
        name: "Classic Shirt",
        href: "/categories/clothing",
        images: [
          {
            url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60",
            alt: "Front view",
          },
          {
            url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=60",
            alt: "Side view",
          },
          {
            url: "https://images.unsplash.com/photo-1755519024827-fd05075a7200?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2xhc3NpYyUyMHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            alt: "Back view",
          },
        ],
      },
      {
        id: "shirt-2",
        name: "Summer Tee",
        href: "/categories/clothing",
        images: [
          {
            url: "https://images.unsplash.com/photo-1527719197793-6b777854108d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwdGVlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            alt: "Front view",
          },
          {
            url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60",
            alt: "Side view",
          },
        ],
      },
      {
        id: "shirt-3",
        name: "Casual Wear",
        href: "/categories/clothing",
        images: [
          {
            url: "https://plus.unsplash.com/premium_photo-1688497831384-e40b2e5615cd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzdWFsJTIwd2VhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
            alt: "Front view",
          },
          {
            url: "https://images.unsplash.com/photo-1716004360220-213371f51df1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FzdWFsJTIwd2VhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
            alt: "Side view",
          },
        ],
      },
    ],
  },
  {
    id: "electronics",
    title: "Electronics",
    description: "Latest gadgets",
    products: [
      {
        id: "phone-1",
        name: "Smartphone Pro",
        href: "/categories/electronics",
        images: [
          {
            url: "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
            alt: "Device front",
          },
          {
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=60",
            alt: "Device angle",
          },
        ],
      },
      {
        id: "phone-2",
        name: "Tech Device",
        href: "/categories/electronics",
        images: [
          {
            url: "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
            alt: "Device front",
          },
          {
            url: "https://plus.unsplash.com/premium_photo-1681319553238-9860299dfb0f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVjJTIwZGV2aWNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            alt: "Device angle",
          },
        ],
      },
      {
        id: "phone-3",
        name: "Digital Gear",
        href: "/categories/electronics",
        images: [
          {
            url: "https://images.unsplash.com/photo-1536632155857-9c7dba77c29d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlnaXRhbCUyMGdlYXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
            alt: "Device front",
          },
          {
            url: "https://images.unsplash.com/photo-1536632155857-9c7dba77c29d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlnaXRhbCUyMGdlYXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
            alt: "Device angle",
          },
        ],
      },
    ],
  },
  {
    id: "beauty",
    title: "Beauty",
    description: "Premium skincare",
    products: [
      {
        id: "beauty-1",
        name: "Face Care",
        href: "/categories/bakery",
        images: [
          {
            url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=500&q=60",
            alt: "Product view",
          },
          {
            url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=500&q=60",
            alt: "Product detail",
          },
        ],
      },
      {
        id: "beauty-2",
        name: "Cosmetics",
        href: "/categories/bakery",
        images: [
          {
            url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=60",
            alt: "Product view",
          },
          {
            url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=60",
            alt: "Product detail",
          },
        ],
      },
      {
        id: "beauty-3",
        name: "Wellness Set",
        href: "/categories/bakery",
        images: [
          {
            url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=60",
            alt: "Product view",
          },
          {
            url: "https://images.unsplash.com/photo-1615397349754-cfa2066a1eea?auto=format&fit=crop&w=500&q=60",
            alt: "Product detail",
          },
        ],
      },
    ],
  },
]

// --- PRODUCT CARD COMPONENT (Permanent, Clear Elevated Effect) ---

interface ProductCardProps {
  product: CategoryProduct
  isHovered: boolean
  setHoveredProduct: (id: string | null) => void
}

const SLIDE_INTERVAL_MS = 1500

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isHovered,
  setHoveredProduct,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("left") 
  const imageCount = product.images.length
  const intervalRef = useRef<number | null>(null)

  const advanceImage = useCallback(() => {
    setDirection("left")
    setCurrentImageIndex((prev) => (prev + 1) % imageCount)
  }, [imageCount])

  // EFFECT for Auto-Sliding
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

  const nameTextColor = "text-white"

  // --- FINAL Permanent Box Shadow/Elevation ---
  const cardVariants: Variants = {
    // This state is PERMANENT and defines the shadow.
    initial: {
      scale: 1,
      y: 0,       
      // Permanent soft black/gray box shadow (clear, defined elevation)
      boxShadow: "0 8px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.05)", 
      transition: { duration: 0.0 }
    },
  }


  return (
    // Applied permanent elevation/shadow. Removed all hover/transition classes.
    <motion.div
      variants={cardVariants}
      initial="initial" 
      // Removed whileHover completely
      className="relative overflow-hidden rounded-xl cursor-pointer bg-white" 
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <Link
        href={product.href}
        // ring-offset-0 ensures no white gap around the focus ring
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-black rounded-xl"
        aria-label={product.name}
      >
        {/* Removed bg-gray-100 from image container for cleaner look */}
        <div className="relative w-full aspect-square overflow-hidden rounded-xl"> 
          
          {/* Image Container (Auto-Sliding) */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${product.id}-${currentImageIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.5 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[currentImageIndex].url}
                alt={product.images[currentImageIndex].alt || product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300" // Removed group-hover:scale-105
                priority={product.id === "shirt-1" || product.id === "phone-1"}
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark Gradient Overlay (Bottom) */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
            animate={{
              opacity: isHovered ? 0.6 : 0.3,
            }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: "none" }}
          />

          {/* Product Info - Bottom Left */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <motion.h4
              className={`text-lg font-bold transition-colors ${nameTextColor}`}
              initial={{ opacity: 0.8, y: 0 }}
              animate={{ opacity: 1, y: isHovered ? -4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {product.name}
            </motion.h4>
          </div>

          {/* Image Counter - Top Right (Optional, only visible on hover) */}
          {imageCount > 1 && (
            <motion.div
              className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentImageIndex + 1} / {imageCount}
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

// --- FEATURED CATEGORIES COMPONENT ---

export function FeaturedCategories({ categories = defaultCategories }: Props) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section
      aria-labelledby="featured-categories"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-300 relative overflow-hidden"
    >
      {/* Subtle dark gradient background for the section */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 to-white pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-sm font-bold tracking-widest text-gray-600 uppercase">
              Collections
            </span>
            <h2
              id="featured-categories"
              className="text-4xl sm:text-5xl font-black text-black tracking-tight"
            >
              Featured Categories
            </h2>
          </div>
          <p className="text-gray-600 text-base max-w-2xl">
            Explore our curated selection of premium products across multiple categories
          </p>
        </motion.div>

        {/* Categories Container */}
        <div className="space-y-20">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: catIdx * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Category Title */}
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  {category.title}
                </h3>
                {category.description && (
                  <p className="text-gray-600 text-sm">{category.description}</p>
                )}
              </div>

              {/* Products Grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
              >
                {category.products.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard
                      product={product}
                      isHovered={hoveredProduct === product.id}
                      setHoveredProduct={setHoveredProduct}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors group"
          >
            View All Categories
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedCategories