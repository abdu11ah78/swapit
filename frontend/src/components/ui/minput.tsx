/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import { motion } from "framer-motion"

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

function Input({ 
  className, 
  type, 
  ...props 
}: React.ComponentProps<"input">) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setHasValue(!!e.target.value)
    props.onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value)
    props.onChange?.(e)
  }

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <input
        type={type}
        data-slot="input"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className={cn(
          "file:text-foreground placeholder:text-gray-600/40 selection:bg-gray-700 selection:text-white",
          "h-11 w-full min-w-0 rounded-2xl border-2 bg-white/50 px-4 py-2.5 text-base font-medium shadow-md transition-all duration-300 outline-none",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "border-white/30 hover:border-white/50 hover:bg-white/60 hover:shadow-lg",
          "focus-visible:border-gray-600/50 focus-visible:ring-4 focus-visible:ring-gray-500/30 focus-visible:bg-white/80 focus-visible:shadow-xl",
          "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
          "backdrop-blur-sm text-gray-900 placeholder-gray-500/50",
          className
        )}
        {...props}
      />

      {/* Animated Glow Underline */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isFocused ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ originX: 0.5 }}
      />

      {/* Ambient Glow on Focus */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-600/0 via-gray-600/10 to-gray-600/0 pointer-events-none"
        animate={isFocused ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export { Input }