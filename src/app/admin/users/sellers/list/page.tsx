"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { useAdmin } from "../../../context/AdminContext"
import { Users, Mail, DollarSign, Box, Search, Star, TrendingUp, Eye, Edit2, Trash2, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Seller {
  id: string  // Changed from number to string
  name: string
  email: string
  status: "active" | "inactive"
  productsListed: number
  totalSales: number
  rating: string  // Changed from number to string
  joinDate: string
  orders: number
  revenue: number
}

export default function SellersListPage() {
  const { users } = useAdmin()
  const sellers: Seller[] = users
    .filter((u) => u.role === "seller")
    .map((u) => ({
      id: u.id,  // Now string (from user object)
      name: u.name,
      email: u.email,
      status: u.status as "active" | "inactive",
      productsListed: Math.floor(Math.random() * 100) + 10,
      totalSales: Math.floor(Math.random() * 100000) + 5000,
      rating: (Math.random() * 2 + 3).toFixed(1),  // Already returns string
      joinDate: new Date(Date.now() - Math.random() * 31536000000).toISOString().split("T")[0],
      orders: Math.floor(Math.random() * 500) + 10,
      revenue: Math.floor(Math.random() * 500000) + 10000,
    }))

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [sortBy, setSortBy] = useState<"name" | "sales" | "rating">("name")
  const [deletedSellerId, setDeletedSellerId] = useState<string | null>(null)  // Changed to string
  const [successMessage, setSuccessMessage] = useState("")

  const filteredSellers = sellers
    .filter((seller) => {
      const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) || seller.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === "all" || seller.status === filterStatus
      return matchesSearch && matchesStatus && seller.id !== deletedSellerId
    })
    .sort((a, b) => {
      if (sortBy === "sales") return b.totalSales - a.totalSales
      if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating)
      return a.name.localeCompare(b.name)
    })

  const handleDeleteSeller = (id: string, name: string) => {  // Changed to string
    setDeletedSellerId(id)
    setSuccessMessage(`Seller "${name}" has been removed`)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const getBadgeStyle = (status: string) => {
    return status === "active"
      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
  }

  const getRatingColor = (rating: string) => {  // Changed to string parameter
    const ratingNum = parseFloat(rating)
    if (ratingNum >= 4.5) return "text-yellow-500"
    if (ratingNum >= 4) return "text-yellow-400"
    return "text-gray-400"
  }

  const totalStats = {
    sellers: filteredSellers.length,
    totalRevenue: filteredSellers.reduce((sum, s) => sum + s.revenue, 0),
    avgRating: (filteredSellers.reduce((sum, s) => sum + parseFloat(s.rating), 0) / (filteredSellers.length || 1)).toFixed(1),
    totalProducts: filteredSellers.reduce((sum, s) => sum + s.productsListed, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Seller Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage seller accounts and performance across the platform</p>
            </div>
          </div>
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

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Sellers</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalStats.sellers}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">${(totalStats.totalRevenue / 1000).toFixed(0)}K</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Avg Rating</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">{totalStats.avgRating}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Products Listed</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totalStats.totalProducts}</p>
          </div>
        </motion.div>

        {/* Search, Filter, and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "sales" | "rating")}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="sales">Sort by Sales</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </motion.div>

        {/* Sellers Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredSellers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-12"
            >
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No sellers found. Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            filteredSellers.map((seller, idx) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-lg dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <CardHeader className="p-4 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg">
                    <CardTitle className="flex items-start justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{seller.name}</span>
                      <Badge className={`${getBadgeStyle(seller.status)} px-2 py-1 rounded text-xs font-medium`}>
                        {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-4 pb-6 flex-1 flex flex-col">
                    {/* Email */}
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{seller.email}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(parseFloat(seller.rating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-semibold ${getRatingColor(seller.rating)}`}>{seller.rating}</span>
                    </div>

                    {/* Join Date */}
                    <p className="text-xs text-gray-600 dark:text-gray-400">Joined {seller.joinDate}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Box className="w-3 h-3" />
                          Products
                        </p>
                        <p className="font-bold text-lg text-blue-600 dark:text-blue-400 mt-1">{seller.productsListed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Sales
                        </p>
                        <p className="font-bold text-lg text-green-600 dark:text-green-400 mt-1">${(seller.totalSales / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Orders
                        </p>
                        <p className="font-bold text-lg text-purple-600 dark:text-purple-400 mt-1">{seller.orders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Revenue
                        </p>
                        <p className="font-bold text-lg text-orange-600 dark:text-orange-400 mt-1">${(seller.revenue / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteSeller(seller.id, seller.name)}
                        className="flex-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}