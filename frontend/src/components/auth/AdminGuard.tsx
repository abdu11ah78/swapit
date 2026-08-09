"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext"
import { motion } from "framer-motion"
import { ShieldAlert, Loader2 } from "lucide-react"

interface Props {
  children: React.ReactNode
}

export function AdminGuard({ children }: Props) {
  const { isLoggedIn, currentUser } = useAppContext()
  const router = useRouter()
  const [isChecking, setIsChecking] = React.useState(true)

  useEffect(() => {
    // Small delay to allow AppContext to hydrate from sessionStorage
    const timer = setTimeout(() => {
      setIsChecking(false)
      if (!isLoggedIn || currentUser?.role?.toUpperCase() !== "ADMIN") {
        router.push("/")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isLoggedIn, currentUser, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--admin-primary)] animate-spin mx-auto mb-4" />
          <p className="text-xs font-black text-[var(--admin-text-muted)] uppercase tracking-widest">Verifying Authorization...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || currentUser?.role?.toUpperCase() !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[var(--admin-surface)] rounded-[2.5rem] p-10 text-center shadow-2xl border border-[var(--admin-border)]"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-[var(--admin-text)] uppercase tracking-tighter mb-4">Access Denied</h1>
          <p className="text-[var(--admin-text-muted)] font-medium mb-10 leading-relaxed">
            This area is restricted to administrative nodes. Your current clearance is insufficient.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="admin-button-primary w-full py-5"
          >
            Return to Marketplace
          </button>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
