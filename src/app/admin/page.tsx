/* eslint-disable react/no-unescaped-entities */
"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../admin/components/ui/Card"
import { SalesChart } from "../admin/components/charts/SalesChart" 
// Added Package and Layers icons
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, BarChart3, Package, Layers } from "lucide-react"

// FIX: Importing mockOrders instead of orders
import { dashboardStats, mockOrders, salesChartData, salesChartTitle } from "../admin/lib/mockData" 

import { useAdmin } from "../admin/context/AdminContext" 

export default function DashboardPage() {
  const { products } = useAdmin() // Removed 'orders' from destructuring, as it's now imported

  const statIcons = [DollarSign, ShoppingCart, Users, BarChart3]

  // Data structure for the enhanced Inventory Summary
  const inventoryStats = [
    { 
      label: "Total Products", 
      value: products.length, 
      icon: Package, 
      color: "text-blue-500",
      delay: 0.4 
    },
    { 
      label: "Total Stock", 
      value: products.reduce((sum, p) => sum + p.stock, 0).toLocaleString(), 
      icon: Layers, 
      color: "text-emerald-500",
      delay: 0.5 
    },
    { 
      label: "Total assets", 
      value: `$${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-purple-500",
      delay: 0.6
    },
  ];

  return (
    <div className=" pt-24 md:pt-32 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, staggerChildren: 0.1 }}
      >
        {dashboardStats.map((stat, idx) => {
          const Icon = statIcons[idx]
          const isPositive = stat.trend === "up"
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={isPositive ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts and Tables */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Sales Chart (Using original Card structure and SalesChart import) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart title={salesChartTitle} 
              data={salesChartData} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* FIX: Using mockOrders here */}
            {mockOrders.slice(0, 4).map((order) => (
              <motion.div
                key={order.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                whileHover={{ x: 4 }}
              >
                <div>
                  <p className="font-medium text-foreground">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <span className="font-semibold text-primary">${order.total}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Inventory Summary (Product Overview) - ENHANCED CARD GRID */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Product Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {inventoryStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: stat.delay }}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    className="p-5 border border-border rounded-xl bg-background/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-8 h-8 ${stat.color} dark:${stat.color}/80`} />
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}