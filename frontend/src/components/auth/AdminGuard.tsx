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
      if (!isLoggedIn || currentUser?.role !== "Admin") {
        router.push("/")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isLoggedIn, currentUser, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#115e59] animate-spin mx-auto mb-4" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verifying Authorization...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || currentUser?.role !== "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] p-10 text-center shadow-2xl shadow-[#115e59]/5 border border-slate-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-[#115e59] uppercase tracking-tighter mb-4">Access Denied</h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            This area is restricted to administrative nodes. Your current clearance is insufficient.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full py-5 bg-[#115e59] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#134e4a] transition-all shadow-xl shadow-[#115e59]/20"
          >
            Return to Marketplace
          </button>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
