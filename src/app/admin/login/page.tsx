"use client"

import { useState, useEffect } from "react" // <-- Added useEffect here
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, LogIn, Shield, ArrowRight } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email"
    }

    if (!password.trim()) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    return errors
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setValidationErrors({})

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call with demo credentials
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes - accept demo credentials
      if (email === "admin@example.com" && password === "admin123") {
        // Store token in localStorage (in production, this would be secure)
        localStorage.setItem("adminToken", "demo_token_" + Date.now())
        if (rememberMe) {
          localStorage.setItem("rememberEmail", email)
        }

        // Redirect to admin dashboard
        router.push("/admin")
        return
      }

      // Call your backend login API
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Login failed. Please check your credentials.")
        return
      }

      localStorage.setItem("adminToken", data.token)
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email)
      }

      router.push("/admin")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  // Load remembered email on mount
  // FIX: Changed React.useEffect to just useEffect
  useEffect(() => {
    const remembered = localStorage.getItem("rememberEmail")
    if (remembered) {
      setEmail(remembered)
      setRememberMe(true)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"
          animate={{ y: [0, 100, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"
          animate={{ y: [0, -100, 0], x: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header Background */}
          {/* FIX: Changed bg-gradient-to-r to bg-linear-to-r */}
          <div className="h-2 bg-linear-to-r from-blue-600 to-purple-600" />

          {/* Header Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-8 p-8 pb-4"
          >
            <motion.div
              variants={itemVariants}
             
              className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl mb-4"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </motion.div>

            {/* FIX: Changed bg-gradient-to-r to bg-linear-to-r */}
            <motion.h1 variants={itemVariants} className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-400 mt-2">
              Secure access to your dashboard
            </motion.p>
          </motion.div>

          {/* Error Message */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: error ? 1 : 0, y: error ? 0 : -10 }}>
            {error && (
              <div className="mx-8 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" /> {/* FIX: Changed flex-shrink-0 to shrink-0 */}
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">
            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (validationErrors.email) setValidationErrors({ ...validationErrors, email: "" })
                  }}
                  placeholder="admin@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition ${
                    validationErrors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {validationErrors.email && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (validationErrors.password) setValidationErrors({ ...validationErrors, password: "" })
                  }}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-2.5 border-2 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition ${
                    validationErrors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
              {validationErrors.password && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Remember Me */}
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                Remember my email
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}

                className="w-full mt-2 py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    </motion.div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Demo Credentials Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="border-t border-gray-200 dark:border-gray-700 px-8 py-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Demo Credentials:</p>
              </div>

              <div className="space-y-2 bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Email:</p>
                  <p className="text-sm font-mono text-blue-600 dark:text-blue-400 select-all">admin@example.com</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Password:</p>
                  <p className="text-sm font-mono text-blue-600 dark:text-blue-400 select-all">admin123</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Secured by industry-standard encryption
            </p>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Your credentials are secure and encrypted
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}