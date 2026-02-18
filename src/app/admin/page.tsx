/* eslint-disable react/no-unescaped-entities */
"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../admin/components/ui/Card"
import { SalesChart } from "../admin/components/charts/SalesChart"
import { Zap, Shield, Users, RefreshCw, BarChart3, Box, Layers, Globe, Cpu } from "lucide-react"

// FIX: Importing mockOrders instead of orders
import { dashboardStats, mockOrders, salesChartData, salesChartTitle } from "../admin/lib/mockData"

import { useAdmin } from "../admin/context/AdminContext"

export default function DashboardPage() {
  const { products } = useAdmin()

  const statIcons = [Zap, RefreshCw, Users, Shield]

  // Data structure for the enhanced Asset Registry Summary
  const assetStats = [
    {
      label: "Total Assets",
      value: products.length,
      icon: Box,
      color: "text-indigo-400",
      delay: 0.4
    },
    {
      label: "Node Liquidity",
      value: products.reduce((sum, p) => sum + p.stock, 0).toLocaleString(),
      icon: Cpu,
      color: "text-purple-400",
      delay: 0.5
    },
    {
      label: "Global Market Cap (LTC)",
      value: `${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()} LTC`,
      icon: Globe,
      color: "text-emerald-400",
      delay: 0.6
    },
  ];

  return (
    <div className="pt-24 md:pt-32 space-y-8 bg-slate-950 min-h-screen px-4 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full" />
            Protocol Command Center
          </h1>
          <p className="text-slate-500 font-mono text-sm mt-1 uppercase tracking-widest">
            SYSTEM STATUS: <span className="text-emerald-500 animate-pulse">OPTIMAL</span> // NODE ID: SWAPIT-MAIN-01
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-black tracking-widest uppercase rounded-lg hover:bg-slate-800 transition-colors">
            Run Audit
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            Sync Nodes
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, idx) => {
          const Icon = statIcons[idx]
          const isPositive = stat.trend === "up"
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl relative overflow-hidden group p-6">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon size={80} />
                </div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-2xl font-black text-white mt-2 tracking-tighter">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                        {stat.change}
                      </span>
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">vs prev period</span>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts and Swaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Network performance Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl h-full">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 size={16} className="text-indigo-500" />
                Network Performance Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full bg-slate-950/50 rounded-2xl border border-slate-800/50 p-4">
                <SalesChart title={salesChartTitle} data={salesChartData} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Handshakes Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl h-full">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <RefreshCw size={16} className="text-indigo-500" />
                Live Handshake Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {mockOrders.slice(0, 5).map((order) => (
                <motion.div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-colors group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <span className="text-indigo-500 text-[10px] font-black">NODE</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-white tracking-widest">{order.orderNumber}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-indigo-400">{order.total} LTC</p>
                    <p className="text-[8px] text-slate-600 font-bold uppercase mt-0.5">ESTIMATED VAL</p>
                  </div>
                </motion.div>
              ))}
              <button className="w-full py-3 bg-slate-800/50 border border-slate-700 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-colors">
                View Global Ledger
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Asset Registry Summary (Product Overview) - ENHANCED CARD GRID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
          <CardHeader>
            <CardTitle className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <Layers size={16} className="text-indigo-500" />
              Global Asset Registry Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assetStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: stat.delay }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.4)" }}
                    className="p-6 border border-slate-800 rounded-2xl bg-slate-950/40 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-indigo-500/40 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/30 transition-colors`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-4 uppercase font-black tracking-[0.2em] group-hover:text-slate-300 transition-colors">
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