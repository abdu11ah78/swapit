"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Product } from "../types/product"
import type { Order } from "../types/order"
import type { User } from "../types/user"
import { mockProducts, mockOrders, mockUsers } from "../lib/mockData"

interface AdminContextType {
  products: Product[]
  orders: Order[]
  users: User[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, order: Partial<Order>) => void
  addUser: (user: User) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [users, setUsers] = useState<User[]>(mockUsers)

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

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        users,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        addUser,
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
