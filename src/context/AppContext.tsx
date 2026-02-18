"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type WalletItem = {
  id: string
  name: string
  price: number // LT Points Value
  imageUrl: string
  quantity: number
}

export type AppContextType = {
  wallet: WalletItem[]
  wishlist: WalletItem[]
  isLoggedIn: boolean
  currentUser: any
  addToWallet: (item: WalletItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromWallet: (id: string) => void
  addToWishlist: (item: WalletItem) => void
  removeFromWishlist: (id: string) => void
  clearWallet: () => void
  login: (user: any) => void
  logout: () => void
  isAiMode: boolean
  toggleAiMode: () => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletItem[]>([])
  const [wishlist, setWishlist] = useState<WalletItem[]>([])

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // AI/View Mode state
  const [isAiMode, setIsAiMode] = useState(false)


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLogin = localStorage.getItem("isLoggedIn") === "true"
      if (storedLogin) {
        setIsLoggedIn(true)
        setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "null"))
      }
    }
  }, [])

  const login = (user: any) => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("currentUser", JSON.stringify(user))
    setIsLoggedIn(true)
    setCurrentUser(user)
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  const toggleAiMode = () => {
    setIsAiMode(prev => !prev)
  }

  // addToWallet respects incoming item.quantity and merges with existing
  const addToWallet = (item: WalletItem) => {
    const qty = Math.max(1, Number(item.quantity ?? 1))
    setWallet((prev) => {
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
    setWallet((prev) => {
      // if quantity is 0, remove it
      if (quantity === 0) return prev.filter((p) => p.id !== id)
      return prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    })
  }

  const removeFromWallet = (id: string) => {
    setWallet((prev) => prev.filter((p) => p.id !== id))
  }

  const addToWishlist = (item: WalletItem) => {
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
        wallet,
        wishlist,
        isLoggedIn,
        currentUser,
        addToWallet,
        updateQuantity,
        removeFromWallet,
        addToWishlist,
        removeFromWishlist,
        clearWallet: () => setWallet([]),
        login,
        logout,
        isAiMode,
        toggleAiMode
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
