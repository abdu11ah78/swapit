"use client"

import type React from "react"

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  Tag,
  Star, 
  MessageSquare, 
  Mail, 
  Calendar, 
  CheckSquare, 
  HelpCircle, 
  Lock, 
  ChevronDown,
  X,
  Store, // Assuming 'Store' icon is a good placeholder for a logo
} from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { cn } from "@/lib/utils" 

// --- Type Definitions and Menu Data (UNCHANGED) ---
// ... (All types, interfaces, and adminRoutes remain here)

type IconType = React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  color?: string;
  size?: string | number;
  strokeWidth?: string | number;
  absoluteStrokeWidth?: boolean;
} & React.RefAttributes<SVGSVGElement>>;

interface SubMenuItem {
  label: string
  icon: IconType 
  href: string
}

interface Item {
  label: string
  icon: IconType 
  href: string
  badge?: number | string
  submenu?: SubMenuItem[]
}

interface RouteSection {
  title: string
  items: Item[]
}

const adminRoutes: RouteSection[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
      },
      {
        label: "Products",
        icon: Package,
        href: "/admin/products", 
        submenu: [
          { label: "List View", icon: Package, href: "/admin/products/list" },
          { label: "Grid View", icon: Package, href: "/admin/products/grid" },
          { label: "Details", icon: Package, href: "/admin/products/details" },
          { label: "Create", icon: Package, href: "/admin/products/create" },
        ],
      },
      {
        label: "Orders",
        icon: ShoppingCart,
        href: "/admin/orders",
        badge: 7, 
        submenu: [
          { label: "All Orders", icon: ShoppingCart, href: "/admin/orders/all" },
          { label: "Pending", icon: ShoppingCart, href: "/admin/orders/pending" },
          { label: "Completed", icon: ShoppingCart, href: "/admin/orders/completed" },
        ],
      },
      {
        label: "Users",
        icon: Users,
        href: "/admin/users",
        submenu: [
          { label: "Customers", icon: Users, href: "/admin/users/customers/list" },
          { label: "Sellers", icon: Users, href: "/admin/users/sellers/list" },
          { label: "Profile", icon: Users, href: "/admin/users/profile" },
          { label: "Roles", icon: Users, href: "/admin/users/roles" },
          { label: "Permissions", icon: Users, href: "/admin/users/permissions" },
        ],
      },
    ],
  },
  {
    title: "E-Commerce",
    items: [
      {
        label: "Categories",
        icon: Tag,
        href: "/admin/category",
        submenu: [
          { label: "List", icon: Tag, href: "/admin/category/list" },
          { label: "Create", icon: Tag, href: "/admin/category/create" },
        ],
      },
      {
        label: "Inventory",
        icon: BarChart3,
        href: "/admin/inventory",
        submenu: [
          { label: "List", icon: BarChart3, href: "/admin/inventory/list" },
          { label: "Add Stock", icon: BarChart3, href: "/admin/inventory/add" },
        ],
      },
      {
        label: "Attributes",
        icon: Tag,
        href: "/admin/attributes",
        submenu: [
          { label: "Colors", icon: Tag, href: "/admin/attributes/colors" },
          { label: "Sizes", icon: Tag, href: "/admin/attributes/sizes" },
        ],
      },
      {
        label: "Coupons",
        icon: Tag,
        href: "/admin/coupons",
        submenu: [
          { label: "List", icon: Tag, href: "/admin/coupons/list" },
          { label: "Create", icon: Tag, href: "/admin/coupons/create" },
        ],
      },
      {
        label: "Reviews",
        icon: Star,
        href: "/admin/reviews",
        submenu: [
          { label: "All Reviews", icon: Star, href: "/admin/reviews/all" },
          { label: "Pending", icon: Star, href: "/admin/reviews/pending" },
        ],
      },
    ],
  },
  {
    title: "Business Docs",
    items: [
      {
        label: "Purchases",
        icon: FileText,
        href: "/admin/purchases",
        submenu: [
          { label: "List", icon: FileText, href: "/admin/purchases/list" },
          { label: "Create", icon: FileText, href: "/admin/purchases/create" },
        ],
      },
      {
        label: "Invoices",
        icon: FileText,
        href: "/admin/invoices",
        submenu: [
          { label: "List", icon: FileText, href: "/admin/invoices/list" },
          { label: "Create", icon: FileText, href: "/admin/invoices/create" },
        ],
      },
    ],
  },
  {
    title: "Apps & Tools",
    items: [
      {
        label: "Communications",
        icon: MessageSquare,
        href: "/admin/communications",
        submenu: [
          { label: "Chat", icon: MessageSquare, href: "/admin/chat" },
          { label: "Email", icon: Mail, href: "/admin/email" },
        ],
      },
      {
        label: "Productivity",
        icon: Calendar,
        href: "/admin/productivity",
        submenu: [
          { label: "Calendar", icon: Calendar, href: "/admin/calendar" },
          { label: "Todo", icon: CheckSquare, href: "/admin/todo" },
        ],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        icon: Settings,
        href: "/admin/settings",
      },
      {
        label: "Compliance",
        icon: Lock,
        href: "/admin/compliance",
        submenu: [
          { label: "Privacy Policy", icon: Lock, href: "/admin/privacy-policy" },
          { label: "Authentication", icon: Lock, href: "/admin/authentication" },
        ],
      },
      {
        label: "Help & Support",
        icon: HelpCircle,
        href: "/admin/help",
        submenu: [
          { label: "Help Center", icon: HelpCircle, href: "/admin/help-center" },
          { label: "FAQs", icon: HelpCircle, href: "/admin/faqs" },
        ],
      },
    ],
  },
]


