"use client"

import { useQuery } from "@tanstack/react-query"
import { getMaintenanceStatus } from "@/features/admin/admin.api"
import { AlertTriangle, Hammer, ShieldAlert } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export function MaintenanceOverlay() {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith("/admin")

  const { data: isMaintenance } = useQuery({
    queryKey: ["admin", "maintenance"],
    queryFn: getMaintenanceStatus,
    refetchInterval: 10000 
  })

  if (isAdminPath) return null

  return (
    <AnimatePresence>
      {isMaintenance && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="max-w-md space-y-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
              <div className="relative p-8 bg-red-50 rounded-full border-4 border-white shadow-xl">
                <Hammer size={64} className="text-red-600 animate-bounce-slow" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                System Under <span className="text-red-600">Maintenance</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                We&apos;re currently upgrading our barter protocol to bring you a smoother exchange experience.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 text-left">
                <ShieldAlert className="text-orange-500 shrink-0" size={24} />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-loose">
                  Your assets and trade history are securely encrypted and protected during this window.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-8">
                <AlertTriangle size={12} />
                <span>ETA: Under 2 Hours</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
