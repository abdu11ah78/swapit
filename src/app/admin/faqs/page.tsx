"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card,  CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Plus, ChevronDown, ArrowLeft, Save, X, CheckCircle, AlertCircle, Search, HelpCircle, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  createdDate: string
}

const initialFaqs: FAQ[] = [
  {
    id: 1,
    question: "How do I create a product?",
    answer: "Go to Products > Create and fill in the details including product name, description, price, and inventory. You can also add images and set up different variants if needed.",
    category: "Products",
    createdDate: "2024-01-10",
  },
  {
    id: 2,
    question: "How can I manage inventory?",
    answer: "Use the Inventory section to track and update stock levels. You can set low stock alerts and automatically reorder when inventory falls below a certain threshold.",
    category: "Inventory",
    createdDate: "2024-01-09",
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers. You can configure payment methods in Settings > Payment Methods.",
    category: "Payments",
    createdDate: "2024-01-08",
  },
  {
    id: 4,
    question: "How do I create and manage coupons?",
    answer: "Navigate to Coupons section, click Create Coupon, and set the discount type (percentage or fixed amount), usage limits, and validity period. You can view analytics for each coupon.",
    category: "Marketing",
    createdDate: "2024-01-07",
  },
  {
    id: 5,
    question: "How can I send email campaigns?",
    answer: "Go to Email Campaigns, create a new campaign with a name and subject line, select your recipient list, write the content, and schedule or send immediately.",
    category: "Marketing",
    createdDate: "2024-01-06",
  },
  {
    id: 6,
    question: "What is the refund policy?",
    answer: "We offer a 30-day money-back guarantee on all products. Refunds are processed within 5-7 business days. Please contact our support team for refund requests.",
    category: "Orders",
    createdDate: "2024-01-05",
  },
  {
    id: 7,
    question: "How do I track orders?",
    answer: "You can track orders from the Orders dashboard. Click on any order to view status, shipping details, and estimated delivery date.",
    category: "Orders",
    createdDate: "2024-01-04",
  },
  {
    id: 8,
    question: "How do I backup my data?",
    answer: "Automatic backups are created daily and stored securely. You can also manually export your data from Settings > Data Export.",
    category: "Security",
    createdDate: "2024-01-03",
  },
]

const categories = ["All", "Products", "Inventory", "Payments", "Marketing", "Orders", "Security"]

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAddingFaq, setIsAddingFaq] = useState(false)
  const [formData, setFormData] = useState({ question: "", answer: "", category: "Products" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.question.trim()) newErrors.question = "Question is required"
    if (!formData.answer.trim()) newErrors.answer = "Answer is required"
    if (formData.question.length < 5) newErrors.question = "Question must be at least 5 characters"
    if (formData.answer.length < 20) newErrors.answer = "Answer must be at least 20 characters"

    return newErrors
  }

  const handleAddFaq = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newFaq: FAQ = {
      id: Math.max(...faqs.map((f) => f.id), 0) + 1,
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      createdDate: new Date().toISOString().split("T")[0],
    }

    setFaqs([newFaq, ...faqs])
    setFormData({ question: "", answer: "", category: "Products" })
    setErrors({})
    setIsAddingFaq(false)
    setSuccessMessage("FAQ added successfully!")

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteFaq = (id: number) => {
    setFaqs(faqs.filter((f) => f.id !== id))
    setSuccessMessage("FAQ deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              FAQs
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingFaq(true)}
              className="px-6 py-2 cursor-pointer bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Add FAQ
            </motion.button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage frequently asked questions</p>
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

        {/* Add FAQ Modal */}
        <AnimatePresence>
          {isAddingFaq && (
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
                className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add FAQ</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsAddingFaq(false)
                      setFormData({ question: "", answer: "", category: "Products" })
                      setErrors({})
                    }}
                    className="text-gray-600 cursor-pointer dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    ✕
                  </motion.button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <Input
                      label="Question"
                      placeholder="Enter FAQ question"
                      value={formData.question}
                      onChange={(e) => {
                        setFormData({ ...formData, question: e.target.value })
                        if (errors.question) setErrors({ ...errors, question: "" })
                      }}
                    />
                    {errors.question && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.question}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Answer</label>
                    <textarea
                      placeholder="Enter FAQ answer"
                      value={formData.answer}
                      onChange={(e) => {
                        setFormData({ ...formData, answer: e.target.value })
                        if (errors.answer) setErrors({ ...errors, answer: "" })
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                    />
                    {errors.answer && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.answer}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsAddingFaq(false)
                        setFormData({ question: "", answer: "", category: "Products" })
                        setErrors({})
                      }}
                      className="flex-1 px-4 py-2  cursor-pointer border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddFaq}
                      className="flex-1 px-4 py-2 cursor-pointer bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                    >
                      <Save className="w-4 h-4" />
                      Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* FAQs List */}
        <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {filteredFaqs.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No FAQs found. Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredFaqs.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="group">
                    <motion.button
                      onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                      onHoverStart={() => setExpanded(faq.id)}
                      onHoverEnd={() => (expanded === faq.id ? setExpanded(faq.id) : setExpanded(null))}
                      className="w-full cursor-pointer"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-gray-900 dark:text-white">{faq.question}</p>
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                              {faq.category}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: expanded === faq.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0 mt-1"
                          >
                            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </motion.div>
                        </div>
                      </CardContent>
                    </motion.button>

                    <AnimatePresence>
                      {expanded === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 space-y-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 cursor-pointer px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-1"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="flex-1 cursor-pointer px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  )
}