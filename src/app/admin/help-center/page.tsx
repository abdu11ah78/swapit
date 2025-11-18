"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Search, MessageCircle, FileText, ArrowLeft, ChevronRight, Clock, Eye, ThumbsUp, Send, BookOpen, Users, Zap, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  readTime: number
  views: number
}

interface FAQItem {
  id: number
  question: string
  answer: string
  helpful: boolean | null
}

const articles: Article[] = [
  {
    id: 1,
    title: "Getting Started with Your Account",
    excerpt: "Learn how to create and set up your account for the first time.",
    category: "Getting Started",
    readTime: 5,
    views: 1240,
  },
  {
    id: 2,
    title: "Managing Products and Inventory",
    excerpt: "Complete guide to adding, editing, and managing your product catalog.",
    category: "Products",
    readTime: 8,
    views: 856,
  },
  {
    id: 3,
    title: "Understanding Analytics and Reports",
    excerpt: "Learn how to interpret your sales data and business analytics.",
    category: "Analytics",
    readTime: 6,
    views: 742,
  },
  {
    id: 4,
    title: "Payment Methods and Billing",
    excerpt: "Information about accepted payment methods and billing processes.",
    category: "Billing",
    readTime: 5,
    views: 628,
  },
]

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your inbox. You'll be able to set a new password within 24 hours.",
    helpful: null,
  },
  {
    id: 2,
    question: "How long does it take to process orders?",
    answer: "Most orders are processed within 24 hours. During peak times, it may take up to 48 hours. You'll receive a confirmation email once your order is processed.",
    helpful: null,
  },
  {
    id: 3,
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel anytime from your account settings. Your access will remain active until the end of your billing period.",
    helpful: null,
  },
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean | null>>({})
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [showContactModal, setShowContactModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVoteHelpful = (id: number, helpful: boolean) => {
    setHelpfulVotes({ ...helpfulVotes, [id]: helpful })
  }

  const handleContactSubmit = () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      return
    }

    console.log("Contact form submitted:", contactForm)
    setSuccessMessage("Thank you! We'll get back to you soon.")
    setContactForm({ name: "", email: "", subject: "", message: "" })
    setShowContactModal(false)

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Find answers and support resources</p>
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

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => setShowContactModal(true)}
            className="p-6 cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Contact Support</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get in touch with our support team</p>
            <div className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
              Send message <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            className="p-6 cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Documentation</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Read our comprehensive guides</p>
            <div className="mt-3 flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium">
              View guides <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            className="p-6 cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Community Forum</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Connect with other users</p>
            <div className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
              Join forum <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        </motion.div>

        {selectedArticle ? (
          // Article Detail View
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to articles
                </button>
                <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                    {selectedArticle.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedArticle.readTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {selectedArticle.views} views
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{selectedArticle.excerpt}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    This is a comprehensive guide to help you understand {selectedArticle.title.toLowerCase()}. Follow the steps below to get started.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Was this helpful?</p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVoteHelpful(selectedArticle.id, true)}
                      className={`flex-1 cursor-pointer px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                        helpfulVotes[selectedArticle.id] === true
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Yes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVoteHelpful(selectedArticle.id, false)}
                      className={`flex-1 cursor-pointer px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                        helpfulVotes[selectedArticle.id] === false
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      No
                    </motion.button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Articles Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Popular Articles
              </h2>

              {filteredArticles.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No articles found. Try adjusting your search.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArticles.map((article, idx) => (
                    <motion.button
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedArticle(article)}
                      className="p-4 cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition text-left"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {article.readTime} min
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          Read <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* FAQ Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + idx * 0.05 }}
                  >
                    <Card>
                      <motion.button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full cursor-pointer text-left p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 dark:text-white">{faq.question}</p>
                          <motion.div
                            animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </motion.div>
                        </div>
                      </motion.button>

                      <AnimatePresence>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                          >
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 space-y-4">
                              <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>

                              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Was this helpful?</p>
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleVoteHelpful(faq.id, true)}
                                    className={`flex-1 cursor-pointer px-3 py-1 rounded text-xs font-medium transition ${
                                      helpfulVotes[faq.id] === true
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                                  >
                                    Yes
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleVoteHelpful(faq.id, false)}
                                    className={`flex-1 cursor-pointer px-3 py-1 rounded text-xs font-medium transition ${
                                      helpfulVotes[faq.id] === false
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                                  >
                                    No
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Contact Modal */}
        <AnimatePresence>
          {showContactModal && (
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
                className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Support</h2>

                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Your message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactSubmit}
                    className="flex-1 cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}