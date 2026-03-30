"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Product } from "../types/product"
import type { Order } from "../types/order"
import type { User } from "../types/user"
import type { Offer, Dispute, SystemNotification } from "../types/market"
import { mockProducts, mockOrders, mockUsers, mockOffers, mockDisputes, systemNotifications } from "../lib/mockData"

interface AdminContextType {
  products: Product[]
  orders: Order[]
  users: User[]
  offers: Offer[]
  disputes: Dispute[]
  notifications: SystemNotification[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, order: Partial<Order>) => void
  addUser: (user: User) => void
  updateUser: (id: string, user: Partial<User>) => void
  updateDispute: (id: string, dispute: Partial<Dispute>) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [offers] = useState<Offer[]>(mockOffers)
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes)
  const [notifications] = useState<SystemNotification[]>(systemNotifications)

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const addOrder = (order: Order) => {
    setOrders((prev) => [...prev, order])
  }

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)))
  }

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user])
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }

  const updateDispute = (id: string, updates: Partial<Dispute>) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)))
  }

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        users,
        offers,
        disputes,
        notifications,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        addUser,
        updateUser,
        updateDispute,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
