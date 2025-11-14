"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Plus, Edit2, Trash2, ArrowLeft, Save, X, CheckCircle, AlertCircle, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"

const initialRoles = [
  { id: 1, name: "Administrator", permissions: "All permissions", description: "Full system access with all capabilities", users: 2, color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-900/20", borderColor: "border-red-200 dark:border-red-800" },
  { id: 2, name: "Seller", permissions: "Manage products and orders", description: "Can manage products, view orders, and track sales", users: 5, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/20", borderColor: "border-blue-200 dark:border-blue-800" },
  { id: 3, name: "Customer", permissions: "View products and place orders", description: "Can browse products and make purchases", users: 892, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", borderColor: "border-green-200 dark:border-green-800" },
]

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles)
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({ name: "", permissions: "", description: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAddRole = () => {
    setIsAddingRole(true)
    setFormData({ name: "", permissions: "", description: "" })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Role name is required"
    if (!formData.permissions.trim()) newErrors.permissions = "Permissions are required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    return newErrors
  }

  const handleSaveRole = () => {
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (editingId) {
      setRoles(roles.map((r) => (r.id === editingId ? { ...r, ...formData } : r)))
      setSuccessMessage("Role updated successfully!")
    } else {
      const newRole = {
        id: Math.max(...roles.map((r) => r.id), 0) + 1,
        ...formData,
        users: 0,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        borderColor: "border-purple-200 dark:border-purple-800",
      }
      setRoles([...roles, newRole])
      setSuccessMessage("Role created successfully!")
    }

    setTimeout(() => setSuccessMessage(""), 3000)
    setIsAddingRole(false)
    setEditingId(null)
    setFormData({ name: "", permissions: "", description: "" })
  }

  const handleEditRole = (role: (typeof roles)[0]) => {
    setEditingId(role.id)
    setFormData({ name: role.name, permissions: role.permissions, description: role.description })
    setIsAddingRole(true)
    setErrors({})
  }

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id))
    setDeleteConfirm(null)
    setSuccessMessage("Role deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleCancel = () => {
    setIsAddingRole(false)
    setEditingId(null)
    setFormData({ name: "", permissions: "", description: "" })
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                User Roles
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and configure user roles</p>
            </div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddRole}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Add Role
            </motion.button>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
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
        </AnimatePresence>

        {/* Add/Edit Role Modal */}
        <AnimatePresence>
          {isAddingRole && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {editingId ? "Edit Role" : "Create New Role"}
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <Input
                      label="Role Name"
                      placeholder="e.g., Moderator"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (errors.name) setErrors({ ...errors, name: "" })
                      }}
                    />
                    {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Input
                      label="Permissions"
                      placeholder="e.g., View reports, manage users"
                      value={formData.permissions}
                      onChange={(e) => {
                        setFormData({ ...formData, permissions: e.target.value })
                        if (errors.permissions) setErrors({ ...errors, permissions: "" })
                      }}
                    />
                    {errors.permissions && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.permissions}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Description</label>
                    <textarea
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Describe this role's purpose"
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value })
                        if (errors.description) setErrors({ ...errors, description: "" })
                      }}
                    />
                    {errors.description && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description}</p>}
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={handleSaveRole}
                      className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {editingId ? "Update Role" : "Create Role"}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Delete Role</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Are you sure you want to delete this role? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteRole(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roles Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <AnimatePresence mode="popLayout">
            {roles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card className={`h-full border-l-4 ${role.borderColor}`}>
                  <CardHeader className={role.bgColor}>
                    <CardTitle className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${role.color}`}>{role.name}</h3>
                      </div>
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`text-xs font-bold ${role.color} px-3 py-1 rounded-full whitespace-nowrap`}
                      >
                        {role.users} users
                      </motion.span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Permissions</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{role.permissions}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{role.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditRole(role)}
                      className="flex-1 p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirm(role.id)}
                      className="flex-1 p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition flex items-center justify-center gap-2 border border-red-200 dark:border-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </motion.button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {roles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No roles created yet</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddRole}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 mx-auto transition"
            >
              <Plus className="w-4 h-4" />
              Create First Role
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}