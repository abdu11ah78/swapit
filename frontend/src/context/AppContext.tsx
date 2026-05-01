"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { clearAccessToken, getAccessToken } from "@/lib/auth-storage"
import { CustomAlert, ModalType } from "@/components/common/CustomAlert"

export type WalletItem = {
  id: string
  name: string
  price: number // LT Points Value
  imageUrl: string
  quantity: number
}

// Legacy alias for older UI components still using "cart" terminology.
export type CartItem = WalletItem

export type AppContextType = {
  wallet: WalletItem[]
  cart: CartItem[]
  wishlist: WalletItem[]
  isLoggedIn: boolean
  currentUser: CurrentUser | null
  addToCart: (item: CartItem) => void
  addToWallet: (item: WalletItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  removeFromWallet: (id: string) => void
  addToWishlist: (item: WalletItem) => void
  removeFromWishlist: (id: string) => void
  clearWallet: () => void
  clearCart: () => void
  login: (user: CurrentUser) => void
  logout: () => void
  isAiMode: boolean
  toggleAiMode: () => void
  showAlert: (config: AlertConfig) => void
}

export type AlertConfig = {
  title: string
  message: string
  type?: ModalType
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

export type CurrentUser = {
  id?: string
  name?: string
  email?: string
  location?: string
  role?: string
  [key: string]: unknown
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletItem[]>([])
  const [wishlist, setWishlist] = useState<WalletItem[]>([])

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  // AI/View Mode state
  const [isAiMode, setIsAiMode] = useState(false)

  // Alert state
  const [alertConfig, setAlertConfig] = useState<AlertConfig & { isOpen: boolean }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info"
  })

  const showAlert = (config: AlertConfig) => {
    setAlertConfig({ ...config, isOpen: true })
  }


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLogin = sessionStorage.getItem("isLoggedIn") === "true" || !!getAccessToken()
      if (storedLogin) {
        setIsLoggedIn(true)
        setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser") || "null") as CurrentUser | null)
      }
    }
  }, [])

  const login = (user: CurrentUser) => {
    sessionStorage.setItem("isLoggedIn", "true")
    sessionStorage.setItem("currentUser", JSON.stringify(user))
    setIsLoggedIn(true)
    setCurrentUser(user)
  }

  const logout = () => {
    sessionStorage.removeItem("isLoggedIn")
    sessionStorage.removeItem("currentUser")
    clearAccessToken()
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

  // Legacy alias: map cart -> wallet state
  const addToCart = (item: CartItem) => {
    addToWallet(item)
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

  const removeFromCart = (id: string) => {
    removeFromWallet(id)
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
        cart: wallet,
        wishlist,
        isLoggedIn,
        currentUser,
        addToCart,
        addToWallet,
        updateQuantity,
        removeFromCart,
        removeFromWallet,
        addToWishlist,
        removeFromWishlist,
        clearWallet: () => setWallet([]),
        clearCart: () => setWallet([]),
        login,
        logout,
        isAiMode,
        toggleAiMode,
        showAlert
      }}
    >
      {children}
      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          alertConfig.onConfirm?.()
          setAlertConfig(prev => ({ ...prev, isOpen: false }))
        }}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
      />
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useAppContext must be used within AppProvider")
  return context
}
