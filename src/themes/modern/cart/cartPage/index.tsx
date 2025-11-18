/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"

interface SimilarProduct {
  id: string
  name: string
  price: number
  imageUrl: string
  href: string
}

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, wishlist, addToWishlist, removeFromWishlist } = useAppContext()
  const router = useRouter()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
  const itemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const freeShippingThreshold = 500
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 50
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shippingCost + tax

  // Mock similar products (in real app, fetch from API based on cart items)
  const similarProducts: SimilarProduct[] = useMemo(() => {
    return [
      { id: "sim1", name: "Premium Leather Bag", price: 129.99, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", href: "/product/sim1" },
      { id: "sim2", name: "Classic Watch", price: 249.99, imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=300&q=80", href: "/product/sim2" },
      { id: "sim3", name: "Sunglasses Pro", price: 179.99, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", href: "/product/sim3" },
      { id: "sim4", name: "Designer Scarf", price: 89.99, imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", href: "/product/sim4" },
    ]
  }, [])

  const handleCheckout = () => {
    router.push("/checkout")
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const toggleWishlist = (item: any) => {
    const isInWishlist = wishlist.some((w) => w.id === item.id)
    if (isInWishlist) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-30 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{itemCount} items in your cart</p>
        </motion.div>

        {cart.length === 0 ? (
          // Empty Cart State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <motion.button
              onClick={() => router.push("/shop")}
              className="px-8 py-3 bg-black text-white rounded-lg font-semibold cursor-pointer hover:bg-gray-800 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-white rounded-lg border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <motion.button
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                            className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded transition-colors"
                            whileTap={{ scale: 0.9 }}
                          >
                            −
                          </motion.button>
                          <span className="w-6 text-center font-semibold text-sm">{item.quantity || 1}</span>
                          <motion.button
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                            className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded transition-colors"
                            whileTap={{ scale: 0.9 }}
                          >
                            +
                          </motion.button>
                        </div>

                        {/* Total Price */}
                        <p className="text-sm sm:text-base font-bold text-black">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Summary Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-gray-900">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <motion.span
                    className="text-2xl font-bold text-red-600"
                    key={total}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ${total.toFixed(2)}
                  </motion.span>
                </div>

                {/* Terms Checkbox */}
                <motion.label
                  className="flex items-start gap-2 mb-4 cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span className="text-xs text-gray-600">
                    I agree with the{" "}
                    <a href="#" className="text-black underline font-medium">
                      terms and conditions
                    </a>
                  </span>
                </motion.label>

                {/* Checkout Button */}
                <motion.button
                  onClick={handleCheckout}
                  disabled={!agreedToTerms}
                  className={`w-full py-3 rounded-lg cursor-pointer font-semibold text-sm transition-all ${
                    agreedToTerms
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  whileHover={agreedToTerms ? { scale: 1.02 } : {}}
                  whileTap={agreedToTerms ? { scale: 0.98 } : {}}
                >
                  Proceed to Checkout
                </motion.button>

                {/* Continue Shopping */}
                <motion.button
                  onClick={() => router.push("/shop")}
                  className="w-full mt-3 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold text-sm cursor-pointer hover:bg-gray-900 hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Similar Products Section */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 pt-16 border-t border-gray-200"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Similar Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={product.href}>
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 h-64 mb-4 cursor-pointer">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWishlist({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className={`w-5 h-5 ${wishlist.some((w) => w.id === product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </motion.button>
                    </div>
                  </Link>

                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-black text-white rounded-lg font-semibold text-sm cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CartPage