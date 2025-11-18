"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Send, Mail, CheckCircle, AlertCircle, ArrowLeft, FileText, Users, Zap, Eye, Trash2, Edit2, BarChart3 } from "lucide-react"
import Link from "next/link"

interface Campaign {
  id: number
  name: string
  subject: string
  recipients: string
  content: string
  sentDate?: string
  status: "draft" | "sent" | "scheduled"
  stats?: {
    sent: number
    opened: number
    clicked: number
  }
}

export default function EmailPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "Black Friday Sale",
      subject: "50% Off Everything - Black Friday Sale",
      recipients: "All Customers",
      content: "Get ready for the biggest sale of the year!",
      sentDate: "2024-01-10",
      status: "sent",
      stats: { sent: 5240, opened: 1856, clicked: 312 },
    },
    {
      id: 2,
      name: "New Year Promotion",
      subject: "Start 2024 with Amazing Deals",
      recipients: "Active Customers",
      content: "New year, new deals! Check out our latest offers.",
      sentDate: "2024-01-05",
      status: "sent",
      stats: { sent: 3180, opened: 1045, clicked: 189 },
    },
  ])

  const [formData, setFormData] = useState({
    campaignName: "",
    subjectLine: "",
    recipients: "All Customers",
    emailContent: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.campaignName.trim()) newErrors.campaignName = "Campaign name is required"
    if (!formData.subjectLine.trim()) newErrors.subjectLine = "Subject line is required"
    if (!formData.emailContent.trim()) newErrors.emailContent = "Email content is required"
    if (formData.campaignName.length < 3) newErrors.campaignName = "Campaign name must be at least 3 characters"
    if (formData.subjectLine.length < 5) newErrors.subjectLine = "Subject line must be at least 5 characters"

    return newErrors
  }

  const handleSendCampaign = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newCampaign: Campaign = {
      id: campaigns.length + 1,
      name: formData.campaignName,
      subject: formData.subjectLine,
      recipients: formData.recipients,
      content: formData.emailContent,
      sentDate: new Date().toISOString().split("T")[0],
      status: "sent",
      stats: { sent: Math.floor(Math.random() * 5000) + 1000, opened: 0, clicked: 0 },
    }

    setCampaigns([newCampaign, ...campaigns])
    setSuccessMessage(`Campaign "${formData.campaignName}" sent successfully!`)
    setFormData({
      campaignName: "",
      subjectLine: "",
      recipients: "All Customers",
      emailContent: "",
    })
    setHasChanges(false)

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter((c) => c.id !== id))
    setSuccessMessage("Campaign deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleReset = () => {
    setFormData({
      campaignName: "",
      subjectLine: "",
      recipients: "All Customers",
      emailContent: "",
    })
    setErrors({})
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Email Campaigns
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage email marketing campaigns</p>
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
          {/* Campaign Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Zap className="w-5 h-5" />
                  Create Campaign
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <Input
                    label="Campaign Name"
                    placeholder="e.g., New Year Promotion"
                    value={formData.campaignName}
                    onChange={(e) => handleFieldChange("campaignName", e.target.value)}
                  />
                  {errors.campaignName && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.campaignName}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Input
                    label="Subject Line"
                    placeholder="Enter email subject"
                    value={formData.subjectLine}
                    onChange={(e) => handleFieldChange("subjectLine", e.target.value)}
                  />
                  {errors.subjectLine && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.subjectLine}
                    </p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <label className="text-sm font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Recipients
                  </label>
                  <select
                    value={formData.recipients}
                    onChange={(e) => handleFieldChange("recipients", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Customers</option>
                    <option>Active Customers</option>
                    <option>New Customers</option>
                    <option>VIP Customers</option>
                  </select>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <label className="text-sm font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Email Content
                  </label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={5}
                    placeholder="Enter your email content here..."
                    value={formData.emailContent}
                    onChange={(e) => handleFieldChange("emailContent", e.target.value)}
                  />
                  {errors.emailContent && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.emailContent}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.emailContent.length}/1000</p>
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
                    onClick={() => setShowPreview(true)}
                    disabled={!formData.emailContent.trim()}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset
                  </motion.button>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSendCampaign}
                    className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    Send Campaign
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Campaign History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <BarChart3 className="w-5 h-5" />
                  Campaign History
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {campaigns.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <Mail className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No campaigns yet. Create one to get started!</p>
                    </motion.div>
                  ) : (
                    campaigns.map((campaign, idx) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{campaign.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{campaign.subject}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              campaign.status === "sent"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : campaign.status === "draft"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            }`}
                          >
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 my-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Recipients</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{campaign.recipients}</p>
                          </div>
                          {campaign.stats && (
                            <>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Sent</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{campaign.stats.sent.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Open Rate</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {campaign.stats.sent > 0 ? Math.round((campaign.stats.opened / campaign.stats.sent) * 100) : 0}%
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 cursor-pointer px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded transition text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 cursor-pointer px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded transition text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="flex-1 cursor-pointer px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center gap-1"
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

        {/* Preview Modal */}
        {showPreview && (
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
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between bg-white dark:bg-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Preview</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreview(false)}
                  className="text-gray-600 cursor-pointer dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Campaign</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.campaignName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subject</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.subjectLine}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recipients</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.recipients}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Content</p>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-gray-900 dark:text-white text-sm leading-relaxed">
                    {formData.emailContent}
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