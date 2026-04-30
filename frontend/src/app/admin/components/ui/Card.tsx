'use client';

import { motion } from 'framer-motion';
import { cn } from "@/lib/utils" // Assumes cn utility is available
import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  // Added optional delay prop for staggered entrance animation
  delay?: number 
}

/**
 * Main Card Component with Framer Motion effects.
 * Includes a subtle entrance animation and a lifting hover effect.
 */
export function Card({ children, className, delay = 0 }: CardProps) {
  return (
    <motion.div
      // Entrance Animation: Subtle fade up and scale
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: delay, 
        ease: 'easeOut',
        // Ensures only scale/position properties trigger transition
        layout: { type: "spring", stiffness: 300, damping: 30 }
      }}
      // Hover Effect: Lifts the card and applies a significant shadow
      whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)' }}
      
      // Updated Styling: Uses theme variables for consistency
      className={cn(
        "bg-[var(--admin-bg)] rounded-xl shadow-lg p-6",
        "border border-[var(--admin-border)]",
        "transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

/**
 * CardHeader with border separation.
 */
export function CardHeader({ children, className }: CardProps) {
  return <div className={cn("mb-4 pb-4 border-b border-[var(--admin-border)]", className)}>{children}</div>
}

/**
 * CardTitle with bold, dark/light mode text styling.
 */
export function CardTitle({ children, className }: CardProps) {
  return <h2 className={cn("text-xl font-bold text-[var(--admin-text)]", className)}>{children}</h2>
}

/**
 * CardContent for the main body text/elements.
 */
export function CardContent({ children, className }: CardProps) {
  return <div className={cn("text-[var(--admin-text-secondary)]", className)}>{children}</div>
}

/**
 * CardFooter with border separation and flex layout for buttons/actions.
 */
export function CardFooter({ children, className }: CardProps) {
  return <div className={cn("mt-4 pt-4 border-t border-[var(--admin-border)] flex gap-3 items-center", className)}>{children}</div>
}