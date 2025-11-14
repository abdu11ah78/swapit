"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../admin/components/ui/Card"
import { Badge } from "../../admin/components/ui/Badge"
import { Shield, Key, ArrowLeft, Eye, EyeOff, Copy, Trash2, Plus, CheckCircle, Lock, Smartphone, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface ApiKey {
  id: number
  key: string
  name: string
  createdDate: string
  lastUsed: string
  status: "active" | "inactive"
}

export default function AuthenticationPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [showSetup2FA, setShowSetup2FA] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 1,
      key: "pk_live_abcdef123456",
      name: "Production Key",
      createdDate: "2024-01-10",
      lastUsed: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      key: "pk_test_ghijkl789012",
      name: "Test Key",
      createdDate: "2024-01-05",
      lastUsed: "Never",
      status: "inactive",
    },
  ])
  const [visibleKeys, setVisibleKeys] = useState<number[]>([])
  const [copiedKey, setCopiedKey] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")

  const handle2FAToggle = () => {
    if (!is2FAEnabled) {
      setShowSetup2FA(true)
    } else {
      setIs2FAEnabled(false)
      setSuccessMessage("2FA has been disabled")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleEnable2FA = () => {
    setIs2FAEnabled(true)
    setShowSetup2FA(false)
    setSuccessMessage("2FA has been enabled successfully")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const toggleKeyVisibility = (id: number) => {
    setVisibleKeys((prev) => (prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]))
  }

  const handleCopyKey = (id: number, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(id)
    setSuccessMessage("API Key copied to clipboard!")
    setTimeout(() => {
      setCopiedKey(null)
      setSuccessMessage("")
    }, 2000)
  }

  const handleDeleteKey = (id: number) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id))
    setShowDeleteConfirm(null)
    setSuccessMessage("API Key deleted successfully")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleGenerateNewKey = () => {
    if (!newKeyName.trim()) return

    const newKey: ApiKey = {
      id: Math.max(...apiKeys.map((k) => k.id), 0) + 1,
      key: `pk_live_${Math.random().toString(36).substr(2, 12)}`,
      name: newKeyName,
      createdDate: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "active",
    }

    setApiKeys([newKey, ...apiKeys])
    setNewKeyName("")
    setShowNewKeyModal(false)
    setSuccessMessage("New API Key generated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const maskKey = (key: string) => {
    const visible = key.slice(0, 10)
    const masked = "*".repeat(key.length - 14)
    const end = key.slice(-4)
    return `${visible}${masked}${end}`
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
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Authentication & Security
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your security settings and API credentials</p>
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

        {/* Security Overview Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">2FA Status</p>
              {is2FAEnabled && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{is2FAEnabled ? "Enabled" : "Disabled"}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active API Keys</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{apiKeys.filter((k) => k.status === "active").length}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Security Level</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${is2FAEnabled ? "w-full bg-green-500" : "w-1/2 bg-yellow-500"}`} />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{is2FAEnabled ? "High" : "Medium"}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {/* Two-Factor Authentication */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Smartphone className="w-5 h-5" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Current Status:</p>
                    <Badge className={`${is2FAEnabled ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"} px-3 py-1 rounded-full`}>
                      {is2FAEnabled ? "Enabled" : "Not Enabled"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {is2FAEnabled ? "Your account is protected with two-factor authentication." : "Add an extra layer of security to your account."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Benefits:</h4>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      Enhanced account security
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      Prevent unauthorized access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      SMS or authenticator app support
                    </li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handle2FAToggle}
                  className={`w-full px-4 py-2 cursor-pointer rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                    is2FAEnabled
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                      : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Keys */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
                  <Key className="w-5 h-5" />
                  API Keys
                </CardTitle>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewKeyModal(true)}
                  className="p-1.5 cursor-pointer bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {apiKeys.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">No API keys yet</p>
                  ) : (
                    apiKeys.map((key, idx) => (
                      <motion.div
                        key={key.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{key.name}</h4>
                          <Badge className={`${key.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"} px-2 py-0.5 rounded text-xs`}>
                            {key.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded font-mono text-xs">
                          <code className="flex-1 text-gray-900 dark:text-white">{visibleKeys.includes(key.id) ? key.key : maskKey(key.key)}</code>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="p-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                          >
                            {visibleKeys.includes(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopyKey(key.id, key.key)}
                            className="p-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                          >
                            {copiedKey === key.id ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Created: {key.createdDate}
                          </div>
                          <div>Last Used: {key.lastUsed}</div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDeleteConfirm(key.id)}
                            className="flex-1 cursor-pointer px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
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
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
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
                className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete API Key?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone. Any applications using this key will stop working.</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteKey(showDeleteConfirm)}
                    className="flex-1 cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New API Key Modal */}
        <AnimatePresence>
          {showNewKeyModal && (
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
                className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Generate New API Key</h2>
                <input
                  type="text"
                  placeholder="Key name (e.g., Production, Test)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowNewKeyModal(false)
                      setNewKeyName("")
                    }}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateNewKey}
                    disabled={!newKeyName.trim()}
                    className="flex-1 cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2FA Setup Modal */}
        <AnimatePresence>
          {showSetup2FA && (
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
                className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Enable Two-Factor Authentication</h2>
                <div className="space-y-4 mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scan this QR code with your authenticator app:</p>
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto flex items-center justify-center">
                    <p className="text-xs text-gray-500 text-center">QR Code Here</p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Or enter this code manually:</p>
                  <code className="block p-2 bg-gray-100 dark:bg-gray-900 rounded text-center font-mono text-sm text-gray-900 dark:text-white">
                    JBSWY3DPEBLW64TMMQ======
                  </code>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSetup2FA(false)}
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnable2FA}
                    className="flex-1 cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
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