interface SidebarProps {
  isOpen: boolean
  onClose: () => void 
  // 🎯 NEW PROP: Brand name variable
  brandName?: string
  // 🎯 NEW PROP: Logo component variable (defaults to Store icon if not provided)
  LogoComponent?: IconType
}

const isActive = (href: string, pathname: string): boolean => {
  return pathname === href || (pathname.startsWith(href) && pathname.charAt(href.length) === '/')
}

const isSubmenuActive = (submenu: SubMenuItem[] | undefined, pathname: string): boolean => {
  if (!submenu) return false
  return submenu.some((item) => isActive(item.href, pathname))
}

export function Sidebar({ 
  isOpen, 
  onClose,
  // Set default values for the new props
  brandName = "InstaBiz",
  LogoComponent = Store 
}: SidebarProps) {
  const pathname = usePathname()
  
  const [expandedItem, setExpandedItem] = useState<string | null>(() => {
    let activeParent: string | null = null;
    adminRoutes.forEach(section => {
      section.items.forEach(item => {
        if (item.submenu && isSubmenuActive(item.submenu, pathname)) {
          activeParent = item.label;
        }
      })
    })
    return activeParent;
  });
  
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSubmenu = (label: string) => {
    setExpandedItem((prev) =>
      prev === label 
        ? null
        : label 
    )
  }
  
  const sidebarVariants: Variants = { 
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  // 🎯 UPDATED Sidebar Header to use brandName and LogoComponent
  const SidebarHeader = () => (
    <div className="h-20 bg-transparent shrink-0 flex items-center px-4">
      <Link href="/admin" className="flex items-center gap-3">
        <LogoComponent size={24} className="text-blue-600 dark:text-blue-400" />
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {brandName}
        </span>
      </Link>
    </div>
  )


  return (
    <>
      {/* Overlay for mobile (unchanged) */}
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={isDesktop ? false : 'closed'} 
        animate={isDesktop ? 'open' : isOpen ? 'open' : 'closed'}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64", 
          "border-r border-gray-200 dark:border-slate-700",
          "transition-colors duration-200", 
          "lg:sticky lg:top-0 lg:translate-x-0 lg:h-screen",
          "flex flex-col bg-white dark:bg-slate-900 overflow-hidden" 
        )}
      >
        {/* Brand Header Area */}
        <SidebarHeader />

        {/* Close button for mobile */}
        <div className="lg:hidden px-4 py-2 flex justify-end absolute top-2 right-0">
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content - Scrollable area */}
        <nav 
          className="px-4 py-4 space-y-6 flex-1 overflow-y-auto scrollbar-hide" 
          style={{ scrollbarGutter: 'stable' }}
        >
          {adminRoutes.map((section) => (
            <div key={section.title}>
              {/* Section Title */}
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                {section.title}
              </h3>

              {/* Section Items */}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const hasSubmenu = item.submenu && item.submenu.length > 0
                  const isItemActive = isActive(item.href, pathname)
                  const isSubmenuActiveNow = isSubmenuActive(item.submenu, pathname)

                  const isSubmenuExpanded = expandedItem === item.label 
                  const isMenuActive = isItemActive || isSubmenuActiveNow 

                  return (
                    <li key={item.label}>
                      {/* Main Item */}
                      <div
                        className={cn(
                          'relative flex items-center justify-between px-3 py-2.5 rounded-md transition-colors duration-150',
                          isMenuActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800',
                        )}
                      >
                        {hasSubmenu ? (
                          <motion.button
                            onClick={() => toggleSubmenu(item.label)}
                            className="flex-1 flex items-center gap-3 text-left w-full"
                            whileTap={{ scale: 0.98 }}
                          >
                            <item.icon size={18} className="shrink-0" />
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                                {item.badge}
                              </span>
                            )}
                            <ChevronDown
                              size={16}
                              className={`ml-auto shrink-0 transition-transform duration-200 ${
                                isSubmenuExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </motion.button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => {
                              if (!isDesktop) onClose() 
                            }}
                            className="flex-1 flex items-center gap-3"
                          >
                            <item.icon size={18} className="shrink-0" />
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )}

                        {/* Active indicator */}
                        {isMenuActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </div>

                      {/* Submenu */}
                      <AnimatePresence>
                        {hasSubmenu && isSubmenuExpanded && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1 ml-6 space-y-1 border-l-2 border-gray-200 dark:border-slate-700"
                          >
                            {item.submenu?.map((subitem) => {
                              const isSubitemActive = isActive(subitem.href, pathname)
                              return (
                                <motion.li
                                  key={subitem.label}
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link
                                    href={subitem.href}
                                    onClick={() => {
                                      if (!isDesktop) onClose()
                                    }}
                                    className={cn(
                                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-150',
                                      isSubitemActive
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    )}
                                  >
                                    <subitem.icon size={16} className="shrink-0" />
                                    <span>{subitem.label}</span>
                                  </Link>
                                </motion.li>
                              )
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </motion.aside>
    </>
  )
}