"use client"

import { useQuery } from "@tanstack/react-query"
import { getMaintenanceStatus } from "@/features/admin/admin.api"
import { AlertTriangle } from "lucide-react"

export function MaintenanceBanner() {
  const { data: isMaintenance } = useQuery({
    queryKey: ["admin", "maintenance"],
    queryFn: getMaintenanceStatus,
    refetchInterval: 10000 // Check every 10s
  })

  if (!isMaintenance) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white py-3 px-4 flex items-center justify-center gap-3 shadow-2xl">
      <AlertTriangle className="animate-pulse" size={20} />
      <p className="text-sm font-black uppercase tracking-widest">
        System Under Maintenance - Public access is currently restricted
      </p>
    </div>
  )
}
