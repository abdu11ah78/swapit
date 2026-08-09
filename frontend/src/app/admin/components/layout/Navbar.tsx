"use client"

import { Menu, Bell, User, LogOut, Settings, Search, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "../../context/ThemeContext"
import { useAppContext } from "@/context/AppContext"
import { useAdminDisputes } from "@/features/admin/admin.hooks"

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { currentUser, logout } = useAppContext()
  const router = useRouter()
  const isDark = theme === "dark"
  const [mounted, setMounted] = useState(false)

  // Fetch disputes as dynamic notifications (open disputes count)
  const { data: disputes } = useAdminDisputes()
  const openDisputes = disputes?.filter(d => d.status === "Open") || []
  const hasNotifications = openDisputes.length > 0

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (!mounted) return null; 

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-30 h-20 bg-[var(--admin-navbar)] border-b border-[var(--admin-border)] shadow-sm transition-colors duration-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2 cursor-pointer hover:bg-[var(--admin-surface)] rounded-lg transition-colors duration-150"
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} className="text-[var(--admin-text)]" />
          </motion.button>

          {/* Logo/Brand */}
          <div className="text-xl font-bold text-[var(--admin-text)] hidden sm:block">
            Swap<span className="text-[var(--admin-primary)]">It</span> Control Center
          </div>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="w-full relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)] group-focus-within:text-[var(--admin-primary)] transition-colors" />
            <input
              type="text"
              placeholder="Search users, items, trades..."
              className="admin-input admin-search-input"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 lg:gap-4">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 cursor-pointer hover:bg-[var(--admin-surface)] rounded-lg transition-colors duration-150 text-[var(--admin-text)]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative group">
            <motion.button
              className="relative p-2 cursor-pointer hover:bg-[var(--admin-surface)] rounded-lg transition-colors duration-150 text-[var(--admin-text)]"
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={20} />
              {hasNotifications && ( 
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </motion.button>
            
            {/* Notification Dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-[var(--admin-surface)] rounded-xl shadow-xl border border-[var(--admin-border)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
              <div className="p-4 border-b border-[var(--admin-border)] flex justify-between items-center">
                <h3 className="font-bold text-[var(--admin-text)] text-sm">Notifications</h3>
                <span className="text-[10px] font-black uppercase text-[var(--admin-primary)]">{openDisputes.length} New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {openDisputes.length > 0 ? (
                  openDisputes.map((d) => (
                    <div key={d.id} className="p-4 text-sm border-b border-[var(--admin-border)] hover:bg-[var(--admin-bg)] cursor-pointer transition-colors last:border-0">
                      <p className="font-bold text-[var(--admin-text)] text-xs">New Dispute Opened</p>
                      <p className="text-[var(--admin-text-muted)] text-[11px] mt-1 line-clamp-1">{d.reason}</p>
                      <p className="text-[10px] mt-2 font-mono text-[var(--admin-primary)] uppercase">{d.createdAt}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell size={24} className="mx-auto text-[var(--admin-text-muted)] opacity-20" />
                    <p className="text-xs text-[var(--admin-text-muted)] mt-2 font-medium">All clear! No new alerts.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center cursor-pointer gap-3 p-1.5 hover:bg-[var(--admin-surface)] rounded-lg transition-colors duration-150"
              whileTap={{ scale: 0.95 }}
            >
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-bold text-[var(--admin-text)] leading-none">{currentUser?.name || "Admin"}</p>
                <p className="text-[10px] font-black text-[var(--admin-primary)] uppercase mt-1 tracking-wider">{currentUser?.role || "Manager"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--admin-primary)] flex items-center justify-center overflow-hidden border-2 border-[var(--admin-primary)]/20 shadow-sm">
                <img
                  src={currentUser?.image || `https://ui-avatars.com/api/?name=${currentUser?.name || 'Admin'}&background=98A31D&color=fff`}
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    className="absolute right-0 mt-3 w-64 bg-[var(--admin-surface)] rounded-xl shadow-2xl border border-[var(--admin-border)] overflow-hidden z-10"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  >
                    <div className="p-5 bg-gradient-to-br from-[var(--admin-primary)]/10 to-transparent border-b border-[var(--admin-border)]">
                      <p className="font-black text-[var(--admin-text)] text-sm">{currentUser?.name || "Admin"}</p>
                      <p className="text-xs text-[var(--admin-text-muted)] mt-1 font-medium">{currentUser?.email || "admin@swapit.com"}</p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => { router.push("/admin/settings"); setShowUserMenu(false); }}
                        className="flex items-center gap-3 w-full px-5 py-3 text-sm font-bold text-[var(--admin-text)] hover:bg-[var(--admin-primary)]/5 hover:text-[var(--admin-primary)] transition-all"
                      >
                        <Settings size={18} />
                        <span>Profile Settings</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-[var(--admin-border)] bg-[var(--admin-bg)]/50">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-3 text-sm font-black text-red-500 hover:bg-red-500/10 rounded-lg transition-all group"
                      >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Logout Account</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}