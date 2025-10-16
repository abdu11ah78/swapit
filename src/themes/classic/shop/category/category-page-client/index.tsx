"use client"

import { useState, useEffect } from "react"
import { Filters } from "@/themes/classic/shop/shop-filter"
import { Product } from "@/themes/classic/shop/product-grid"
import { themeRegistry } from "@/themes"

type Props = { slug: string }

export function CategoryPageClient({ slug }: Props) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: slug,
    priceRange: [0, 500],
    sortBy: "latest",
  })
  const [products, setProducts] = useState<Product[]>([])
  const [tenant, setTenant] = useState<any>(null)

  useEffect(() => {
    setTenant({ tenantId: "tenant123", name: "Ecommerce", templateId: "classic" })
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      const query = new URLSearchParams()
      if (filters.search) query.append("search", filters.search)
      if (filters.category) query.append("category", filters.category)
      query.append("minPrice", filters.priceRange[0].toString())
      query.append("maxPrice", filters.priceRange[1].toString())
      query.append("sortBy", filters.sortBy)

      const res = await fetch(`/api/shop?${query.toString()}`)
      const data: Product[] = await res.json()
      setProducts(data)
    }

    fetchProducts()
  }, [filters, slug])

  if (!tenant) return null
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry]

  return (
    <>
      <theme.Shop.ShopHero
        title={slug.charAt(0).toUpperCase() + slug.slice(1)} 
        subtitle={`Explore the best in ${slug}`}
        backgroundUrl="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80"
      />

      <theme.Shop.ShopFilters onChange={setFilters} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <theme.Shop.ProductGrid products={products} />
      </div>
    </>
  )
}