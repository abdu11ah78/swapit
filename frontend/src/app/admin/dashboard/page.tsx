"use client"

import { motion } from "framer-motion"
import { 
  Users, 
  Boxes, 
  Handshake, 
  TriangleAlert, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { dashboardStats, salesChartData, salesChartTitle } from "../lib/mockData"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts"

import { useDashboardStats } from "@/features/admin/admin.hooks"

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStats()

  const displayStats = stats ? [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), change: "+4.2%", trend: "up" },
    { label: "Total Trades", value: stats.totalTrades.toLocaleString(), change: "+8.2%", trend: "up" },
    { label: "Active Listings", value: stats.totalItems.toLocaleString(), change: "+2.9%", trend: "up" },
    { label: "Open Disputes", value: stats.openDisputes.toString(), change: "-3.1%", trend: "down" },
  ] : dashboardStats

  const chartData = stats?.monthlyActivity.length ? stats.monthlyActivity : salesChartData

  const performanceData = [
    { name: 'Server Health', value: 98, color: '#FDB813' },
    { name: 'Trade Success', value: 92, color: '#10B981' },
    { name: 'Dispute Resolution', value: 85, color: '#3B82F6' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--admin-text)] tracking-tight">
            Control <span className="text-[var(--admin-primary)]">Center</span>
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1 font-medium">
            System overview and platform performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-button-primary flex items-center gap-2">
            <TrendingUp size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {displayStats.map((stat, index) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="relative overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <h3 className="text-3xl font-black text-[var(--admin-text)] mt-2">
                      {isLoading ? "..." : stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    index === 0 ? "bg-blue-500/10 text-blue-500" :
                    index === 1 ? "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]" :
                    index === 2 ? "bg-green-500/10 text-green-500" :
                    "bg-red-500/10 text-red-500"
                  }`}>
                    {index === 0 ? <Users size={24} /> :
                     index === 1 ? <Handshake size={24} /> :
                     index === 2 ? <Boxes size={24} /> :
                     <TriangleAlert size={24} />}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`flex items-center text-xs font-black px-2 py-1 rounded-lg ${
                    stat.trend === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </span>
                  <span className="text-xs text-[var(--admin-text-muted)] font-medium">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{salesChartTitle}</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--admin-text-muted)', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--admin-text-muted)', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--admin-surface)', 
                    borderColor: 'var(--admin-border)',
                    borderRadius: '12px',
                    color: 'var(--admin-text)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="trades" 
                  stroke="var(--admin-primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--admin-text-muted)', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--admin-text-muted)', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--admin-border)', opacity: 0.2 }}
                  contentStyle={{ 
                    backgroundColor: 'var(--admin-surface)', 
                    borderColor: 'var(--admin-border)',
                    borderRadius: '12px'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--admin-primary)" 
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Performance & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Performance Nodes</CardTitle>
          </CardHeader>
          <CardContent className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {performanceData.map((item) => (
                <div key={item.name} className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: item.value },
                            { value: 100 - item.value }
                          ]}
                          innerRadius={35}
                          outerRadius={45}
                          startAngle={90}
                          endAngle={450}
                          paddingAngle={0}
                          dataKey="value"
                        >
                          <Cell fill={item.color} />
                          <Cell fill="var(--admin-border)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-[var(--admin-text)]">{item.value}%</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-bold text-[var(--admin-text)]">{item.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 mt-6">
            {[
              { label: "API Latency", value: "24ms", status: "Optimal" },
              { label: "Storage Load", value: "42%", status: "Good" },
              { label: "Active Nodes", value: "12/12", status: "Stable" },
              { label: "Memory Usage", value: "1.2GB", status: "Optimal" }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)]">
                <div>
                  <p className="text-xs font-bold text-[var(--admin-text-muted)] uppercase">{item.label}</p>
                  <p className="text-lg font-black text-[var(--admin-text)]">{item.value}</p>
                </div>
                <Badge variant="success">{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
