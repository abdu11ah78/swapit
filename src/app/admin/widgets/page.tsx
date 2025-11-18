"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, ArrowRight, ShoppingCart, Package, CreditCard, Star, Globe, Zap, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

// Type Definitions
interface ChartData {
  [key: string]: string | number
}

interface PaymentDataItem extends ChartData {
  name: string
  value: number
  color: string
}

interface ConversionMeterProps {
  completed: number
  abandoned: number
}

interface ChartPreviewProps {
  type: string
  data: ChartData[]
}

interface LiveDataState {
  cartAbandoned: number
  cartCompleted: number
  inventoryItems: number
  transactionSuccess: number
  customerCount: number
  avgRating: number
  storeLocations: number
  activeTickets: number
  emailOpenRate: number
}

// Demo Data Variables
const cartAnalyticsData = [
  { time: "00:00", abandoned: 45, completed: 120 },
  { time: "04:00", abandoned: 52, completed: 135 },
  { time: "08:00", abandoned: 48, completed: 180 },
  { time: "12:00", abandoned: 61, completed: 220 },
  { time: "16:00", abandoned: 55, completed: 210 },
  { time: "20:00", abandoned: 67, completed: 250 },
  { time: "23:59", abandoned: 72, completed: 280 },
]

const inventoryData = [
  { product: "Electronics", stock: 245, reorder: 50 },
  { product: "Clothing", stock: 420, reorder: 100 },
  { product: "Books", stock: 180, reorder: 40 },
  { product: "Home", stock: 305, reorder: 75 },
  { product: "Sports", stock: 215, reorder: 60 },
]

const paymentData: PaymentDataItem[] = [
  { name: "Credit Card", value: 45, color: "#3b82f6" },
  { name: "Debit Card", value: 25, color: "#10b981" },
  { name: "Digital Wallet", value: 20, color: "#8b5cf6" },
  { name: "Bank Transfer", value: 10, color: "#f59e0b" },
]

const salesData = [
  { date: "Jan", sales: 4000, revenue: 2400 },
  { date: "Feb", sales: 5200, revenue: 2800 },
  { date: "Mar", sales: 4800, revenue: 2400 },
  { date: "Apr", sales: 6100, revenue: 3200 },
  { date: "May", sales: 7200, revenue: 3800 },
  { date: "Jun", sales: 8500, revenue: 4300 },
]

const supportData = [
  { time: "Mon", tickets: 25, resolved: 20 },
  { time: "Tue", tickets: 30, resolved: 28 },
  { time: "Wed", tickets: 22, resolved: 22 },
  { time: "Thu", tickets: 28, resolved: 24 },
  { time: "Fri", tickets: 35, resolved: 30 },
  { time: "Sat", tickets: 18, resolved: 16 },
  { time: "Sun", tickets: 15, resolved: 14 },
]

