"use client"

import { Menu, Bell, User, LogOut, Settings, Search, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { adminData } from "../../lib/mockData"


interface NavbarProps {
  onMenuClick: () => void;
  // 🎯 NEW PROP: User data to be passed in
  user: typeof adminData; 
}

// 🎯 Default user data for demonstration/fallback


export function Navbar({ onMenuClick, user = adminData }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications] = useState(3) 
  const [isDark, setIsDark] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(true) 
  const [mounted, setMounted] = useState(false)

  // --- Theme Logic ---
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    const isDarkMode = savedTheme === 'dark'
    setIsDark(isDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')

    if (newIsDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  // -------------------

  // 🎯 Timer used for debouncing hover exit to prevent accidental closing
  let menuCloseTimer: NodeJS.Timeout | null = null;
  
  const handleMouseEnter = () => {
    if (menuCloseTimer) {
      clearTimeout(menuCloseTimer);
      menuCloseTimer = null;
    }
    setShowUserMenu(true);
  };

  const handleMouseLeave = () => {
    // Start a timer to close the menu after a short delay
    menuCloseTimer = setTimeout(() => {
      setShowUserMenu(false);
    }, 150); // 150ms delay
  };

  if (!mounted) return null; 

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-30 h-20 bg-slate-950 border-b border-slate-800 shadow-sm transition-colors duration-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150"
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </motion.button>

          {/* Logo/Brand */}
          <div className="text-xl font-bold text-white hidden sm:block">SwapIt Control Center</div>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search users, items, trades..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border border-slate-800"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 lg:gap-4">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative group">
            <motion.button
              onClick={() => setHasNotifications(false)} 
              className="relative p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={20} />
              {(notifications > 0 || hasNotifications) && ( 
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </motion.button>
            
            {/* Notification Dropdown (Uses group-hover) */}
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-0">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                  <p className="font-medium text-gray-900 dark:text-white">New Offer Received</p>
                  <p className="text-xs mt-1">2 minutes ago</p>
                </div>
                <div className="p-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-t border-gray-100 dark:border-slate-700">
                  <p className="font-medium text-gray-900 dark:text-white">Trade moved to Disputed</p>
                  <p className="text-xs mt-1">1 hour ago</p>
                </div>
                <div className="p-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-t border-gray-100 dark:border-slate-700">
                  <p className="font-medium text-gray-900 dark:text-white">Smart match alerts generated</p>
                  <p className="text-xs mt-1">3 hours ago</p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-slate-700 text-center">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View all notifications
                </a>
              </div>
            </div>
          </div>

          {/* 🎯 User menu - Changed to hover trigger */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter} // Trigger open on hover
            onMouseLeave={handleMouseLeave} // Trigger close on mouse leave (with delay)
            // Optional: for touch devices that still need a click interaction
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <motion.button
              // Removed onClick
              className="flex items-center cursor-pointer gap-3 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150"
              whileTap={{ scale: 0.95 }}
            >
              <div className="hidden sm:flex flex-col items-end">
                {/* 🎯 Dynamic User Data */}
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.title}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center overflow-hidden">
                <Image
                  // 🎯 Dynamic User Data
                  src={user.photoUrl}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    {/* 🎯 Dynamic User Data */}
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                  </div>

                  <div className="py-2">
                    <a
                      href="/admin/users" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <User size={16} />
                      <span>Users</span>
                    </a>
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-t border-gray-100 dark:border-slate-700"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </a>
                  </div>

                  <div className="p-2 border-t border-gray-200 dark:border-slate-700">
                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}