// components/common/pronavbar/index.tsx
"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, User, Heart, Search, LayoutGrid, Info, BookOpen, Menu, X } from "lucide-react"
import { motion } from "framer-motion"

// External imports
import { useAppContext } from "@/context/AppContext"
import { themeRegistry } from '@/themes'

// Component imports
import { PromoBar } from "./PromoBar"
import { NavDropdown } from "./NavDropdown"
import { NavMegaMenu } from "./NavMegaMenu"
import { SearchModal } from "./SearchModal"
import { MobileMenu } from "./MobileMenu"
import { NavItem } from "./types"

function fetchTenant() {
  return {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "pro",
  };
}

export default function ProNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { cart, wishlist } = useAppContext()
  const tenant = fetchTenant();
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isScrolled])

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
    {
      id: 'shop',
      label: 'Shop',
      icon: LayoutGrid,
      mainHref: '/shop',
      type: 'mega',
      megaSections: [
        {
          title: "Collections", items: [
            { label: 'All Products', href: '/shop', icon: LayoutGrid },
            { label: 'New Arrivals', href: '/shop/new', icon: LayoutGrid },
            { label: 'Best Sellers', href: '/shop/bestsellers', icon: LayoutGrid },
          ]
        },
        {
          title: "Categories", items: [
            { label: 'Electronics', href: '/shop/electronics', icon: LayoutGrid },
            { label: 'Fashion', href: '/shop/fashion', icon: LayoutGrid },
            { label: 'Accessories', href: '/shop/accessories', icon: LayoutGrid },
          ]
        },
        {
          title: "Special", items: [
            { label: 'Limited Edition', href: '/shop/limited', icon: LayoutGrid },
            { label: 'Sale', href: '/shop/sale', icon: LayoutGrid },
          ]
        }
      ],
      megaFeatured: [
        { title: "Summer Drop", image: "", href: "/shop/summer" },
        { title: "Tech Essentials", image: "", href: "/shop/tech" }
      ]
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: BookOpen,
      mainHref: '/portfolio',
      type: 'dropdown',
      items: [
        { label: 'Our profile', href: '/portfolio#hero', icon: BookOpen },
        { label: 'Our Services', href: '/portfolio#services', icon: BookOpen },
        { label: 'Gallery', href: '/portfolio#gallery', icon: BookOpen },
      ]
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      mainHref: '/about',
      type: 'dropdown',
      items: [
        { label: 'About Us', href: '/about#hero', icon: Info },
        { label: 'Team', href: '/about#team', icon: Info },
        { label: 'Story', href: '/about#milestones', icon: Info },
      ]
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: BookOpen,
      mainHref: '/blog',
      type: 'dropdown',
      items: [
        { label: 'Latest Posts', href: '/blog', icon: BookOpen },
        { label: 'Categories', href: '/blog#blogPage', icon: LayoutGrid },
        { label: 'Contact Author', href: '/blog#contact', icon: BookOpen },
      ]
    },
  ]

  return (
    <>
      <PromoBar />

      {/* DESKTOP HEADER */}
      <header className={`hidden md:block fixed left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'top-0 bg-white/90 backdrop-blur-xl shadow-md border-b border-gray-200/50'
        : 'top-[36px] bg-transparent'
        }`}>
        <div className="w-full px-6 lg:px-12 py-4 lg:py-6">
          <div className="flex items-center justify-between">

            {/* LEFT NAVIGATION */}
            <nav className="flex items-center gap-4 lg:gap-8">
              {navItems.map((item) => {
                const isActive = activeDropdown === item.id

                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavClick(item);
                      }}
                      className={`text-xs lg:text-sm font-medium tracking-[0.1em] uppercase transition-all duration-300 relative group flex items-center gap-1.5 ${isScrolled
                        ? 'text-gray-900 hover:text-black'
                        : 'text-white hover:text-white'
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isScrolled ? 'bg-black' : 'bg-white'
                        }`}></span>
                    </button>

                    {item.type === 'mega' ? (
                      <NavMegaMenu
                        isOpen={isActive}
                        sections={item.megaSections}
                        featured={item.megaFeatured}
                        close={() => setActiveDropdown(null)}
                      />
                    ) : (
                      <NavDropdown
                        isOpen={isActive}
                        title={item.label}
                        items={item.items || []}
                        close={() => setActiveDropdown(null)}
                      />
                    )}
                  </div>
                )
              })}
            </nav>

            {/* CENTER LOGO */}
            <motion.a
              href="/"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              className="absolute left-1/2 -translate-x-1/2 group"
            >
              <div className="text-center relative">
                <h1 className={`text-2xl lg:text-3xl xl:text-4xl font-light tracking-[0.3em] transition-all duration-500 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  INSTABIZ
                </h1>
                <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${isScrolled ? 'bg-black' : 'bg-white'}`}></div>
              </div>
            </motion.a>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-5 lg:gap-7">
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`transition-colors ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-gray-200'}`}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative transition-colors ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-gray-200'}`}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                onClick={() => setIsCartOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative transition-colors ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-gray-200'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`transition-colors ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-gray-200'}`}
              >
                <User className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE/TABLET HEADER */}
      <header className={`md:hidden fixed left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'top-0 bg-white/90 backdrop-blur-xl shadow-md border-b border-gray-200/50'
        : 'top-[36px] bg-transparent'
        }`}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">

            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className={`transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            >
              {!isMobileMenuOpen ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </motion.button>

            <motion.a href="/" className="absolute left-1/2 -translate-x-1/2">
              <div className="text-center">
                <h1 className={`text-xl sm:text-2xl font-light tracking-[0.2em] transition-colors duration-500 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  INSTABIZ
                </h1>
              </div>
            </motion.a>

            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                whileTap={{ scale: 0.95 }}
                className={`transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={() => setIsCartOpen(true)}
                whileTap={{ scale: 0.95 }}
                className={`relative transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        wishlistCount={wishlist.length}
      />

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* CART SIDEBAR */}
      {isCartOpen && theme.Cart && theme.Cart.CartSidebar && (
        <theme.Cart.CartSidebar close={() => setIsCartOpen(false)} />
      )}
    </>
  )
}