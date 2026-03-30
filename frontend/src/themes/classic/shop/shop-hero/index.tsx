"use client"

import React from "react"
import Image from "next/image"

export type ShopHeroProps = {
  title?: string
  subtitle?: string
  backgroundUrl?: string
}

export function ShopHero({
  title= "",
  subtitle = "Discover our latest collections and best sellers",
  backgroundUrl = "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80",
}: ShopHeroProps) {
  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={backgroundUrl}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}