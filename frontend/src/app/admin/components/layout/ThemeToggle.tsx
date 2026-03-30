"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg cursor-pointer bg-card hover:bg-secondary text-foreground transition-colors"
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </motion.button>
  )
}
