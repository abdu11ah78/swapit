/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { ArrowLeft, Plus, Zap, FileText, AlertCircle, CheckCircle, X, Save } from "lucide-react"
import Link from "next/link"

// Assuming these are your component imports from the original file:
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
// import { Button } from "../../components/ui/Button"
// import { Input } from "../../components/ui/Input" 
// (Note: The original Input component takes 'label', 'placeholder', etc. as props.
// I will adapt the <select> and <textarea> to match the provided styling.)

export default function AddStockPage() {
  const [formData, setFormData] = useState({
    product: "",
    quantity: 0,
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const qty = Number(formData.quantity);

    if (!formData.product) newErrors.product = "Please select a product"
    if (qty <= 0 || isNaN(qty)) newErrors.quantity = "Quantity must be a number greater than 0"
    if (formData.notes.length > 500) newErrors.notes = "Notes must be less than 500 characters"
    
    return newErrors
  }

  const handleAddStock = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log("Stock Added:", formData)
    setSuccessMessage(`Added ${formData.quantity} unit(s) of stock successfully!`)
    setHasChanges(false)

    setTimeout(() => {
      setSuccessMessage("")
      // Reset form
      setFormData({
        product: "",
        quantity: 0,
        notes: "",
      })
    }, 2000)
  }
  
  const handleReset = () => {
    setFormData({
      product: "",
      quantity: 0,
      notes: "",
    })
    setErrors({})
    setHasChanges(false)
  }
  
  // Dummy product list for the dropdown
  const productOptions = [
    { id: "p1", name: "Wireless Headphones Pro" },
    { id: "p2", name: "Smart Watch Ultra" },
    { id: "p3", name: "USB-C Cable 2M" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/inventory/list" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
              <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            Add Stock
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Record the addition of new inventory units</p>
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6">
          {/* Main Form Card */}
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                <Zap className="w-5 h-5" />
                Stock Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              {/* Product Selection */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className=" text-sm font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Product
                </label>
                <div className="relative">
                  <select
                    value={formData.product}
                    onChange={(e) => handleFieldChange("product", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select a product</option>
                    {productOptions.map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.product && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.product}</p>}
              </motion.div>

              {/* Quantity to Add */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                {/* Reusing the styled Input component pattern from the first file */}
                <Input
                  label="Quantity to Add"
                  type="number"
                  placeholder="0"
                  value={formData.quantity.toString()}
                  onChange={(e) => handleFieldChange("quantity", parseInt(e.target.value) || 0)}
                />
                {errors.quantity && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.quantity}</p>}
              </motion.div>
              
              {/* Notes */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <label className="text-sm font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="e.g., Received shipment from Supplier X"
                  value={formData.notes}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                />
                {errors.notes && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.notes}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.notes.length}/500</p>
              </motion.div>

              {/* Unsaved Changes Warning */}
              {hasChanges && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">You have unsaved changes</p>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                disabled={!hasChanges}
                className="flex-1 cursor-pointer px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </motion.button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleAddStock}
                  className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  Add Stock
                </Button>
              </motion.div>
            </CardFooter>
          </Card>

          {/* Info Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Stock Management Guidance:</p>
                <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
                  <li>Ensure the correct product is selected before adding stock.</li>
                  <li>Use the Notes field to record shipment or supplier information.</li>
                  <li>Adding stock will immediately update the product's available inventory count.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}