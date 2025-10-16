"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Button } from "@/components/ui/button"

// A single promo item
export type Promo = {
  id: string
  message: string
  href?: string
  imageUrl?: string
}

type Props = {
  promos?: Promo[]
}

// Default promos
const defaultPromos: Promo[] = [
  {
    id: "1",
    message: "Free Delivery Above $50",
    href: "/shop",
  },
  {
    id: "2",
    message: "Autumn Sale — Up to 40% Off!",
    href: "/sale",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "3",
    message: "Autumn Sale — Up to 40% Off!",
    href: "/sale",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "4",
    message: "Autumn Sale — Up to 40% Off!",
    href: "/sale",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
]

export function PromotionalBanner({ promos = defaultPromos }: Props) {
  return (
    <section className="w-full">
      <div className="bg-primary text-white text-center py-3 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm font-medium">{promos[0].message}</p>
          {promos[0].href && (
            <Link href={promos[0].href}>
              <Button size="sm" variant="secondary">
                Shop Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      {promos.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 px-4 max-w-7xl mx-auto">
          {promos.slice(1).map((promo) => (
            <div key={promo.id} className="relative rounded-2xl overflow-hidden group shadow-sm">
              {promo.imageUrl && (
                <Image
                  src={promo.imageUrl}
                  alt={promo.message}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48 md:h-56 lg:h-64 group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                  {promo.message}
                </h3>
                {promo.href && (
                  <Link href={promo.href} className="mt-3">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                      View More
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}