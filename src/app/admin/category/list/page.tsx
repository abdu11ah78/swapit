"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { mockCategories } from "../../lib/mockData"
import { Plus, Edit2, Trash2, Tag } from "lucide-react" // Removed FileText as it's not in the screenshot
import Link from "next/link"

export default function CategoryListPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header and Add Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          {/* Enhanced Title Style (matching the screenshot's minimalist approach) */}
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" /> {/* Slightly smaller icon */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1> {/* Slightly smaller title */}
          </div>
          
          <Link href="/admin/category/create">
            {/* Primary Button Style (matching the screenshot) */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Category List Grid - Fixed to 3 columns and enlarged cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" // Explicitly setting 3 columns for lg screens
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {mockCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.08 }}
            >
              <Card className="p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between h-full"> {/* Enlarged card with subtle shadow/border */}
                
                {/* Card Header - Minimalist, as in the screenshot */}
                <CardHeader className="p-0 border-none mb-4">
                  <CardTitle className="flex flex-col items-start space-y-1"> {/* Aligned to start */}
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</span> {/* Larger title */}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{category.productCount} items</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-0 space-y-4 grow"> {/* Adjust content padding */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{category.description}</p>
                </CardContent>

                {/* Buttons - Redesigned to match screenshot */}
                <div className="flex gap-3 pt-6"> {/* Padding top to separate from description */}
                  {/* Edit Button - Screenshot style */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 cursor-pointer bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  
                  {/* Delete Button - Screenshot style */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-1/3 px-4 py-2 cursor-pointer bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-2 border border-red-200 dark:border-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}