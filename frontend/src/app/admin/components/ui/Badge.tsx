import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "error" | "info"
  className?: string
}

export function Badge({ children, variant = "info", className }: BadgeProps) {
  const variants = {
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
    info: "bg-blue-500/20 text-blue-400",
  }

  return (
    <span className={cn("inline-block px-2 py-1 rounded text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  )
}
