"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useAppContext } from "@/context/AppContext"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { Minus, Plus, Star, Heart, ShoppingBag, ArrowLeft, Sparkles, Check } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import toast from 'react-hot-toast'

const PRODUCTS = [
  {
    id: "1",
    name: "Red T-Shirt",
    price: 29.99,
    images: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1920&q=80",
    ],
    description: "Soft cotton red T-shirt for everyday wear. Premium quality fabric with comfortable fit.",
    sku: "TSH-001",
    weight: "200g",
    stock: 15,
    reviews: [
      { user: "John D.", rating: 5, comment: "Great quality, fits perfectly!" },
      { user: "Sarah K.", rating: 4, comment: "Nice shirt but color slightly different." },
    ],
  },
]

// FIXED: Explicitly cast as Variants to resolve type error for the transition ease property.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.8,
    },
  },
} as Variants

// FIXED: Explicitly cast as Variants and use 'as const' on the ease array for stricter type definition.
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
} as Variants

export function ProductDetailPage() {
  const { id } = useParams() as { id: string }
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, updateQuantity, cart } =
    useAppContext()
  const product = PRODUCTS.find((p) => p.id === id)

  const [quantity, setQuantity] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    setSelectedIndex(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-2xl font-bold text-gray-900">❌ Product not found</p>
          <Link href="/shop" className="text-gray-600 hover:text-gray-900 mt-4 inline-block">
            Go back to shop
          </Link>
        </motion.div>
      </div>
    )
  }

  const isInWishlist = wishlist.some((item) => item.id === product.id)
  const avgRating = product.reviews.length > 0
    ? Math.round((product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length) * 10) / 10
    : 0

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
      toast.success("Removed from wishlist")
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0] ?? "/shop/placeholder-product.jpg",
        quantity: 1,
      })
      toast.success("Added to wishlist")
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] ?? "/shop/placeholder-product.jpg",
      quantity,
    })
    toast.success(`${quantity} item(s) added to cart`)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return
    setQuantity(newQty)

    const exists = cart.find((c) => c.id === product.id)
    if (exists) {
      updateQuantity(product.id, newQty)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-2">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="product-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#product-grid)" />
        </svg>
      </div>

      {/* Floating Shadow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-black/8 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-black/8 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 22, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 lg:p-12 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/shop">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 border-2 border-white/40 text-gray-900 font-semibold rounded-2xl transition-all"
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} />
              Back to Shop
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Image Carousel */}
          <motion.div
            variants={itemVariants}
            className="relative w-full"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-white/40 p-4 shadow-xl">
              <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
                <CarouselContent>
                  {product.images.map((img, i) => (
                    <CarouselItem
                      key={i}
                      className="relative w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden"
                    >
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image src={img} alt={product.name} fill className="object-cover" />
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Arrows */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
                >
                  <CarouselPrevious className="bg-white/80 hover:bg-white shadow-lg rounded-full border-0" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
                >
                  <CarouselNext className="bg-white/80 hover:bg-white shadow-lg rounded-full border-0" />
                </motion.div>
              </Carousel>
            </div>

            {/* Thumbnails */}
            <motion.div
              className="flex gap-3 mt-6 justify-center flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {product.images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    api?.scrollTo(i)
                    setSelectedIndex(i)
                  }}
                  className={`relative w-24 h-24 border-2 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    selectedIndex === i ? "border-gray-900 shadow-lg" : "border-gray-300 hover:border-gray-500"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                  {selectedIndex === i && (
                    <motion.div
                      className="absolute inset-0 bg-black/10 rounded-2xl"
                      layoutId="activeThumb"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Product Details */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-8"
          >
            {/* Header */}
            <div>
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
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">Premium Product</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-black text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {product.name}
              </motion.h1>

              <motion.p
                className="text-gray-600/80 text-lg font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {product.description}
              </motion.p>
            </div>

            {/* Rating & Price */}
            <motion.div
              className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + idx * 0.05 }}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          idx < Math.floor(avgRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">{avgRating} ({product.reviews.length} reviews)</span>
              </div>

              <motion.p
                className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
              >
                ${product.price.toFixed(2)}
              </motion.p>
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="space-y-3 p-4 bg-white/50 rounded-2xl border border-gray-200/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {[
                { label: "SKU", value: product.sku },
                { label: "Weight", value: product.weight },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex justify-between text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <span className="text-gray-600">{item.label}:</span>
                  <span className="font-bold text-gray-900">{item.value}</span>
                </motion.div>
              ))}

              {/* Stock Status */}
              <motion.div
                className={`flex items-center gap-2 p-3 rounded-xl mt-3 ${
                  product.stock > 0
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
              >
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`font-semibold text-sm ${product.stock > 0 ? "text-green-700" : "text-red-700"}`}>
                  {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
                </span>
              </motion.div>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Quantity:</span>
              <div className="flex items-center gap-3 bg-white/50 rounded-2xl border-2 border-white/40 p-2">
                <motion.button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg bg-white/50 hover:bg-white/80 disabled:opacity-50 flex items-center justify-center font-bold transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minus size={18} />
                </motion.button>

                <motion.span
                  className="px-6 text-lg font-bold text-gray-900 min-w-fit"
                  key={quantity}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {quantity}
                </motion.span>

                <motion.button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-white/50 hover:bg-white/80 flex items-center justify-center font-bold transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 relative overflow-hidden py-4 px-6 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-700/0 via-gray-700/50 to-gray-700/0 opacity-0"
                  animate={addedToCart ? { opacity: [0, 1, 0] } : {}}
                  transition={{ duration: 1 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {addedToCart ? (
                    <>
                      <Check size={20} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </span>
              </motion.button>

              <motion.button
                onClick={handleWishlistToggle}
                className={`flex-1 py-4 px-6 font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl border-2 ${
                  isInWishlist
                    ? "bg-pink-600/80 border-pink-500/80 text-white hover:bg-pink-700"
                    : "bg-white/50 border-white/40 text-gray-900 hover:bg-white/70"
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="flex items-center justify-center gap-2"
                  animate={isInWishlist ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={20} className={isInWishlist ? "fill-white" : ""} />
                  {isInWishlist ? "Wishlisted" : "Wishlist"}
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              className="mt-8 p-6 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-white/40 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
              >
                <Sparkles className="w-6 h-6" />
                Customer Reviews
              </motion.h2>

              {product.reviews.length === 0 ? (
                <motion.p
                  className="text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No reviews yet. Be the first to review!
                </motion.p>
              ) : (
                <motion.div
                  className="space-y-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {product.reviews.map((r, i) => (
                    <motion.div
                      key={i}
                      className="p-4 bg-white/50 rounded-2xl border border-gray-200/50 hover:border-gray-300 transition-all"
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, x: 4 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-4 w-4 ${
                                idx < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-gray-600">{r.rating}.0/5.0</span>
                      </div>
                      <p className="text-gray-800 font-medium mb-2">{r.comment}</p>
                      <p className="text-sm text-gray-500">– {r.user}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}