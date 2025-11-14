"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { ArrowLeft, Save, X, CheckCircle, AlertCircle, Eye, Download, Share2, Clock, FileText } from "lucide-react"
import Link from "next/link"

interface PolicyVersion {
  id: number
  version: string
  content: string
  lastUpdated: string
  updatedBy: string
  status: "active" | "archived"
}

const defaultPolicy = `Privacy Policy

Last Updated: January 2024

1. Introduction
We are committed to protecting your privacy and ensuring you have a positive experience on our website and services.

2. Information We Collect
We collect information that you provide directly to us, such as:
- Contact information (name, email, phone)
- Billing and shipping addresses
- Payment information
- Communication preferences

3. How We Use Your Information
We use the information we collect to:
- Process your orders and deliver services
- Send transactional and promotional communications
- Improve our website and services
- Comply with legal obligations

4. Data Security
We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.

5. Your Rights
You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Opt-out of marketing communications

6. Contact Us
If you have questions about this Privacy Policy, please contact us at privacy@example.com`

export default function PrivacyPolicyPage() {
  const [policyContent, setPolicyContent] = useState(defaultPolicy)
  const [policyVersions, setPolicyVersions] = useState<PolicyVersion[]>([
    {
      id: 1,
      version: "1.0",
      content: defaultPolicy,
      lastUpdated: "2024-01-10",
      updatedBy: "Admin",
      status: "active",
    },
    {
      id: 2,
      version: "0.9",
      content: "Previous policy content...",
      lastUpdated: "2024-01-01",
      updatedBy: "Manager",
      status: "archived",
    },
  ])

  const [hasChanges, setHasChanges] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewMode, setPreviewMode] = useState(false)
  const [showVersions, setShowVersions] = useState(false)

  const handleContentChange = (value: string) => {
    setPolicyContent(value)
    setHasChanges(true)
    if (errors.content) {
      setErrors({ ...errors, content: "" })
    }
  }

  const validatePolicy = () => {
    const newErrors: Record<string, string> = {}

    if (!policyContent.trim()) newErrors.content = "Policy content is required"
    if (policyContent.length < 50) newErrors.content = "Policy must be at least 50 characters"

    return newErrors
  }

  const handleSavePolicy = () => {
    const newErrors = validatePolicy()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newVersion: PolicyVersion = {
      id: policyVersions.length + 1,
      version: `${(parseFloat(policyVersions[0]?.version || "0.9") + 0.1).toFixed(1)}`,
      content: policyContent,
      lastUpdated: new Date().toISOString().split("T")[0],
      updatedBy: "Admin",
      status: "active",
    }

    // Archive the previous active version and add new version
    const updatedVersions = policyVersions.map((v) => 
      v.status === "active" ? { ...v, status: "archived" as const } : v
    )
    
    setPolicyVersions([newVersion, ...updatedVersions])
    setSuccessMessage("Privacy Policy updated successfully!")
    setHasChanges(false)

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleReset = () => {
    setPolicyContent(policyVersions.find((v) => v.status === "active")?.content || defaultPolicy)
    setHasChanges(false)
    setErrors({})
  }

  const handleDownloadPolicy = () => {
    const element = document.createElement("a")
    const file = new Blob([policyContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "privacy-policy.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleRestoreVersion = (version: PolicyVersion) => {
    setPolicyContent(version.content)
    setHasChanges(true)
    setShowVersions(false)
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
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and update your privacy policy</p>
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
          {/* Policy Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <FileText className="w-5 h-5" />
                  Privacy Policy Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    <FileText className="w-4 h-4" />
                    Policy Content
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                    rows={15}
                    value={policyContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                  />
                  {errors.content && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{policyContent.length} characters</p>
                </motion.div>

                {/* Unsaved Changes Warning */}
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">You have unsaved changes</p>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadPolicy}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleSavePolicy}
                      className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                    >
                      <Save className="w-4 h-4" />
                      Save Policy
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Current Version Info */}
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Current Version
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {policyVersions.find((v) => v.status === "active") && (
                  <>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Version</p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {policyVersions.find((v) => v.status === "active")?.version}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Last Updated</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {policyVersions.find((v) => v.status === "active")?.lastUpdated}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Updated By</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {policyVersions.find((v) => v.status === "active")?.updatedBy}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="text-sm text-blue-900 dark:text-blue-200">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowVersions(!showVersions)}
                  className="w-full cursor-pointer px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  View Versions
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full cursor-pointer px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Policy
                </motion.button>
              </CardContent>
            </Card>

            {/* Version History */}
            {showVersions && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                    <CardTitle className="text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Version History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-2">
                    {policyVersions.map((version, idx) => (
                      <motion.div
                        key={version.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">v{version.version}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{version.lastUpdated}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              version.status === "active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                            }`}
                          >
                            {version.status.charAt(0).toUpperCase() + version.status.slice(1)}
                          </span>
                        </div>
                        {version.status === "archived" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRestoreVersion(version)}
                            className="w-full cursor-pointer px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition mt-2"
                          >
                            Restore
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Preview Modal */}
        {previewMode && (
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Policy Preview</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreviewMode(false)}
                  className="text-gray-600 cursor-pointer dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white leading-relaxed">
                    {policyContent}
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