/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { mockProducts } from "../../lib/mockData"
import { ArrowLeft, Upload, X, Plus, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EditProductPage() {
  const product = mockProducts[0]
  const [formData, setFormData] = useState(product)
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; file: File }>>([
    { id: "main", url: product.image, file: new File([], "main") },
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = [
    { name: "Navy", hex: "#1a3a52" },
    { name: "Pink", hex: "#ff69b4" },
    { name: "Teal", hex: "#20b2aa" },
    { name: "Purple", hex: "#9370db" },
    { name: "Blue", hex: "#4169e1" },
    { name: "Coral", hex: "#ff7f50" },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      const newErrors = { ...errors }
      delete newErrors.images

      Array.from(files).forEach((file, index) => {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          newErrors.images = `File "${file.name}" is too large. Maximum size is 5MB.`
          return
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          newErrors.images = `File "${file.name}" is not a valid image format.`
          return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          const id = `${Date.now()}-${index}-${Math.random()}`
          const url = event.target?.result as string
          setUploadedImages((prev) => [...prev, { id, url, file }])
          setHasChanges(true)
        }
        reader.onerror = () => {
          newErrors.images = `Error reading file: ${file.name}`
        }
        reader.readAsDataURL(file)
      })

      setErrors(newErrors)
    }
  }

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id))
    setHasChanges(true)
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) newErrors.name = "Product name is required"
    if (!formData.sku?.trim()) newErrors.sku = "SKU is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.price) newErrors.price = "Price is required"
    if (!formData.cost) newErrors.cost = "Cost is required"
    if (!formData.stock === undefined) newErrors.stock = "Stock is required"
    if (!formData.description?.trim()) newErrors.description = "Description is required"
    if (uploadedImages.length === 0) newErrors.images = "At least one image is required"

    if (formData.price && Number.parseFloat(formData.price.toString()) <= 0) {
      newErrors.price = "Price must be greater than 0"
    }
    if (formData.cost && Number.parseFloat(formData.cost.toString()) < 0) {
      newErrors.cost = "Cost cannot be negative"
    }
    if (formData.stock && Number.parseInt(formData.stock.toString()) < 0) {
      newErrors.stock = "Stock cannot be negative"
    }

    return newErrors
  }

  const handleSaveChanges = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Simulate save
    console.log("Product updated:", formData)
    setSuccessMessage("Product updated successfully!")
    setHasChanges(false)

    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/products/list" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{product.name}</p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-gap-3"
          >
            <div className="text-green-800 dark:text-green-200">{successMessage}</div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                <div className="text-center mb-6">
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Drop your images here, or</p>
                  <label className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    click to browse
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">jpeg, png or gif up to 5mb</p>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <Image src={img.url} alt="preview" width={128} height={128} className="w-full h-32 object-cover rounded-lg" />
                        {uploadedImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition bg-gray-50 dark:bg-gray-800">
                      <Plus className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                )}
                {errors.images && <p className="text-red-500 dark:text-red-400 text-sm mt-4">{errors.images}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                  {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  {errors.category && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>

              <div>
                <Input
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => handleFieldChange("sku", e.target.value)}
                />
                {errors.sku && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.sku}</p>}
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-200">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleFieldChange("size", s)}
                      className={`px-4 py-2 rounded-lg border-2 transition font-medium ${
                        formData.size === s
                          ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-200">Colors</label>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => handleFieldChange("color", c.hex)}
                      className={`w-10 h-10 rounded-full border-4 transition ${
                        formData.color === c.hex ? "border-gray-900 dark:border-gray-100 ring-2 ring-blue-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                />
                {errors.description && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Status</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", Number.parseFloat(e.target.value))}
                  />
                  {errors.price && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <Input
                    label="Cost (₹)"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleFieldChange("cost", Number.parseFloat(e.target.value))}
                  />
                  {errors.cost && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cost}</p>}
                </div>
                <div>
                  <Input
                    label="Stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleFieldChange("stock", Number.parseInt(e.target.value))}
                  />
                  {errors.stock && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.stock}</p>}
                </div>
              </div>

              {/* Profit Calculation */}
              {formData.price && formData.cost && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Profit Summary</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Profit per unit:</span>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">${(formData.price - formData.cost).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Profit margin:</span>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{((((formData.price - formData.cost) / formData.price) * 100) || 0).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Indicator */}
          {hasChanges && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">You have unsaved changes</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <CardFooter className="flex gap-4 justify-end">
            <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Discard
            </button>
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges}
              className="px-8 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </CardFooter>
        </motion.div>
      </div>
    </div>
  )
}