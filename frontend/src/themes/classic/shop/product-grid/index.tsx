"use client"

import { ProductCard } from "../product-card"

export type Product = {
  id: string
  name: string
  price: number
  category?: string
  imageUrl: string
  href: string
}

type ProductGridProps = {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="w-full py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}