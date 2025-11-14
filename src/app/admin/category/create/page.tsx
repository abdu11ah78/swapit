"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { ArrowLeft, Save, X, CheckCircle, AlertCircle, Palette, FileText, Plus } from "lucide-react"
import Link from "next/link"

const colorOptions = [
  { name: "Red", hex: "#ef4444" },
  { name: "Orange", hex: "#f97316" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Green", hex: "#22c55e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Indigo", hex: "#6366f1" },
]

export default function CreateCategoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    slug: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)

    if (field === "name") {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }))
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Category name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (formData.name.length < 3) newErrors.name = "Category name must be at least 3 characters"
    if (formData.description.length < 10) newErrors.description = "Description must be at least 10 characters"

    return newErrors
  }

  const handleCreateCategory = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log("Category created:", formData)
    setSuccessMessage("Category created successfully!")
    setHasChanges(false)

    setTimeout(() => {
      setSuccessMessage("")
      // Reset form
      setFormData({
        name: "",
        description: "",
        color: "#3b82f6",
        slug: "",
      })
    }, 2000)
  }

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3b82f6",
      slug: "",
    })
    setErrors({})
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/category/list" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
              <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            Create Category
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new product category to your store</p>
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
                <FileText className="w-5 h-5" />
                Category Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Category Name */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Input
                  label="Category Name"
                  placeholder="e.g., Electronics, Clothing, Home Decor"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
                {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.name}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Slug: {formData.slug || "auto-generated"}</p>
              </motion.div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <label className=" text-sm font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Describe what products belong in this category..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                />
                {errors.description && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.description}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.description.length}/500</p>
              </motion.div>

              {/* Color Selection */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <label className=" text-sm font-medium mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Category Color
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {colorOptions.map((color) => (
                    <motion.button
                      key={color.hex}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFieldChange("color", color.hex)}
                      className={`w-10 h-10 rounded-lg transition-all border-2 ${
                        formData.color === color.hex
                          ? "border-gray-900 dark:border-white ring-2 ring-offset-2 ring-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Preview */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Preview</label>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.name.charAt(0).toUpperCase() || "C"}
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{formData.name || "Category Name"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formData.description ? formData.description.substring(0, 50) + "..." : "Category description"}</p>
                    </div>
                  </div>
                </div>
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
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </motion.button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleCreateCategory}
                  className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  Create Category
                </Button>
              </motion.div>
            </CardFooter>
          </Card>

          {/* Info Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Helpful Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
                  <li>Use clear, descriptive names for categories</li>
                  <li>Write detailed descriptions to help customers understand what products are in this category</li>
                  <li>Choose a color that represents your category visually</li>
                  <li>The slug is auto-generated for SEO purposes</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}