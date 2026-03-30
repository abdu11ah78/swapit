"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"

export type Category = {
  id: string
  label: string
  href: string
  imageUrl: string
}

type Props = {
  categories?: Category[]
}

// Default categories (3–6). Replace images/links as needed.
const defaultCategories: Category[] = [
  {
    id: "clothing",
    label: "Clothing",
    href: "/categories/clothing",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "electronics",
    label: "Electronics",
    href: "/categories/electronics",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "bakery",
    label: "Bakery",
    href: "/categories/bakery",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
]

export function FeaturedCategories({ categories = defaultCategories }: Props) {
  const visible = categories.slice(0, 6)

  return (
    <section aria-labelledby="featured-categories" className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="featured-categories" className="text-2xl sm:text-3xl font-extrabold">
            Featured Categories
          </h2>
          <p className="text-sm text-muted-foreground hidden sm:block">Shop our top categories</p>
        </div>

        {/* Responsive grid: 3 across on md, 4 on lg if more items */}
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {visible.map((cat) => (
            <li key={cat.id}>
              <Link
                href={cat.href}
                className="group block overflow-hidden rounded-2xl focus:outline-none focus-visible:ring focus-visible:ring-primary/50"
                aria-label={`View ${cat.label} category`}
              >
                <div className="relative w-full h-56 md:h-48 lg:h-56 bg-gray-100">
                  {/* Next/Image automatically optimizes; swap to <img> if you prefer raw src */}
                  <Image
                    src={cat.imageUrl}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

                  {/* Label */}
                  <div className="absolute left-4 right-4 bottom-4">
                    <span className="inline-block bg-white/80 backdrop-blur-sm text-sm sm:text-base font-semibold px-3 py-1 rounded-md text-black">
                      {cat.label}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Optional: show a small caption or CTA under grid */}
        <div className="mt-6 text-sm text-center text-muted-foreground">
          Discover more categories in our <Link href="/categories" className="underline">categories</Link> page.
        </div>
      </div>
    </section>
  )
}