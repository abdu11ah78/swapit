import type React from "react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function Button({ children, variant = "primary", size = "md", className, ...props }: ButtonProps) {
  const baseStyles = "font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"

  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-foreground hover:bg-accent",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
    ghost: "bg-transparent text-foreground hover:bg-secondary",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
