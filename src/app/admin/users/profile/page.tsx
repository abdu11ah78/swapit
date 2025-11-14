"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, ArrowLeft, CheckCircle, AlertCircle, User, Shield, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Experienced admin managing operations and team.",
  })

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"

    return newErrors
  }

  const handleSaveChanges = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log("Profile updated:", formData)
    setSuccessMessage("Profile updated successfully!")
    setIsEditing(false)
    setHasChanges(false)

    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setHasChanges(false)
    setErrors({})
    setFormData({
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      bio: "Experienced admin managing operations and team.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">User Profile</h1>
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
            <p className="text-green-800 dark:text-green-200">{successMessage}</p>
          </motion.div>
        )}

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden relative group"
                  >
                    <Image
                      src="https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg"
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </motion.button>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-1 mb-4">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Administrator</p>
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{formData.email}</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 }}
                        className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{formData.phone}</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{formData.location}</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.65 }}
                        className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">Joined Jan 2024</span>
                      </motion.div>
                    </div>

                    <motion.div className="mt-6 space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEditing(true)}
                        className="w-full cursor-pointer px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full cursor-pointer px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-medium flex items-center justify-center gap-2 transition border border-red-200 dark:border-red-800"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Profile */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {isEditing ? "Edit Profile Information" : "Profile Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <Input
                          label="First Name"
                          value={formData.firstName}
                          onChange={(e) => handleFieldChange("firstName", e.target.value)}
                        />
                        {errors.firstName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Input
                          label="Last Name"
                          value={formData.lastName}
                          onChange={(e) => handleFieldChange("lastName", e.target.value)}
                        />
                        {errors.lastName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                      />
                      {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Input
                        label="Phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                      />
                      {errors.phone && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <Input
                        label="Location"
                        value={formData.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                      />
                      {errors.location && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.location}</p>}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Bio</label>
                      <textarea
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleFieldChange("bio", e.target.value)}
                      />
                    </motion.div>

                    {hasChanges && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">You have unsaved changes</p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">First Name</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.firstName}</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Last Name</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.lastName}</p>
                      </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.email}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.phone}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Location</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.location}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Bio</p>
                      <p className="text-gray-900 dark:text-white">{formData.bio}</p>
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex gap-3">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      className="flex-1 cursor-pointer px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button onClick={handleSaveChanges} className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    </motion.div>
                  </>
                ) : null}
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}