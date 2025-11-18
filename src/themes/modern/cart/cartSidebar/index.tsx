"use client"

import { motion, AnimatePresence, Variants } from "framer-motion"
import { X, ShoppingBag, Gift, Edit3, Tag, Truck } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { CartItem } from "./../cartItem"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CartSidebarProps {
  close: () => void
}

// FIX: Explicitly set the type to Variants to resolve the TypeScript error 2322.
// This tells TypeScript that the object structure is a valid Framer Motion variant.
const sidebarVariants: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const itemListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export function CartSidebar({ close }: CartSidebarProps) {
  const { cart } = useAppContext()
  const router = useRouter()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
  const itemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const freeShippingThreshold = 500
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const hasReachedFreeShipping = subtotal >= freeShippingThreshold

  const handleCheckout = () => {
    close()
    router.push("/checkout")
  }

  const handleViewCart = () => {
    close()
    router.push("/cart")
  }

  return (
    <AnimatePresence mode="wait">
      {/* Overlay */}
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-black/30 z-40"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={close}
      />

      {/* Sidebar */}
      <motion.div
        key="sidebar"
        className="fixed top-0 right-0 w-full sm:w-[480px] h-full bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between p-5 border-b border-gray-200"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({itemCount})
          </h2>
          <motion.button
            onClick={close}
            className="p-1.5 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5 text-gray-600" />
          </motion.button>
        </motion.div>

        {/* Free Shipping Banner */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div
              className="px-5 py-4 bg-pink-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={hasReachedFreeShipping ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Truck className="w-5 h-5 text-pink-600" />
                </motion.div>
                <span className="text-sm font-semibold text-gray-900">
                  {hasReachedFreeShipping
                    ? "Congratulations, you've got free shipping!"
                    : `FREE SHIPPING ON ORDERS $${freeShippingThreshold.toFixed(2)}`}
                </span>
              </div>
              <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {/* Striped pattern for progress bar */}
                <motion.div
                  className="absolute top-0 left-0 h-full w-full"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)",
                    width: `${shippingProgress}%`
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                {/* Delivery icon at the end */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 right-0"
                  animate={{ x: `${100 - shippingProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center -mr-3">
                    <Truck className="w-3.5 h-3.5 text-white" />
                  </div>
                </motion.div>
              </div>
              {!hasReachedFreeShipping && (
                <p className="text-xs text-gray-600 mt-2">
                  Add ${(freeShippingThreshold - subtotal).toFixed(2)} more to get free shipping
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Items */}
        <motion.div
          className="flex-1 overflow-y-auto px-5 py-4"
          variants={itemListVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.div
                className="h-full flex flex-col items-center justify-center text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
                </motion.div>
                <p className="text-gray-500 font-semibold text-base">Your cart is empty</p>
                <p className="text-gray-400 text-xs mt-2">Start shopping to add items</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <CartItem key={item.id} item={item} index={index} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer - Action Buttons & Checkout */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div
              className="border-t border-gray-200 bg-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              {/* Action Buttons */}
              <div className="px-5 py-4 grid grid-cols-4 gap-2 border-b border-gray-100">
                <motion.button
                  className="flex flex-col items-center cursor-pointer justify-center gap-1.5 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Gift className="w-5 h-5 text-gray-600" />
                  <span className="text-[10px] text-gray-600 font-medium">Add gift wrap?</span>
                </motion.button>
                <motion.button
                  className="flex flex-col cursor-pointer items-center justify-center gap-1.5 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit3 className="w-5 h-5 text-gray-600" />
                  <span className="text-[10px] text-gray-600 font-medium">Add note</span>
                </motion.button>
                <motion.button
                  className="flex flex-col cursor-pointer items-center justify-center gap-1.5 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tag className="w-5 h-5 text-gray-600" />
                  <span className="text-[10px] text-gray-600 font-medium">Coupon</span>
                </motion.button>
                <motion.button
                  className="flex flex-col cursor-pointer items-center justify-center gap-1.5 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Truck className="w-5 h-5 text-gray-600" />
                  <span className="text-[10px] text-gray-600 font-medium">Shipping</span>
                </motion.button>
              </div>

              {/* Subtotal */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-semibold text-gray-900">Subtotal:</span>
                  <motion.span
                    className="text-2xl font-bold text-red-600"
                    key={subtotal}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ${subtotal.toFixed(2)}
                  </motion.span>
                </div>
                <p className="text-xs text-gray-500">Taxes and shipping calculated at checkout</p>
              </div>

              {/* Terms & Checkout Buttons */}
              <div className="px-5 py-4">
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

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={handleCheckout}
                    disabled={!agreedToTerms}
                    className={`py-3 rounded-lg cursor-pointer font-semibold text-sm transition-all ${
                      agreedToTerms
                        ? "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white"
                        : "bg-gray-100 text-gray-400 border-2 border-gray-300 cursor-not-allowed"
                    }`}
                    whileHover={agreedToTerms ? { scale: 1.02 } : {}}
                    whileTap={agreedToTerms ? { scale: 0.98 } : {}}
                  >
                    Check Out
                  </motion.button>
                  <motion.button
                    onClick={handleViewCart}
                    className="py-3 bg-black text-white cursor-pointer rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}