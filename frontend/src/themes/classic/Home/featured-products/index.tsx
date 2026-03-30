"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import React from "react"

export type Product = {
  id: string
  name: string
  price: string
  href: string
  imageUrl: string
}

type Props = {
  products?: Product[]
}

const demoProducts: Product[] = [
  {
    id: "1",
    name: "Classic T‑Shirt",
    price: "$25.00",
    href: "/products/1",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "2",
    name: "Wireless Headphones",
    price: "$120.00",
    href: "/products/2",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "3",
    name: "Freshly Baked Bread",
    price: "$4.50",
    href: "/products/3",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "4",
    name: "Luxury Face Cream",
    price: "$45.00",
    href: "/products/4",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
]

export function FeaturedProducts({ products = demoProducts }: Props) {
  const visible = products.slice(0, 8)

  return (
    <section aria-labelledby="featured-products" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="featured-products" className="text-2xl sm:text-3xl font-extrabold">
            Featured Products
          </h2>
          <p className="text-sm text-muted-foreground hidden sm:block">Our best sellers and most loved picks</p>
        </div>

        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {visible.map((product) => (
            <li key={product.id} className="group relative rounded-2xl border overflow-hidden shadow-sm">
              <Link href={product.href}>
                <div className="relative w-full h-56 bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-semibold line-clamp-2">{product.name}</h3>
                  <p className="text-sm font-medium text-primary">{product.price}</p>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="px-4 pb-4 flex gap-2">
                <Button variant="default" size="sm" className="flex-1">
                  Add to Cart
                </Button>
                <Link href={product.href} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Explore our full <Link href="/products" className="underline">product catalog</Link> for more.
        </div>
      </div>
    </section>
  )
}