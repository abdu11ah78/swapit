"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { ArrowLeft, Save, X, CheckCircle, AlertCircle, Tag,  Copy, Trash2, Edit2 } from "lucide-react"
import Link from "next/link"

interface Coupon {
  id: number
  code: string
  discountAmount: number
  discountType: "fixed" | "percentage"
  maxUsage: number
  currentUsage: number
  startDate: string
  endDate: string
  status: "active" | "expired" | "inactive"
  createdDate: string
}

export default function CreateCouponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 1,
      code: "SUMMER20",
      discountAmount: 20,
      discountType: "percentage",
      maxUsage: 100,
      currentUsage: 45,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "active",
      createdDate: "2024-05-15",
    },
    {
      id: 2,
      code: "WELCOME10",
      discountAmount: 10,
      discountType: "fixed",
      maxUsage: 500,
      currentUsage: 234,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      createdDate: "2024-01-01",
    },
  ])

  const [formData, setFormData] = useState({
    couponCode: "",
    discountAmount: "",
    discountType: "percentage",
    maxUsage: "",
    startDate: "",
    endDate: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.couponCode.trim()) newErrors.couponCode = "Coupon code is required"
    if (formData.couponCode.length < 3) newErrors.couponCode = "Coupon code must be at least 3 characters"
    if (!/^[A-Z0-9]+$/.test(formData.couponCode)) newErrors.couponCode = "Coupon code must be uppercase alphanumeric"
    if (!formData.discountAmount) newErrors.discountAmount = "Discount amount is required"
    if (Number(formData.discountAmount) <= 0) newErrors.discountAmount = "Discount amount must be greater than 0"
    if (formData.discountType === "percentage" && Number(formData.discountAmount) > 100)
      newErrors.discountAmount = "Percentage discount cannot exceed 100%"
    if (!formData.maxUsage) newErrors.maxUsage = "Max usage is required"
    if (Number(formData.maxUsage) <= 0) newErrors.maxUsage = "Max usage must be greater than 0"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate)
      newErrors.endDate = "End date must be after start date"

    return newErrors
  }

  const handleCreateCoupon = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const today = new Date().toISOString().split("T")[0]
    const isActive = formData.startDate <= today && today <= formData.endDate

    const newCoupon: Coupon = {
      id: coupons.length + 1,
      code: formData.couponCode,
      discountAmount: Number(formData.discountAmount),
      discountType: formData.discountType as "fixed" | "percentage",
      maxUsage: Number(formData.maxUsage),
      currentUsage: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: isActive ? "active" : "inactive",
      createdDate: today,
    }

    setCoupons([newCoupon, ...coupons])
    setSuccessMessage(`Coupon "${formData.couponCode}" created successfully!`)
    setFormData({
      couponCode: "",
      discountAmount: "",
      discountType: "percentage",
      maxUsage: "",
      startDate: "",
      endDate: "",
    })
    setHasChanges(false)

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteCoupon = (id: number) => {
    setCoupons(coupons.filter((c) => c.id !== id))
    setSuccessMessage("Coupon deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleReset = () => {
    setFormData({
      couponCode: "",
      discountAmount: "",
      discountType: "percentage",
      maxUsage: "",
      startDate: "",
      endDate: "",
    })
    setErrors({})
    setHasChanges(false)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setSuccessMessage(`Copied "${code}" to clipboard!`)
    setTimeout(() => setSuccessMessage(""), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/coupons/list" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Coupons
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Create Coupon
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage discount coupons</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coupon Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Tag className="w-5 h-5" />
                  New Coupon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <Input
                    label="Coupon Code"
                    placeholder="e.g., SUMMER20"
                    value={formData.couponCode}
                    onChange={(e) => handleFieldChange("couponCode", e.target.value.toUpperCase())}
                  />
                  {errors.couponCode && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.couponCode}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <label className="text-sm font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => handleFieldChange("discountType", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <Input
                    label={`Discount Amount (${formData.discountType === "percentage" ? "%" : "$"})`}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.discountAmount}
                    onChange={(e) => handleFieldChange("discountAmount", e.target.value)}
                  />
                  {errors.discountAmount && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.discountAmount}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Input
                    label="Max Usage"
                    type="number"
                    placeholder="100"
                    value={formData.maxUsage}
                    onChange={(e) => handleFieldChange("maxUsage", e.target.value)}
                  />
                  {errors.maxUsage && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.maxUsage}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleFieldChange("startDate", e.target.value)}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.startDate}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleFieldChange("endDate", e.target.value)}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.endDate}
                    </p>
                  )}
                </motion.div>

                {/* Unsaved Changes Warning */}
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">Unsaved changes</p>
                  </motion.div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={handleCreateCoupon}
                      className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                    >
                      <Save className="w-4 h-4" />
                      Create Coupon
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coupons List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Tag className="w-5 h-5" />
                  Active Coupons
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {coupons.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <Tag className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No coupons yet. Create one to get started!</p>
                    </motion.div>
                  ) : (
                    coupons.map((coupon, idx) => (
                      <motion.div
                        key={coupon.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded text-sm">
                                {coupon.code}
                              </code>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCopyCode(coupon.code)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                              >
                                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </motion.button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {coupon.discountAmount}
                              {coupon.discountType === "percentage" ? "% off" : " $ off"}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              coupon.status === "active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : coupon.status === "expired"
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            }`}
                          >
                            {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 my-3 text-xs">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Valid Period</p>
                            <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                              {coupon.startDate} to {coupon.endDate}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Usage</p>
                            <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                              {coupon.currentUsage}/{coupon.maxUsage}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Usage Rate</p>
                            <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                              {Math.round((coupon.currentUsage / coupon.maxUsage) * 100)}%
                            </p>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                          <div
                            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
                            style={{ width: `${Math.round((coupon.currentUsage / coupon.maxUsage) * 100)}%` }}
                          />
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded transition text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="flex-1 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}