// Widget Preview Component
const ChartPreview = ({ type, data }: ChartPreviewProps) => {
  if (type === "cartAnalytics") {
    return (
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAbandoned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="abandoned" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbandoned)" />
            <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
  if (type === "inventory") {
    return (
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="product" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="stock" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
  if (type === "payment") {
    return (
      <div className="h-32 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data as PaymentDataItem[]} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
              {(data as PaymentDataItem[]).map((entry, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }
  if (type === "sales") {
    return (
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }
  if (type === "support") {
    return (
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="tickets" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="resolved" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
  return null
}

// Meter Component for Conversion Rate
const ConversionMeter = ({ completed, abandoned }: ConversionMeterProps) => {
  const total = completed + abandoned
  const rate = Math.round((completed / total) * 100)
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center relative overflow-hidden">
        <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="8" />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="8"
            strokeDasharray={`${(rate / 100) * 283} 283`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{rate}%</span>
          <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 block">Conv.</span>
        </div>
      </div>
      <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Conversion Rate</span>
    </div>
  )
}

export default function WidgetsPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [liveData, setLiveData] = useState<LiveDataState>({
    cartAbandoned: 72,
    cartCompleted: 280,
    inventoryItems: 1365,
    transactionSuccess: 98.5,
    customerCount: 4210,
    avgRating: 4.7,
    storeLocations: 12,
    activeTickets: 15,
    emailOpenRate: 42,
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        cartAbandoned: Math.max(50, Math.min(100, prev.cartAbandoned + Math.random() * 20 - 10)),
        cartCompleted: Math.max(250, Math.min(350, prev.cartCompleted + Math.random() * 40 - 20)),
        inventoryItems: Math.max(1200, Math.min(1500, prev.inventoryItems + Math.floor(Math.random() * 20 - 10))),
        transactionSuccess: Math.max(95, Math.min(99.9, prev.transactionSuccess + (Math.random() - 0.5))),
        customerCount: Math.max(4000, Math.min(4500, prev.customerCount + Math.floor(Math.random() * 30 - 15))),
        avgRating: Math.max(4.2, Math.min(5, prev.avgRating + (Math.random() - 0.5) * 0.2)),
        storeLocations: 12,
        activeTickets: Math.max(10, Math.min(35, prev.activeTickets + Math.floor(Math.random() * 6 - 3))),
        emailOpenRate: Math.max(35, Math.min(55, prev.emailOpenRate + (Math.random() - 0.5) * 3)),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const widgets = [
    { icon: ShoppingCart, label: "Shopping Cart Analytics", description: "Track cart abandonment and conversion rates", type: "cartAnalytics", data: cartAnalyticsData, stat: `${Math.round(liveData.cartCompleted)}` },
    { icon: Package, label: "Inventory Management", description: "Real-time stock tracking and updates", type: "inventory", data: inventoryData, stat: `${liveData.inventoryItems}` },
    { icon: CreditCard, label: "Payment Processing", description: "Secure payment gateway integration", type: "payment", data: paymentData, stat: `${liveData.transactionSuccess.toFixed(1)}%` },
    { icon: TrendingUp, label: "Sales Dashboard", description: "Revenue trends and performance metrics", type: "sales", data: salesData, stat: `$${(8500).toLocaleString()}` },
    { icon: Users, label: "Customer Management", description: "Manage user profiles and loyalty programs", type: "customer", stat: `${liveData.customerCount}` },
    { icon: Star, label: "Reviews & Ratings", description: "Customer feedback and rating system", type: "ratings", stat: `${liveData.avgRating.toFixed(1)}/5.0` },
    { icon: Globe, label: "Multi-Store Management", description: "Manage multiple store locations", type: "stores", stat: `${liveData.storeLocations}` },
    { icon: MessageSquare, label: "Customer Support Chat", description: "Live chat and ticketing system", type: "support", data: supportData, stat: `${Math.round(liveData.activeTickets)}` },
    { icon: Zap, label: "Email Marketing", description: "Campaign management and automation", type: "email", stat: `${Math.round(liveData.emailOpenRate)}%` },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900  p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 dark:from-blue-500/20 to-purple-500/10 dark:to-purple-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <div className="pt-18 md:pt-24 relative">
            <motion.div
              animate={{ backgroundPosition: "200% center" }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text ">
                E-Commerce Widgets
              </h1>
            </motion.div>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-3">Live analytics and real-time data for your online store</p>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {widgets.map((widget, idx) => {
            const Icon = widget.icon
            const colors = [
              { color: "from-blue-500/20 to-cyan-500/20", darkColor: "dark:from-blue-500/20 dark:to-cyan-500/20", accent: "text-blue-500 dark:text-blue-400" },
              { color: "from-emerald-500/20 to-green-500/20", darkColor: "dark:from-emerald-500/20 dark:to-green-500/20", accent: "text-emerald-500 dark:text-emerald-400" },
              { color: "from-purple-500/20 to-pink-500/20", darkColor: "dark:from-purple-500/20 dark:to-pink-500/20", accent: "text-purple-500 dark:text-purple-400" },
              { color: "from-orange-500/20 to-red-500/20", darkColor: "dark:from-orange-500/20 dark:to-red-500/20", accent: "text-orange-500 dark:text-orange-400" },
              { color: "from-rose-500/20 to-pink-500/20", darkColor: "dark:from-rose-500/20 dark:to-pink-500/20", accent: "text-rose-500 dark:text-rose-400" },
              { color: "from-yellow-500/20 to-amber-500/20", darkColor: "dark:from-yellow-500/20 dark:to-amber-500/20", accent: "text-yellow-600 dark:text-yellow-400" },
              { color: "from-indigo-500/20 to-blue-500/20", darkColor: "dark:from-indigo-500/20 dark:to-blue-500/20", accent: "text-indigo-500 dark:text-indigo-400" },
              { color: "from-teal-500/20 to-cyan-500/20", darkColor: "dark:from-teal-500/20 dark:to-cyan-500/20", accent: "text-teal-500 dark:text-teal-400" },
              { color: "from-fuchsia-500/20 to-purple-500/20", darkColor: "dark:from-fuchsia-500/20 dark:to-purple-500/20", accent: "text-fuchsia-500 dark:text-fuchsia-400" },
            ]
            const colorScheme = colors[idx % colors.length]

            return (
              <motion.div
                key={widget.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                onHoverStart={() => setHoveredIdx(idx)}
                onHoverEnd={() => setHoveredIdx(null)}
                className="group relative"
              >
                                {/* Glow effect */}
                <div className={`absolute inset-0 bg-linear-to-br ${colorScheme.color} ${colorScheme.darkColor} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Card */}
                <motion.div
                  className="relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden transition-all duration-500 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600/80 hover:shadow-lg dark:hover:shadow-none group"
                  whileHover={{ y: -8 }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-5 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-slate-900 dark:from-white via-transparent to-transparent rounded-full blur-3xl"></div>
                  </div>

                  <div className="relative z-10 space-y-3 sm:space-y-4">
                    {/* Icon container */}
                    <motion.div
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br ${colorScheme.color} ${colorScheme.darkColor} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                      whileHover={{ rotate: 12 }}
                    >
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${colorScheme.accent}`} />
                    </motion.div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {widget.label}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {widget.description}
                      </p>
                    </div>

                    {/* Chart or Stat */}
                    <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-2 sm:p-3">
                      {widget.type === "cartAnalytics" && widget.data && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                          <div className="flex-1 w-full scale-75 origin-top-left -mx-6 -my-4">
                            <ChartPreview type={widget.type} data={widget.data} />
                          </div>
                          <div className="shrink-0 scale-75 sm:scale-100">
                            <ConversionMeter completed={liveData.cartCompleted} abandoned={liveData.cartAbandoned} />
                          </div>
                        </div>
                      )}
                      {widget.type !== "cartAnalytics" && widget.data && (
                        <div className="scale-75 origin-top-left -mx-6 -my-4">
                          <ChartPreview type={widget.type} data={widget.data} />
                        </div>
                      )}
                      {!widget.data && (
                        <div className="flex items-center justify-between py-3 sm:py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{widget.stat}</span>
                            <span className="text-xs text-slate-600 dark:text-slate-400">Live Data</span>
                          </div>
                          {widget.type === "customer" && (
                            <div className="text-right">
                              <span className="text-lg font-semibold text-green-600 dark:text-green-400">↑ 2.5%</span>
                            </div>
                          )}
                          {widget.type === "ratings" && (
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(liveData.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                              ))}
                            </div>
                          )}
                          {widget.type === "stores" && (
                            <Globe className={`w-8 h-8 ${colorScheme.accent}`} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <motion.button
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold pt-2 cursor-pointer"
                      animate={hoveredIdx === idx ? { x: 4 } : { x: 0 }}
                      onClick={() => alert(`Added ${widget.label} to your selection!`)}
                    >
                      <span>Add Now</span>
                      <motion.div
                        animate={hoveredIdx === idx ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.6 }}
                      >
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.div>
                    </motion.button>
                  </div>

                  {/* Top-right accent */}
                  <div className="absolute top-0 right-0 w-1 h-12 bg-linear-to-b from-blue-500/80 dark:from-blue-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 sm:mt-16 lg:mt-20 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">Widget Pricing</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Choose the perfect bundle for your e-commerce needs</p>
            {selectedPlan && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">Selected Plan: {selectedPlan}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "Starter", price: "$29", widgets: 3, color: "blue" },
              { name: "Professional", price: "$79", widgets: 6, color: "purple", popular: true },
              { name: "Enterprise", price: "Custom", widgets: "All", color: "pink" },
            ].map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className={`relative rounded-xl border transition-all duration-500 cursor-pointer ${
                  selectedPlan === plan.name
                    ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-500/10 ring-2 ring-green-500/20 dark:ring-green-500/30"
                    : plan.popular
                    ? "border-purple-300 dark:border-purple-500/50 bg-linear-to-br from-purple-50 to-white dark:from-purple-500/10 dark:to-slate-800/50 ring-2 ring-purple-500/20 dark:ring-purple-500/30"
                    : "border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/20 hover:border-slate-300 dark:hover:border-slate-600/50"
                }`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-800 text-white text-xs font-bold px-4 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">/month</span>}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">{plan.widgets} widgets included</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full cursor-pointer py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ${
                      selectedPlan === plan.name
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : plan.popular
                        ? "bg-slate-100 text-slate-900 hover:shadow-lg hover:shadow-purple-500/50"
                        : "bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlan(plan.name)
                      alert(`Selected ${plan.name} plan!`)
                    }}
                  >
                    {selectedPlan === plan.name ? "Selected" : "Choose Plan"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">Need a custom solution?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 cursor-pointer sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-500/30 transition-all duration-300"
            onClick={() => alert("Contacting sales...")}
          >
            Contact Sales
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}