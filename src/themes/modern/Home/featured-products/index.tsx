"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Heart } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export type ProductImage = {
  url: string
  alt?: string
}

export type Product = {
  id: string
  name: string
  price: string
  href: string
  images: ProductImage[]
  rating?: number
  description?: string
}

type Props = {
  products?: Product[]
}

const demoProducts: Product[] = [
  {
    id: "1",
    name: "Classic T-Shirt",
    price: "$25.00",
    href: "/products/1",
    rating: 4.5,
    description: "A timeless essential, crafted from soft, breathable cotton.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60",
        alt: "Front view",
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=60",
        alt: "Side view",
      },
    ],
  },
  {
    id: "2",
    name: "Wireless Headphones",
    price: "$120.00",
    href: "/products/2",
    rating: 4.8,
    description: "Crystal-clear audio with noise-cancelling technology.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=60",
        alt: "Device front",
      },
      {
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=500&q=60",
        alt: "Device angle",
      },
    ],
  },
  {
    id: "3",
    name: "Freshly Baked Bread",
    price: "$4.50",
    href: "/products/3",
    rating: 4.3,
    description: "Artisan bread with natural ingredients for perfect crust.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=60",
        alt: "Product view",
      },
      {
        url: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=60",
        alt: "Product detail",
      },
    ],
  },
  {
    id: "4",
    name: "Luxury Face Cream",
    price: "$45.00",
    href: "/products/4",
    rating: 4.9,
    description: "Rich hydrating cream with anti-aging botanicals.",
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
    id: "5",
    name: "Casual Sneakers",
    price: "$85.00",
    href: "/products/5",
    rating: 4.6,
    description: "Comfortable and stylish for your daily adventures.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=60",
        alt: "Front view",
      },
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60",
        alt: "Side view",
      },
    ],
  },
  {
    id: "6",
    name: "Premium Watch",
    price: "$199.00",
    href: "/products/6",
    rating: 4.7,
    description: "Sophisticated timepiece with precision engineering.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=500&q=60",
        alt: "Watch front",
      },
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=60",
        alt: "Watch angle",
      },
    ],
  },
  {
    id: "7",
    name: "Sunglasses",
    price: "$65.00",
    href: "/products/7",
    rating: 4.4,
    description: "Stylish and protective for any sunny day.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=60",
        alt: "Product view",
      },
      {
        url: "https://images.unsplash.com/photo-1509695307050-d4066910ec1e?auto=format&fit=crop&w=500&q=60",
        alt: "Product detail",
      },
    ],
  },
  {
    id: "8",
    name: "Leather Wallet",
    price: "$35.00",
    href: "/products/8",
    rating: 4.5,
    description: "Sleek and durable with ample space for cards and cash.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=60",
        alt: "Product view",
      },
      {
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=60",
        alt: "Product detail",
      },
    ],
  },
]

interface ProductCardProps {
  product: Product
  isHovered: boolean
  setHoveredProduct: (id: string | null) => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isHovered,
  setHoveredProduct,
}) => {
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useAppContext()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const imageCount = product.images.length

  const isInWishlist = wishlist.some((item) => item.id === product.id)
  const isInCart = cart.some((item) => item.id === product.id)

  // Convert price string to number
  const priceNumber = parseFloat(product.price.replace('$', ''))
  
  const cartItem = {
    id: product.id,
    name: product.name,
    price: priceNumber,
    imageUrl: product.images[0]?.url || '',
    quantity: 1
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(cartItem)
    }
  }

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(cartItem)
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
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
      className="group relative w-full h-96 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${product.id}-${currentImageIndex}`}
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
              src={product.images[currentImageIndex].url}
              alt={product.images[currentImageIndex].alt || product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay that expands on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          animate={{
            opacity: isHovered ? 0.8 : 0.3,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Wishlist Button */}
        <motion.button
          className={`absolute top-3 right-3 p-2.5 cursor-pointer bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-20 ${
            isInWishlist ? 'bg-red-50' : ''
          }`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isHovered ? 1 : 0.7, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleWishlistToggle()
          }}
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-black fill-black'}`} />
        </motion.button>

        {/* Image Counter */}
        {imageCount > 1 && (
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            {product.images.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (idx > currentImageIndex) setDirection("left")
                  else if (idx < currentImageIndex) setDirection("right")
                  setCurrentImageIndex(idx)
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer  ${
                  idx === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </motion.div>
        )}

        {/* Content Panel - Slides up on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-10"
          animate={{ y: isHovered ? 0 : "100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-16 px-4 pb-4">
            {/* Title */}
            <Link href={product.href}>
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 hover:underline">
                {product.name}
              </h3>
            </Link>

            {/* Description */}
            {product.description && (
              <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < Math.floor(product.rating!)
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {product.rating}
                </span>
              </div>
            )}

            {/* Footer with Price and Button */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-xl font-bold text-white">
                {product.price}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-2 font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors text-sm ${
                  isInCart
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-black'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAddToCart()
                }}
                disabled={isInCart}
              >
                <ShoppingCart className="w-4 h-4" />
                {isInCart ? 'Added' : 'Add'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function FeaturedProducts({ products = demoProducts }: Props) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const visible = products.slice(0, 8)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            Our best sellers and most loved picks
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {visible.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                product={product}
                isHovered={hoveredProduct === product.id}
                setHoveredProduct={setHoveredProduct}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}