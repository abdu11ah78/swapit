"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { ArrowLeft, Save, X, CheckCircle, AlertCircle, FileText, Mail, Calendar, Download, Eye, Trash2, Send } from "lucide-react"
import Link from "next/link"

interface Invoice {
  id: number
  invoiceNumber: string
  customerName: string
  customerEmail: string
  invoiceDate: string
  dueDate: string
  amount: number
  description: string
  status: "draft" | "sent" | "paid" | "overdue"
  createdDate: string
}

export default function CreateInvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      invoiceNumber: "INV-001",
      customerName: "John Smith",
      customerEmail: "john@example.com",
      invoiceDate: "2024-01-10",
      dueDate: "2024-02-10",
      amount: 2500.0,
      description: "Web design and development services",
      status: "sent",
      createdDate: "2024-01-10",
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 1850.5,
      description: "Consulting and strategy session",
      status: "paid",
      createdDate: "2024-01-15",
    },
  ])

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    amount: "",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required"
    if (!formData.customerEmail.trim()) newErrors.customerEmail = "Customer email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail))
      newErrors.customerEmail = "Invalid email format"
    if (!formData.invoiceDate) newErrors.invoiceDate = "Invoice date is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    if (formData.invoiceDate && formData.dueDate && formData.invoiceDate > formData.dueDate)
      newErrors.dueDate = "Due date must be after invoice date"
    if (!formData.amount) newErrors.amount = "Amount is required"
    if (Number(formData.amount) <= 0) newErrors.amount = "Amount must be greater than 0"
    if (!formData.description.trim()) newErrors.description = "Description is required"

    return newErrors
  }

  const handleCreateInvoice = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newInvoice: Invoice = {
      id: invoices.length + 1,
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      amount: Number(formData.amount),
      description: formData.description,
      status: "draft",
      createdDate: new Date().toISOString().split("T")[0],
    }

    setInvoices([newInvoice, ...invoices])
    setSuccessMessage(`Invoice "${newInvoice.invoiceNumber}" created successfully!`)
    setFormData({
      customerName: "",
      customerEmail: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      amount: "",
      description: "",
    })
    setHasChanges(false)

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteInvoice = (id: number) => {
    setInvoices(invoices.filter((inv) => inv.id !== id))
    setSuccessMessage("Invoice deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleReset = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      amount: "",
      description: "",
    })
    setErrors({})
    setHasChanges(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
      case "sent":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
      case "overdue":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
      default:
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/invoices/list" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Invoices
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Create Invoice
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage customer invoices</p>
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
          {/* Invoice Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <FileText className="w-5 h-5" />
                  New Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <Input
                    label="Customer Name"
                    placeholder="Enter customer name"
                    value={formData.customerName}
                    onChange={(e) => handleFieldChange("customerName", e.target.value)}
                  />
                  {errors.customerName && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.customerName}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Input
                    label="Customer Email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.customerEmail}
                    onChange={(e) => handleFieldChange("customerEmail", e.target.value)}
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.customerEmail}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <Input
                    label="Invoice Date"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => handleFieldChange("invoiceDate", e.target.value)}
                  />
                  {errors.invoiceDate && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.invoiceDate}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Input
                    label="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.dueDate}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleFieldChange("amount", e.target.value)}
                  />
                  {errors.amount && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.amount}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <label className=" text-sm font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    placeholder="Enter invoice details"
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                  />
                  {errors.description && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.description.length}/500</p>
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
                      onClick={handleCreateInvoice}
                      className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                    >
                      <Save className="w-4 h-4" />
                      Create Invoice
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Invoices List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Calendar className="w-5 h-5" />
                  Invoice History
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No invoices yet. Create one to get started!</p>
                    </motion.div>
                  ) : (
                    invoices.map((invoice, idx) => (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.customerName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                              ${invoice.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 my-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400 truncate">{invoice.customerEmail}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400">Due: {invoice.dueDate}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{invoice.description}</p>

                        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex-wrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPreviewInvoice(invoice)}
                            className="flex-1 min-w-[70px] px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded transition text-xs sm:text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">View</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 min-w-[70px] px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded transition text-xs sm:text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 flex items-center justify-center gap-1"
                          >
                            <Send className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Send</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 min-w-[70px] px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded transition text-xs sm:text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/40 flex items-center justify-center gap-1"
                          >
                            <Download className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">PDF</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="flex-1 min-w-[70px] px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Delete</span>
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

        {/* Invoice Preview Modal */}
        {previewInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Preview</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreviewInvoice(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                  {/* Invoice Header */}
                  <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">INVOICE</h1>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{previewInvoice.invoiceNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${previewInvoice.amount.toFixed(2)}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(previewInvoice.status)}`}>
                          {previewInvoice.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Bill To</h3>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{previewInvoice.customerName}</p>
                      <p className="text-gray-600 dark:text-gray-400">{previewInvoice.customerEmail}</p>
                    </div>
                    <div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Invoice Date</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{previewInvoice.invoiceDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{previewInvoice.dueDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Description</h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{previewInvoice.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Thank you for your business!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}