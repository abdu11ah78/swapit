"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { ArrowLeft, Save, RotateCcw, CheckCircle, AlertCircle, Shield, Users, ShoppingCart, Package, Zap, Check } from "lucide-react"
import Link from "next/link"

const permissions = [
  {
    category: "Products",
    description: "Manage product catalog and inventory",
    icon: Package,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    items: [
      { id: 1, name: "View Products", description: "Access product listings and details", roles: ["admin", "seller", "customer"] },
      { id: 2, name: "Create Product", description: "Add new products to catalog", roles: ["admin", "seller"] },
      { id: 3, name: "Edit Product", description: "Modify existing product information", roles: ["admin", "seller"] },
      { id: 4, name: "Delete Product", description: "Remove products from catalog", roles: ["admin"] },
    ],
  },
  {
    category: "Orders",
    description: "Handle order management and processing",
    icon: ShoppingCart,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    items: [
      { id: 5, name: "View Orders", description: "Access order information and history", roles: ["admin", "seller"] },
      { id: 6, name: "Process Orders", description: "Update order status and fulfillment", roles: ["admin"] },
      { id: 7, name: "Cancel Orders", description: "Cancel and refund orders", roles: ["admin"] },
    ],
  },
  {
    category: "Users",
    description: "Manage users and system access",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    items: [
      { id: 8, name: "Manage Users", description: "Create, edit, and delete user accounts", roles: ["admin"] },
      { id: 9, name: "View Reports", description: "Access analytics and business reports", roles: ["admin", "seller"] },
    ],
  },
]

const roles = [
  { name: "Admin", value: "admin", color: "bg-red-50 dark:bg-red-900/20", borderColor: "border-red-200 dark:border-red-800", textColor: "text-red-700 dark:text-red-300", checkboxColor: "accent-red-600 dark:accent-red-400" },
  { name: "Seller", value: "seller", color: "bg-blue-50 dark:bg-blue-900/20", borderColor: "border-blue-200 dark:border-blue-800", textColor: "text-blue-700 dark:text-blue-300", checkboxColor: "accent-blue-600 dark:accent-blue-400" },
  { name: "Customer", value: "customer", color: "bg-green-50 dark:bg-green-900/20", borderColor: "border-green-200 dark:border-green-800", textColor: "text-green-700 dark:text-green-300", checkboxColor: "accent-green-600 dark:accent-green-400" },
]

