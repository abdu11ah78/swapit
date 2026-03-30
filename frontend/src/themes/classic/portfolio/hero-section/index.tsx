"use client"

import Image from "next/image"

export function PortfolioHero() {
  return (
    <section className="relative w-full h-[50vh] flex items-center justify-center bg-black">
      <Image
        src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80"
        alt="Portfolio Hero"
        fill
        className="object-cover opacity-50"
      />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Showcasing our services and best work done for clients.
        </p>
      </div>
    </section>
  )
}