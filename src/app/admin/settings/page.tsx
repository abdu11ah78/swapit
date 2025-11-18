"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card" // Adjusted path for better common practice
import { Input } from "../components/ui/Input" // Adjusted path
import { Button } from "../components/ui/Button" // Adjusted path
import { Bell, Lock, Palette, Save, RotateCcw, CheckCircle, AlertCircle, ArrowLeft, Settings, MapPin, Mail, Phone } from "lucide-react"
import Link from "next/link"

// Define a type for your component props if they are custom and not inferred
// (Skipping for brevity, but a good practice for real-world development)

const settingSections = [
  {
    title: "Notifications",
    icon: Bell,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    styleColor: "#3b82f6", // Added a hardcoded hex color for the border fix
    settings: [
      { label: "Email Notifications", enabled: true },
      { label: "Order Updates", enabled: true },
      { label: "System Alerts", enabled: false },
    ],
  },
  {
    title: "Security",
    icon: Lock,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    styleColor: "#ef4444", // Added a hardcoded hex color for the border fix
    settings: [
      { label: "Two-Factor Authentication", enabled: false },
      { label: "Login Alerts", enabled: true },
      { label: "Session Management", enabled: true },
    ],
  },
  {
    title: "Appearance",
    icon: Palette,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    styleColor: "#a855f7", // Added a hardcoded hex color for the border fix
    settings: [
      { label: "Dark Mode", enabled: true },
      { label: "Compact View", enabled: false },
    ],
  },
]

export default function SettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "My Store",
    storeEmail: "store@example.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Main St, San Francisco, CA 94110",
  })

  const [featureSettings, setFeatureSettings] = useState<Record<string, Record<string, boolean>>>(
    settingSections.reduce(
      (acc, section) => ({
        ...acc,
        [section.title]: section.settings.reduce((settingsAcc, setting) => ({ ...settingsAcc, [setting.label]: setting.enabled }), {}),
      }),
      {}
    )
  )

  const [hasChanges, setHasChanges] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleStoreSettingChange = (field: string, value: string) => {
    setStoreSettings({ ...storeSettings, [field]: value })
    setHasChanges(true)
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleFeatureToggle = (section: string, setting: string) => {
    setFeatureSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [setting]: !(prev[section]?.[setting] || false),
      },
    }))
    setHasChanges(true)
  }

  const validateSettings = () => {
    const newErrors: Record<string, string> = {}

    if (!storeSettings.storeName.trim()) newErrors.storeName = "Store name is required"
    if (!storeSettings.storeEmail.trim()) newErrors.storeEmail = "Store email is required"
    // A simple regex is fine for client-side validation, but a better check is advisable
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeSettings.storeEmail)) newErrors.storeEmail = "Invalid email format"
    if (!storeSettings.storePhone.trim()) newErrors.storePhone = "Store phone is required"
    if (!storeSettings.storeAddress.trim()) newErrors.storeAddress = "Store address is required"

    return newErrors
  }

  const handleSaveSettings = () => {
    const newErrors = validateSettings()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // In a real application, you'd send this data to a server
    console.log("Store Settings:", storeSettings)
    console.log("Feature Settings:", featureSettings)
    setSuccessMessage("All settings saved successfully!")
    setHasChanges(false)

    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handleReset = () => {
    setStoreSettings({
      storeName: "My Store",
      storeEmail: "store@example.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress: "123 Main St, San Francisco, CA 94110",
    })
    setFeatureSettings(
      settingSections.reduce(
        (acc, section) => ({
          ...acc,
          [section.title]: section.settings.reduce((settingsAcc, setting) => ({ ...settingsAcc, [setting.label]: setting.enabled }), {}),
        }),
        {}
      )
    )
    setHasChanges(false)
    setErrors({})
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
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
              <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
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

        {/* Store Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                <AlertCircle className="w-5 h-5" />
                Store Settings
              </CardTitle>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Configure your store information and contact details</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-2"
            >
              {/* Assuming Input is a custom component that accepts a label and spreads props */}
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <Input
                label="Store Name"
                value={storeSettings.storeName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStoreSettingChange("storeName", e.target.value)}
              />
            </motion.div>
            {errors.storeName && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.storeName}</p>}

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <Input
                    label="Store Email"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStoreSettingChange("storeEmail", e.target.value)}
                  />
                </div>
                {errors.storeEmail && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.storeEmail}</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <Input
                    label="Store Phone"
                    type="tel"
                    value={storeSettings.storePhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStoreSettingChange("storePhone", e.target.value)}
                  />
                </div>
                {errors.storePhone && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.storePhone}</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="text-sm font-medium mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Store Address
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  value={storeSettings.storeAddress}
                  onChange={(e) => handleStoreSettingChange("storeAddress", e.target.value)}
                />
                {errors.storeAddress && <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.storeAddress}</p>}
              </motion.div>

              {/* Unsaved Changes Warning */}
              {hasChanges && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">You have unsaved changes</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Settings */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, staggerChildren: 0.1 }}
        >
          {settingSections.map((section, idx) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35 + idx * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                // FIX: Moved style prop from Card to motion.div to resolve TypeScript error 2322
                style={{ borderLeftColor: section.styleColor }} 
                className="h-full border-l-4" // Keep the border classes here
              >
                <Card>
                  <CardHeader className={section.bgColor}>
                    <div className="flex items-center gap-2 mb-1">
                      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: idx * 0.2 }}>
                        <Icon className={`w-5 h-5 ${section.color}`} />
                      </motion.div>
                      <CardTitle className={section.color}>{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    {section.settings.map((setting, settingIdx) => (
                      <motion.div
                        key={setting.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + idx * 0.1 + settingIdx * 0.05 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700"
                      >
                        <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">{setting.label}</label>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <input
                            type="checkbox"
                            checked={featureSettings[section.title]?.[setting.label] || false}
                            onChange={() => handleFeatureToggle(section.title, setting.label)}
                            className={`w-5 h-5 rounded cursor-pointer transition ${section.color.includes("blue") ? "accent-blue-600 dark:accent-blue-400" : section.color.includes("red") ? "accent-red-600 dark:accent-red-400" : "accent-purple-600 dark:accent-purple-400"}`}
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex gap-4 justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            disabled={!hasChanges}
            className="px-8 py-3 cursor-pointer border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSaveSettings}
              className="px-8 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              Save All Settings
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}