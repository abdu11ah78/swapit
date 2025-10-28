
"use client"

import { useState, useEffect } from "react"
import { Filters } from "@/themes/classic/shop/shop-filter"
import { Product } from "@/themes/classic/shop/product-grid"
import { themeRegistry } from "@/themes"

export default function ShopPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tenant, setTenant] = useState<any>(null)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: undefined,
    priceRange: [0, 500],
    sortBy: "latest",
  })
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setTenant({ tenantId: "tenant123", name: "Ecommerce", templateId: "modern" })
  }, [])

  useEffect(() => {
    const allProducts: Product[] = [
      { id: "1", name: "Classic Shirt", price: 25, category: "clothing", href: "/product/1", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "2", name: "Laptop", price: 1200, category: "electronics", href: "/product/2", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "3", name: "Laptop", price: 1200, category: "electronics", href: "/product/3", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "4", name: "Laptop", price: 1200, category: "electronics", href: "/product/4", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "5", name: "Laptop", price: 1200, category: "electronics", href: "/product/5", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "6", name: "Laptop", price: 1200, category: "electronics", href: "/product/6", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "7", name: "Laptop", price: 1200, category: "electronics", href: "/product/7", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "8", name: "Laptop", price: 1200, category: "electronics", href: "/product/8", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "9", name: "Laptop", price: 1200, category: "electronics", href: "/product/9", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "10", name: "Laptop", price: 1200, category: "electronics", href: "/product/10", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "11", name: "Laptop", price: 1200, category: "electronics", href: "/product/11", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "12", name: "Laptop", price: 1200, category: "electronics", href: "/product/12", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "13", name: "Laptop", price: 1200, category: "electronics", href: "/product/13", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "14", name: "Laptop", price: 1200, category: "electronics", href: "/product/14", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "15", name: "Laptop", price: 1200, category: "electronics", href: "/product/15", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" },
      { id: "16", name: "Laptop", price: 1200, category: "electronics", href: "/product/16", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80" }
    ]

    const filtered = allProducts.filter(p =>
      filters.category ? p.category === filters.category : true
    )
    setProducts(filtered)
  }, [filters])

  if (!tenant) return null
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry]

  return (
    <>
      <theme.Shop.ShopHero
        title="Shop All Product"
        subtitle="Discover our latest collections and best sellers"
        backgroundUrl="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80"
      />

      <theme.Shop.ShopFilters onChange={setFilters} />

      
        <theme.Shop.ProductGrid products={products} />
        <theme.Shop.ShopPagination />
      
    </>
  )
}