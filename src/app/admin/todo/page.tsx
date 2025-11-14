"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"

import { Plus, Trash2, CheckCircle2, Circle, ArrowLeft, Search,  Zap, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Todo {
  id: number
  title: string
  completed: boolean
  createdDate: string
  priority: "low" | "medium" | "high"
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: "Review pending orders", completed: false, createdDate: "2024-01-10", priority: "high" },
    { id: 2, title: "Update inventory", completed: true, createdDate: "2024-01-09", priority: "medium" },
    { id: 3, title: "Send invoices to clients", completed: false, createdDate: "2024-01-10", priority: "high" },
    { id: 4, title: "Prepare monthly report", completed: false, createdDate: "2024-01-08", priority: "medium" },
  ])

  const [newTodo, setNewTodo] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterStatus === "all" || (filterStatus === "active" && !todo.completed) || (filterStatus === "completed" && todo.completed)
    return matchesSearch && matchesFilter
  })

  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.filter((t) => !t.completed).length

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const handleAddTodo = () => {
    if (!newTodo.trim()) {
      setErrors({ title: "Task title is required" })
      return
    }

    if (newTodo.length < 3) {
      setErrors({ title: "Task title must be at least 3 characters" })
      return
    }

    const newTask: Todo = {
      id: Math.max(...todos.map((t) => t.id), 0) + 1,
      title: newTodo,
      completed: false,
      createdDate: new Date().toISOString().split("T")[0],
      priority: "medium",
    }

    setTodos([newTask, ...todos])
    setNewTodo("")
    setErrors({})
    setSuccessMessage("Task added successfully!")

    setTimeout(() => setSuccessMessage(""), 2000)
  }

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id))
    setSuccessMessage("Task deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
      default:
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Todo List
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your tasks and stay productive</p>
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                <Zap className="w-5 h-5" />
                My Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Add Task Section */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Add a new task..."
                      value={newTodo}
                      onChange={(e) => {
                        setNewTodo(e.target.value)
                        if (errors.title) setErrors({})
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    {errors.title && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.title}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTodo}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Task</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-4"
              >
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{todos.length}</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Active</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{activeCount}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{completedCount}</p>
                </div>
              </motion.div>

              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "active", "completed"] as const).map((status) => (
                    <motion.button
                      key={status}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        filterStatus === status
                          ? "bg-blue-600 dark:bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Tasks List */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3">
                {filteredTodos.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <Zap className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchQuery || filterStatus !== "all" ? "No tasks found" : "No tasks yet. Add one to get started!"}
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.map((todo, idx) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: 10, x: -20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 p-4 rounded-lg transition group ${
                          todo.completed
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleTodo(todo.id)}
                          className="shrink-0 transition"
                        >
                          {todo.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500 hover:text-blue-500" />
                          )}
                        </motion.button>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              todo.completed
                                ? "text-gray-500 dark:text-gray-400 line-through"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {todo.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{todo.createdDate}</p>
                        </div>

                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getPriorityColor(todo.priority)}`}>
                          {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>

              {/* Progress Bar */}
              {todos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Progress</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {Math.round((completedCount / todos.length) * 100)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedCount / todos.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-linear-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}