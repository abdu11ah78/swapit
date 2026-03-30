"use client"

import { useAppContext } from "@/context/AppContext"
import { motion, Variants } from "framer-motion" // ADD Variants
import Image from "next/image" // ADD Image import
import { Trash2, Plus, Minus } from "lucide-react"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity?: number
    imageUrl?: string
  }
  index?: number
}

// Explicitly define the type for itemVariants
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
}

const quantityVariants = {
  tap: { scale: 0.95 },
}

export function CartItem({ item, index = 0 }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useAppContext()

  const totalPrice = (item.price * (item.quantity || 1)).toFixed(2)

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  const handleIncrement = () => {
    updateQuantity(item.id, (item.quantity || 1) + 1)
  }

  const handleDecrement = () => {
    updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))
  }

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border-2 border-white/30 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      transition={{ delay: index ? index * 0.1 : 0 }}
    >
      {/* Ambient Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* Content Container */}
      <div className="relative z-10 flex gap-4 md:gap-6">
        {/* Image */}
        <motion.div
          className="relative overflow-hidden rounded-2xl flex-shrink-0"
          whileHover={{ scale: 1.08 }}
        >
          <Image // CHANGED to Image
            src={item.imageUrl || "/shop/placeholder-product.jpg"}
            alt={item.name}
            // ADDED required width and height for next/image (using 96px as the max size from md:w-24/h-24)
            width={96} 
            height={96}
            className="w-20 h-20 md:w-24 md:h-24 object-cover"
          />
          {/* Image Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
          />
        </motion.div>

        {/* Item Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Name and Price */}
          <div>
            <motion.h3
              className="font-bold text-gray-900 truncate text-base md:text-lg"
              whileHover={{ x: 4 }}
            >
              {item.name}
            </motion.h3>
            <motion.p
              className="text-sm md:text-base text-gray-600/70 font-semibold mt-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ${item.price.toFixed(2)} each
            </motion.p>
          </div>

          {/* Quantity Controls */}
          <motion.div
            className="flex items-center gap-3 mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.button
              onClick={handleDecrement}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-lg cursor-pointer bg-white/50 hover:bg-white/80 border-2 border-white/30 hover:border-gray-600/40 flex items-center justify-center text-gray-700 font-bold transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={quantityVariants.tap}
            >
              <Minus size={16} className="md:w-5 md:h-5" />
            </motion.button>

            <motion.span
              className="w-8 text-center font-bold text-gray-900 text-base md:text-lg"
              key={item.quantity}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.quantity || 1}
            </motion.span>

            <motion.button
              onClick={handleIncrement}
              className="relative w-9 h-9 md:w-10 md:h-10 cursor-pointer rounded-lg bg-white/50 hover:bg-white/80 border-2 border-white/30 hover:border-gray-600/40 flex items-center justify-center text-gray-700 font-bold transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={quantityVariants.tap}
            >
              <Plus size={16} className="md:w-5 md:h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Price and Delete */}
        <div className="flex flex-col items-end justify-between gap-3">
          {/* Total Price */}
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-xs text-gray-600/70 font-medium mb-1">Total</p>
            <motion.p
              className="text-lg md:text-xl font-black text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text"
              key={totalPrice}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              ${totalPrice}
            </motion.p>
          </motion.div>

          {/* Delete Button */}
          <motion.button
            onClick={handleRemove}
            className="relative w-10 h-10 rounded-lg cursor-pointer bg-red-500/20 hover:bg-red-500/40 border-2 border-red-500/30 hover:border-red-500/60 flex items-center justify-center text-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Quantity Badge */}
      <motion.div
        className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs font-bold shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
      >
        x{item.quantity || 1}
      </motion.div>

      {/* Accent Lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </motion.div>
  )
}