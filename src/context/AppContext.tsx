"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export type AppContextType = {
  cart: CartItem[]
  wishlist: CartItem[]
  addToCart: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  addToWishlist: (item: CartItem) => void
  removeFromWishlist: (id: string) => void
  clearCart: () => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<CartItem[]>([])

  // addToCart respects incoming item.quantity and merges with existing
  const addToCart = (item: CartItem) => {
    const qty = Math.max(1, Number(item.quantity ?? 1))
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id)
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + qty } : p
        )
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }

  // directly set the quantity (replace)
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 0) return
    setCart((prev) => {
      // if quantity is 0, remove it
      if (quantity === 0) return prev.filter((p) => p.id !== id)
      return prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  const addToWishlist = (item: CartItem) => {
    if (!wishlist.find((p) => p.id === item.id)) {
      setWishlist((prev) => [...prev, item])
    }
  }

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        clearCart: () => setCart([]),
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useAppContext must be used within AppProvider")
  return context
}