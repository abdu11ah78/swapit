"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, User, Heart, Menu, X, Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import { themeRegistry } from '@/themes'

type Category = { name: string; slug: string }

function fetchTenant() {
  return {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "classic", 
  };
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const { wallet, wishlist } = useAppContext()
  const tenant =  fetchTenant();
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry];

  useEffect(() => {
    setCategories([
      { name: "Clothing", slug: "clothing" },
      { name: "Electronics", slug: "electronics" },
      { name: "Bakery", slug: "bakery" },
      { name: "Beauty", slug: "beauty" },
    ])
  }, [])

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between gap-8">
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-black">
          InstaBizShop
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 relative">
          {/* Categories */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button className="flex items-center gap-1 text-gray-700 hover:text-black cursor-pointer">
              Categories <ChevronDown className="w-4 h-4" />
            </button>
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border shadow-lg rounded-md py-2 w-48 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop/${cat.slug}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-black cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-black"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Button
            className="rounded-full p-2 bg-white shadow hover:scale-105 transition-transform cursor-pointer relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5 text-black" />
            {wallet.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-2 shadow-md">
                {wallet.length}
              </span>
            )}
          </Button>

          <Button className="relative rounded-full p-2 bg-white shadow hover:scale-105 transition-transform cursor-pointer">
            <Heart className="h-5 w-5 text-black" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-2 shadow-md">
                {wishlist.length}
              </span>
            )}
          </Button>

          <Button className="rounded-full p-2 bg-white shadow hover:scale-105 transition-transform cursor-pointer">
            <User className="h-5 w-5 text-black" />
          </Button>

          <button
            className="md:hidden text-gray-700 hover:text-black cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isCartOpen && <theme.Cart.CartSidebar close={() => setIsCartOpen(false)} />}
    </header>
  )
}