export default function PermissionsPage() {
  const [permissionsState, setPermissionsState] = useState(permissions)
  const [hasChanges, setHasChanges] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePermissionChange = (categoryIndex: number, itemId: number, role: string) => {
    const newPermissions = [...permissionsState]
    const item = newPermissions[categoryIndex].items.find((i) => i.id === itemId)

    if (item) {
      if (item.roles.includes(role)) {
        item.roles = item.roles.filter((r) => r !== role)
      } else {
        item.roles = [...item.roles, role]
      }
      setPermissionsState(newPermissions)
      setHasChanges(true)
    }
  }

  const handleSelectAll = (categoryIndex: number, role: string) => {
    const newPermissions = [...permissionsState]
    const allHaveRole = newPermissions[categoryIndex].items.every((item) => item.roles.includes(role))

    newPermissions[categoryIndex].items.forEach((item) => {
      if (allHaveRole) {
        item.roles = item.roles.filter((r) => r !== role)
      } else {
        if (!item.roles.includes(role)) {
          item.roles = [...item.roles, role]
        }
      }
    })

    setPermissionsState(newPermissions)
    setHasChanges(true)
  }

  const handleSavePermissions = () => {
    const newErrors: Record<string, string> = {}

    // Validate at least one role has access to each permission
    permissionsState.forEach((category, categoryIndex) => {
      category.items.forEach((item) => {
        if (item.roles.length === 0) {
          newErrors[`${categoryIndex}-${item.id}`] = "At least one role must have access"
        }
      })
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log("Permissions saved:", permissionsState)
    setSuccessMessage("Permissions updated successfully!")
    setHasChanges(false)

    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handleReset = () => {
    setPermissionsState(permissions)
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Permissions Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configure role-based access control for your platform</p>
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

        {/* Unsaved Changes Warning */}
        {hasChanges && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-800 dark:text-yellow-200">You have unsaved changes</p>
          </motion.div>
        )}

        {/* Role Legend */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role, idx) => (
            <motion.div
              key={role.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`${role.color} border ${role.borderColor} rounded-lg p-4 cursor-pointer`}
            >
              <Shield className={`w-6 h-6 mb-2 ${role.textColor}`} />
              <h3 className={`font-semibold ${role.textColor}`}>{role.name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {role.name === "Admin" && "Full system access with all permissions"}
                {role.name === "Seller" && "Can manage products and view orders"}
                {role.name === "Customer" && "Limited access for browsing and shopping"}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Permissions Sections */}
        <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {permissionsState.map((section, categoryIndex) => {
            const IconComponent = section.icon
            return (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: categoryIndex * 0.15 }}
                className={`border-l-4 rounded-lg ${
                  section.category === "Products"
                    ? "border-l-purple-600"
                    : section.category === "Orders"
                      ? "border-l-blue-600"
                      : "border-l-green-600"
                }`}
              >
                <Card className="overflow-hidden rounded-l-none">
                  <CardHeader className={`${section.bgColor}`}>
                    <motion.div
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      transition={{ delay: categoryIndex * 0.15 + 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: categoryIndex * 0.2 }}
                        >
                          <IconComponent className={`w-6 h-6 ${section.color}`} />
                        </motion.div>
                        <CardTitle className={section.color}>{section.category}</CardTitle>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Category Select All Row */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: categoryIndex * 0.15 + 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700"
                      >
                        <div className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          Permission
                        </div>
                        <div className="flex gap-4">
                          {roles.map((role) => (
                            <motion.label
                              key={`${section.category}-all-${role.value}`}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <motion.input
                                type="checkbox"
                                checked={section.items.every((item) => item.roles.includes(role.value))}
                                onChange={() => handleSelectAll(categoryIndex, role.value)}
                                className={`w-4 h-4 rounded ${role.checkboxColor} cursor-pointer`}
                              />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{role.name}</span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>

                      {/* Permission Items */}
                      {section.items.map((item, itemIdx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: categoryIndex * 0.15 + itemIdx * 0.08 }}
                          whileHover={{ x: 5, transition: { duration: 0.2 } }}
                          className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: item.roles.length > 0 ? 360 : 0 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Check className={`w-4 h-4 ${item.roles.length > 0 ? "text-green-500" : "text-gray-300"}`} />
                              </motion.div>
                              {item.name}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                          </div>
                          <div className="flex gap-4">
                            {roles.map((role, roleIdx) => (
                              <motion.label
                                key={`${item.id}-${role.value}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: categoryIndex * 0.15 + itemIdx * 0.08 + roleIdx * 0.05 }}
                                whileHover={{ scale: 1.1 }}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <motion.input
                                  type="checkbox"
                                  checked={item.roles.includes(role.value)}
                                  onChange={() => handlePermissionChange(categoryIndex, item.id, role.value)}
                                  className={`w-4 h-4 rounded ${role.checkboxColor} cursor-pointer`}
                                  whileHover={{ scale: 1.2 }}
                                />
                              </motion.label>
                            ))}
                            {errors[`${categoryIndex}-${item.id}`] && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 dark:text-red-400 text-xs col-span-4"
                              >
                                {errors[`${categoryIndex}-${item.id}`]}
                              </motion.span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Action Buttons */}
        <CardFooter className="flex gap-4 justify-end">
          <motion.button
            onClick={handleReset}
            disabled={!hasChanges}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={hasChanges ? { scale: 1.05, x: -5 } : {}}
            whileTap={hasChanges ? { scale: 0.95 } : {}}
            className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <motion.div animate={hasChanges ? { rotate: [0, 360] } : { rotate: 0 }} transition={{ duration: 0.5, repeat: hasChanges ? Infinity : 0, repeatDelay: 2 }}>
              <RotateCcw className="w-4 h-4" />
            </motion.div>
            Reset
          </motion.button>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={hasChanges ? { scale: 1.05, x: 5 } : {}}
            whileTap={hasChanges ? { scale: 0.95 } : {}}
          >
            <Button
              onClick={handleSavePermissions}
              disabled={!hasChanges}
              className="px-8 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <motion.div animate={hasChanges ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 0.5, repeat: hasChanges ? Infinity : 0, repeatDelay: 2 }}>
                <Save className="w-4 h-4" />
              </motion.div>
              Save Permissions
            </Button>
          </motion.div>
        </CardFooter>
      </div>
    </div>
  )
}