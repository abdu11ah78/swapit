"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { ArrowLeft, Save, X, CheckCircle, AlertCircle, ShoppingCart, Truck, DollarSign, Trash2, Edit2, Eye, Calendar } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: number
  product: string
  quantity: number
  unitPrice: number
  total: number
}

interface PurchaseOrder {
  id: number
  orderId: string
  vendor: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "delivered" | "cancelled"
  orderDate: string
  deliveryDate?: string
}

const vendorList = [
  { id: 1, name: "TechSupply Co." },
  { id: 2, name: "Global Electronics" },
  { id: 3, name: "Premium Imports Ltd." },
  { id: 4, name: "Wholesale Direct" },
]

const productList = [
  { id: 1, name: "Wireless Headphones Pro", basePrice: 149.99 },
  { id: 2, name: "Smart Watch Ultra", basePrice: 399.99 },
  { id: 3, name: "Portable Speaker", basePrice: 79.99 },
  { id: 4, name: "USB-C Hub", basePrice: 49.99 },
  { id: 5, name: "Laptop Stand", basePrice: 59.99 },
]

export default function CreatePurchasePage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: 1,
      orderId: "PO-001",
      vendor: "TechSupply Co.",
      items: [
        { id: 1, product: "Wireless Headphones Pro", quantity: 50, unitPrice: 149.99, total: 7499.5 },
      ],
      totalAmount: 7499.5,
      status: "confirmed",
      orderDate: "2024-01-10",
      deliveryDate: "2024-01-20",
    },
    {
      id: 2,
      orderId: "PO-002",
      vendor: "Global Electronics",
      items: [
        { id: 1, product: "Smart Watch Ultra", quantity: 30, unitPrice: 399.99, total: 11999.7 },
        { id: 2, product: "Portable Speaker", quantity: 20, unitPrice: 79.99, total: 1599.8 },
      ],
      totalAmount: 13599.5,
      status: "pending",
      orderDate: "2024-01-15",
    },
  ])

  const [formData, setFormData] = useState({
    vendor: "",
    selectedProducts: [] as number[],
    orderDate: new Date().toISOString().split("T")[0],
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const handleFieldChange = (field: string, value: string | number | string[]) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleAddProduct = (productId: number) => {
    const product = productList.find((p) => p.id === productId)
    if (!product) return

    const existingItem = orderItems.find((item) => item.id === productId)
    if (existingItem) return

    const newItem: OrderItem = {
      id: productId,
      product: product.name,
      quantity: 1,
      unitPrice: product.basePrice,
      total: product.basePrice,
    }

    setOrderItems([...orderItems, newItem])
    setHasChanges(true)
  }

  const handleUpdateItem = (id: number, field: string, value: number) => {
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === "quantity" || field === "unitPrice") {
            const quantity = field === "quantity" ? value : item.quantity
            const unitPrice = field === "unitPrice" ? value : item.unitPrice
            return { ...item, [field]: value, total: quantity * unitPrice }
          }
          return { ...item, [field]: value }
        }
        return item
      })
    )
    setHasChanges(true)
  }

  const handleRemoveItem = (id: number) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id))
    setHasChanges(true)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.vendor) newErrors.vendor = "Vendor is required"
    if (orderItems.length === 0) newErrors.items = "At least one product is required"
    if (!formData.orderDate) newErrors.orderDate = "Order date is required"
    orderItems.forEach((item, idx) => {
      if (item.quantity <= 0) newErrors[`quantity-${idx}`] = "Quantity must be greater than 0"
      if (item.unitPrice <= 0) newErrors[`price-${idx}`] = "Unit price must be greater than 0"
    })

    return newErrors
  }

  const calculateTotal = () => orderItems.reduce((sum, item) => sum + item.total, 0)

  const handleCreateOrder = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newOrder: PurchaseOrder = {
      id: orders.length + 1,
      orderId: `PO-${String(orders.length + 1).padStart(3, "0")}`,
      vendor: formData.vendor,
      items: orderItems,
      totalAmount: calculateTotal(),
      status: "pending",
      orderDate: formData.orderDate,
    }

    setOrders([newOrder, ...orders])
    setSuccessMessage(`Purchase Order "${newOrder.orderId}" created successfully!`)
    setFormData({
      vendor: "",
      selectedProducts: [],
      orderDate: new Date().toISOString().split("T")[0],
    })
    setOrderItems([])
    setHasChanges(false)

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleReset = () => {
    setFormData({
      vendor: "",
      selectedProducts: [],
      orderDate: new Date().toISOString().split("T")[0],
    })
    setOrderItems([])
    setErrors({})
    setHasChanges(false)
  }

  const handleDeleteOrder = (id: number) => {
    setOrders(orders.filter((o) => o.id !== id))
    setSuccessMessage("Purchase order deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/purchases/list" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Purchases
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Create Purchase Order
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage vendor purchase orders</p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200 font-medium">{successMessage}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Truck className="w-5 h-5" />
                  New Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Vendor
                  </label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => handleFieldChange("vendor", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select vendor</option>
                    {vendorList.map((vendor) => (
                      <option key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                  {errors.vendor && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.vendor}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Input
                    label="Order Date"
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => handleFieldChange("orderDate", e.target.value)}
                  />
                  {errors.orderDate && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.orderDate}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Add Products
                  </label>
                  <select
                    onChange={(e) => handleAddProduct(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value=""
                  >
                    <option value="">Select product to add</option>
                    {productList.map((product) => (
                      <option key={product.id} value={product.id} disabled={orderItems.some((item) => item.id === product.id)}>
                        {product.name} (${product.basePrice.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  {errors.items && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.items}
                    </p>
                  )}
                </motion.div>

                {/* Unsaved Changes Warning */}
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">Unsaved changes</p>
                  </motion.div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={handleCreateOrder}
                      className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                    >
                      <Save className="w-4 h-4" />
                      Create Order
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items & History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Order Items */}
            {orderItems.length > 0 && (
              <Card>
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                    <ShoppingCart className="w-5 h-5" />
                    Order Items ({orderItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {orderItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{item.product}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <label className="text-gray-600 dark:text-gray-400 text-xs">Qty</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, "quantity", Number(e.target.value))}
                              className="w-full px-2 py-1 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[`quantity-${idx}`] && (
                              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors[`quantity-${idx}`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-gray-600 dark:text-gray-400 text-xs">Unit Price</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateItem(item.id, "unitPrice", Number(e.target.value))}
                              className="w-full px-2 py-1 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[`price-${idx}`] && (
                              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors[`price-${idx}`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-gray-600 dark:text-gray-400 text-xs">Total</label>
                            <p className="w-full px-2 py-1 mt-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded text-sm font-semibold">
                              ${item.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <div className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          Order Total:
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Purchase Order History */}
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Calendar className="w-5 h-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No purchase orders yet.</p>
                    </motion.div>
                  ) : (
                    orders.map((order, idx) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{order.orderId}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.vendor}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "confirmed"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : order.status === "pending"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                  : order.status === "delivered"
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 my-3 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Order Date</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{order.orderDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Items</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{order.items.length} product(s)</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-3 mb-3">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            Total: <span className="text-blue-600 dark:text-blue-400">${order.totalAmount.toFixed(2)}</span>
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded transition text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded transition text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteOrder(order.id)}
                            className="flex-1 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}