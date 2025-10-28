"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { ShoppingCart, User, Heart, Search, LayoutGrid, Info, BookOpen, Mail, ChevronDown, ChevronLeft, ChevronRight, Rss, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon } from "lucide-react"

// === EXTERNAL IMPORTS (ORIGINAL LOGIC PRESERVED) ===
import { useAppContext } from "@/context/AppContext" 
import { themeRegistry } from '@/themes' 

// --- TYPES & DATA ---

interface DropdownItem { label: string; href: string; icon: LucideIcon }
interface NavItem { id: string; label: string; icon: LucideIcon; mainHref: string; items: DropdownItem[] }

function fetchTenant() {
  return {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "modern", 
  };
}

// === PROMO BAR (FIXED: Seamless Cyclic and Drag Scroll) ===
const PromoBar = () => {
  const promos = [
    "CYBERNETIC SALE ACTIVATED",
    "LIMITED EDITION DROPS",
    "TRANSACTION PROTOCOL 77 ONLINE",
  ];
  
  const repeatedPromos = [...promos, ...promos, ...promos, ...promos, ...promos];

  return (
    <div className="overflow-hidden bg-slate-900 border-b border-slate-500/20">
      <div 
        className="flex gap-12 whitespace-nowrap overflow-x-auto custom-scroll-bar-hide" 
        style={{ animation: 'slide-left 30s linear infinite' }}
      >
        {repeatedPromos.map((promo, i) => (
          <span 
            key={i} 
            className="flex-shrink-0 text-gray-300 py-2 text-xs font-bold tracking-widest min-w-fit px-4"
            style={{ animationPlayState: 'running' }} 
          >
            {promo}
          </span>
        ))}
      </div>

      <style jsx global>{`
        .custom-scroll-bar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scroll-bar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes slide-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-20%); 
          }
        }

        .custom-scroll-bar-hide:hover {
          animation-play-state: paused;
          overflow-x: auto;
        }
      `}</style>
    </div>
  )
}

// --- DESKTOP DROPDOWN MENU ---
interface NavDropdownProps {
  isOpen: boolean
  title: string
  items: DropdownItem[]
  close: () => void
}

const NavDropdown: React.FC<NavDropdownProps> = ({ isOpen, title, items, close }) => {
  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 bg-slate-800/80 backdrop-blur-xl border-2 border-slate-500/50 z-[90] overflow-hidden shadow-2xl rounded-t-xl"
          >
            <div className="border-b-2 border-slate-500/20 px-4 py-3 bg-slate-800 text-white font-bold tracking-wider text-sm">
              {title}
            </div>
            <div className="divide-y divide-slate-500/20">
              {items.map((item: DropdownItem, idx: number) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  onClick={close}
                  whileHover={{ backgroundColor: "rgb(71, 85, 105)", color: "#fff", x: 4 }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-200 transition-all duration-500"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0 text-gray-300" />
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  )
}

// --- ICON WRAPPER (Dark Icon with Rounded Dark BG) ---
const DarkIconWrapper: React.FC<{ icon: React.ReactNode; badgeCount?: number; onClick?: () => void; className?: string }> = ({ icon, badgeCount, onClick, className = '' }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className={`relative p-2 rounded-full cursor-pointer transition-transform bg-transparent hover:bg-slate-700/50 ${className}`}
    >
      <div 
        className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-500/50 shadow-md shadow-slate-900/50"
      >
        <span className="text-gray-300">{icon}</span>
      </div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 shadow-md flex items-center justify-center min-w-[20px] min-h-[20px] leading-none"
        >
          {badgeCount}
        </motion.span>
      )}
    </motion.button>
  )
}


// --- MAIN COMPONENT ---

