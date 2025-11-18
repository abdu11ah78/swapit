"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
// Removed the unused 'Badge' import
import { useAdmin } from "../../context/AdminContext"
import { AlertCircle, Package, Box, MinusCircle, BarChart3, TrendingDown } from "lucide-react" 
// Removed the unused 'CheckCircle' and 'Clock' imports

// Assuming the Product interface is now defined within or inferred from AdminContext,
// or is defined elsewhere. I'll remove the local interface definition.

export default function InventoryListPage() {
  // Relying entirely on the imported useAdmin() from your context
  // NOTE: You must ensure your AdminContext provides a 'products' array.
  const { products } = useAdmin()

  const lowStockProducts = products.filter((p) => p.stock < 10);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const statCards = [
    { label: "Total Inventory Units", value: totalStock, icon: Package, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Number of Products", value: products.length, icon: Box, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Low Stock Items", value: lowStockProducts.length, icon: TrendingDown, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Out of Stock", value: products.filter((p) => p.stock === 0).length, icon: MinusCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  ];
  
  // Helper to determine the style without relying on the custom <Badge> component
  const getStockStyle = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-600", text: "text-red-600 dark:text-red-400" };
    if (stock < 10) return { label: "Low Stock", color: "bg-yellow-600", text: "text-yellow-600 dark:text-yellow-400" };
    return { label: "In Stock", color: "bg-green-600", text: "text-green-600 dark:text-green-400" };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage product stock levels for your store</p>
          </div>
        </motion.div>

        {/* Low Stock Alert - Uses the established warning style */}
        {lowStockProducts.length > 0 && (
          <motion.div
            className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">Urgent: Low Stock Alert</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <span className="font-bold">{lowStockProducts.length} products</span> need immediate attention (stock &lt; 10 units).
              </p>
            </div>
          </motion.div>
        )}

        {/* Stock Overview (4-Column Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className={`pt-6 ${stat.bg} rounded-t-xl`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </CardContent>
                <CardContent className="pt-4 pb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Inventory List Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Box className="w-5 h-5" />
                Product Stock Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product, index) => {
                  const style = getStockStyle(product.stock);
                  return (
                    <motion.div
                      key={product.id}
                      className="flex items-center justify-between p-4 dark:hover:bg-gray-800 hover:bg-gray-50 transition duration-150"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">SKU: {product.sku}</p>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        {/* Stock Count */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Current Stock</p>
                          <p className={`font-bold text-lg ${style.text}`}>
                            {product.stock}
                          </p>
                        </div>
                        {/* Badge - Using Tailwind classes instead of imported <Badge> */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${style.color}`}>
                            {style.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}