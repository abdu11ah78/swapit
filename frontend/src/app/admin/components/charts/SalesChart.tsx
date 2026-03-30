'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, // Changed from BarChart
  Area, // Changed from Bar
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SalesData {
  month: string;
  sales: number;
  revenue: number;
}

interface SalesChartCardProps {
  title: string;
  data: SalesData[];
}

/**
 * A Card component wrapping an Area Chart with Framer Motion animations and modern styling.
 */
export function SalesChart({ title, data }: SalesChartCardProps) {
  // Styles consistent with the dark mode aesthetic from the examples
  const gridStroke = "#374151"; 
  const axisStroke = "#9CA3AF"; 
  // Defined colors for the lines/gradients
  const salesColor = "#3B82F6"; // Blue
  const revenueColor = "#14B8A6"; // Teal

  return (
    <motion.div
      // Card Container Entrance Animation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      // Hover Effect: Lifts the card and applies a significant shadow
      whileHover={{ boxShadow: '0 25px 50px rgba(0,0,0,0.18)' }}
      
      // Styling consistent with ChartCard (bg, shadow, border)
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-slate-700 p-6 transition-shadow duration-300"
    >
      {/* Chart Title with animation */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="text-xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {title}
      </motion.h2>

      {/* Responsive Container with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {/* Define the gradient fills for the aesthetic "area" effect */}
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={salesColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={salesColor} stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={revenueColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={revenueColor} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            
            {/* Cartesian Grid style adapted for dark/light mode */}
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.2} vertical={false} />
            
            {/* X Axis style adapted for dark/light mode */}
            <XAxis dataKey="month" stroke={axisStroke} style={{ fontSize: '12px' }} />
            
            {/* Y Axis style adapted for dark/light mode */}
            <YAxis stroke={axisStroke} style={{ fontSize: '12px' }} />
            
            {/* Tooltip style adapted for dark/light mode */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937', // Dark background for tooltip
                border: '1px solid #374151',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                color: '#fff',
              }}
              labelStyle={{ color: "#e2e8f0" }} // Light label text
            />
            
            <Legend wrapperStyle={{ paddingTop: '10px', color: axisStroke }} />
            
            {/* Area components for Sales - smooth line and gradient fill */}
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke={salesColor} 
              fillOpacity={1} 
              fill="url(#colorSales)"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
            
            {/* Area components for Revenue - smooth line and gradient fill */}
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={revenueColor} 
              fillOpacity={1} 
              fill="url(#colorRevenue)"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}