export default function ModernNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileSideMenuOpen, setIsMobileSideMenuOpen] = useState(false)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null)
  const isInitialTransparent = true;
  const navItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // === APP CONTEXT & THEME SETUP (ORIGINAL LOGIC PRESERVED) ===
  const { cart, wishlist } = useAppContext()
  const tenant =  fetchTenant();
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry];

  // === SCROLL EFFECT LOGIC ===
  useEffect(() => {
    if (!isInitialTransparent) return;
    const handleScroll = () => {
        const scrolled = window.scrollY > 100 
        if (scrolled !== isScrolled) {
            setIsScrolled(scrolled)
        }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
        window.removeEventListener("scroll", handleScroll)
    }
  }, [isScrolled, isInitialTransparent])

  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const handleNavClick = (item: NavItem) => {
    if (isTouchDevice()) {
      if (activeDropdown === item.id) {
        window.location.href = item.mainHref;
        setActiveDropdown(null);
      } else {
        setActiveDropdown(item.id);
      }
    } else {
      window.location.href = item.mainHref;
    }
  }

  const navItems: NavItem[] = [
    { id: 'shop', label: 'SHOP', icon: LayoutGrid, mainHref: '/shop', items: [
        { label: 'All Products', href: '/shop', icon: LayoutGrid },
        { label: 'New Arrivals', href: '/shop/new', icon: LayoutGrid },
        { label: 'Best Sellers', href: '/shop/bestsellers', icon: LayoutGrid },
    ]},
    { id: 'portfolio', label: 'PORTFOLIO', icon: BookOpen, mainHref: '/portfolio', items: [
        { label: 'Our profile', href: '/portfolio#hero', icon: BookOpen },
        { label: 'Our Services', href: '/portfolio#services', icon: BookOpen },
        { label: 'Gallery', href: '/portfolio#gallery', icon: BookOpen },
    ]},
    { id: 'about', label: 'ABOUT', icon: Info, mainHref: '/about', items: [
        { label: 'About Us', href: '/about#hero', icon: Info },
        { label: 'Team', href: '/about#team', icon: Info },
        { label: 'Story', href: '/about#milestones', icon: Info },
    ]},
    { id: 'blog', label: 'BLOGS', icon: Rss, mainHref: '/blog', items: [
        { label: 'Latest Posts', href: '/blog', icon: Rss },
        { label: 'Categories', href: '/blog#blogPage', icon: LayoutGrid },
        { label: 'Contact Author', href: '/blog#contact', icon: Mail },
    ]},
  ]
  
  const logoColor = isScrolled ? "text-gray-600" : "text-black"; 
  const logoShadowStyle = isScrolled ? '0 0 5px rgba(203, 213, 225, 0.5)' : 'none'; 

  return (
    <>
      <PromoBar />
      
      {/* TOP BAR - MOBILE ONLY */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-[45] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        {/* Menu Toggle */}
        <motion.button
          onClick={() => setIsMobileSideMenuOpen(!isMobileSideMenuOpen)}
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {!isMobileSideMenuOpen ? (
            <Menu className="w-5 h-5 text-black" />
          ) : (
            <X className="w-5 h-5 text-black" />
          )}
        </motion.button>

        {/* Logo */}
        <motion.a
          href="/"
          className="text-base font-bold text-black"
        >
          INSTABIZ
        </motion.a>

        {/* Right Icons Container */}
        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <motion.button
            onClick={() => setIsSearchOpen(true)}
            className="cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Search className="w-5 h-5 text-black" />
          </motion.button>

          {/* Cart Icon with Badge */}
          <motion.button
            onClick={() => setIsCartOpen(true)}
            className="cursor-pointer relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart className="w-5 h-5 text-black" />
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {cart.length}
              </motion.span>
            )}
          </motion.button>

          {/* Wishlist Icon with Badge */}
          <motion.button
            className="cursor-pointer relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-5 h-5 text-black" />
            {wishlist.length > 0 && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {wishlist.length}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {/* 1. STANDALONE TOP LOGO (Desktop) */}
      <div className="hidden sm:block absolute top-8 z-40 w-full py-1 pointer-events-none bg-neutral-500/40" >
        <motion.a
            href="/"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex-shrink-0 text-center text-4xl sm:text-5xl lg:text-6xl font-black tracking-[0.2em] whitespace-nowrap transition-colors duration-500 block ${logoColor} shadow-none pointer-events-auto`}
            style={{ textShadow: logoShadowStyle }}
        >
            INSTABIZ
        </motion.a>
      </div>
      
      {/* 2. FLOATING BOTTOM DOCK HEADER (Desktop) */}
      <header 
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl hidden sm:block"
      >
        
        {/* Background Animation (Heavy Glassmorphism Dock) */}
        <motion.div
          className={`absolute inset-0 rounded-full transition-colors duration-500 border border-slate-500/20 bg-slate-900 opacity-40 backdrop-blur-xl shadow-2xl shadow-slate-900/50`}
          animate={{ 
            scale: 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Navbar Content */}
        <div className={`relative px-4 py-3 text-black flex items-center justify-between h-20`}>
          
          {/* Desktop Navigation */}
          <nav className="flex items-center gap-2 lg:gap-4 mx-auto lg:mx-0">
            
            {navItems.map((item) => {
              const isActive = activeDropdown === item.id
              
              return (
                <div 
                  key={item.id} 
                  ref={(el) => {
                      navItemRefs.current[item.id] = el;
                  }}
                  className="relative h-full"
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavClick(item);
                    }}
                    animate={{ 
                      backgroundColor: isActive ? "rgb(30, 41, 59)" : "transparent",
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col lg:flex-row items-center cursor-pointer justify-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-all relative hover:bg-slate-700/50 h-full`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-500/50 shadow-md shadow-slate-900/50">
                        <item.icon className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="text-white hidden lg:inline">{item.label}</span>
                    <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-3 h-3 text-gray-300 hidden lg:block" />
                      </motion.div>
                  </motion.button>
                  <NavDropdown 
                    isOpen={isActive}
                    title={item.label} 
                    items={item.items} 
                    close={() => setActiveDropdown(null)} 
                  />
                </div>
              )
            })}
          </nav>

          {/* Spacer for desktop */}
          <div className="flex-grow hidden lg:block" />

          {/* Right Icons (Merged into Dock) */}
          <div className={`flex items-center gap-2 lg:gap-4`}>
              
              {/* Search */}
              <DarkIconWrapper 
                icon={<Search className="h-4 sm:h-5 w-4 sm:w-5" />} 
                onClick={() => setIsSearchOpen(true)}
              />

              {/* Wishlist Icon and Badge (Context Logic) */}
              <DarkIconWrapper 
                icon={<Heart className="h-4 sm:h-5 w-4 sm:w-5" />} 
                badgeCount={wishlist.length}
                className="hidden sm:block"
              />

              {/* Cart Icon and Badge (Context Logic) */}
              <DarkIconWrapper 
                icon={<ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />} 
                badgeCount={cart.length}
                onClick={() => setIsCartOpen(true)}
              />
              
              {/* User Icon */}
              <DarkIconWrapper 
                icon={<User className="h-4 sm:h-5 w-4 sm:w-5" />} 
                className="hidden sm:block"
              />
          </div>
        </div>
      </header>

      {/* MOBILE SIDE MENU */}
      <AnimatePresence>
        {isMobileSideMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSideMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 sm:hidden"
            />

            {/* Side Menu */}
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen z-45 w-72 bg-white border-r border-gray-200 overflow-y-auto pt-24 pb-8"
            >
              {/* Search in menu */}
              <div className="px-6 mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ENTER YOUR KEYWORDS"
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-0 px-0">
                {navItems.map((item) => {
                  const isActive = activeMobileDropdown === item.id

                  return (
                    <div key={item.id}>
                      <motion.button
                        onClick={() => {
                          setActiveMobileDropdown(isActive ? null : item.id);
                        }}
                        className="w-full flex items-center justify-between px-6 py-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <span>{item.label}</span>
                        <motion.div
                          animate={{ rotate: isActive ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </motion.div>
                      </motion.button>

                      {/* Subcategories */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="overflow-hidden"
                          >
                            {item.items.map((subItem, idx) => (
                              <motion.a
                                key={idx}
                                href={subItem.href}
                                onClick={() => setIsMobileSideMenuOpen(false)}
                                className="flex items-center gap-2 px-6 py-2.5 pl-12 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                              >
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                                <span>{subItem.label}</span>
                              </motion.a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-[100] bg-black opacity-70 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl mx-4"
            >
              <div className="relative bg-slate-900 border-2 border-slate-500/50 rounded-xl overflow-hidden shadow-2xl">
                <input
                  type="text"
                  placeholder="SEARCH THE DATALOG..."
                  autoFocus
                  className="w-full px-4 sm:px-6 py-3 sm:py-5 text-base sm:text-xl font-semibold outline-none bg-transparent text-white placeholder:text-gray-600/70"
                />
                <motion.button
                  onClick={() => setIsSearchOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 cursor-pointer transform -translate-y-1/2 p-2 hover:bg-slate-500/10 rounded-lg transition-colors"
                >
                  <Search className="w-5 sm:w-7 h-5 sm:h-7 text-gray-300" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 flex flex-wrap gap-2 sm:gap-3 justify-center"
              >
                {['Products', 'Projects', 'Personnel'].map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05, backgroundColor: "rgb(71, 85, 105)" }}
                    className="px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm cursor-pointer font-bold bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors shadow-md"
                  >
                    {tag} PROTOCOL
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar Rendering (ORIGINAL LOGIC PRESERVED) */}
      {isCartOpen && theme.Cart && theme.Cart.CartSidebar && <theme.Cart.CartSidebar close={() => setIsCartOpen(false)} />}
    </>
  )
}