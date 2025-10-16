"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import React from "react"

// --- Testimonials ---
export type Testimonial = {
  id: string
  name: string
  role?: string
  message: string
  avatarUrl?: string
}

const demoTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Verified Buyer",
    message: "Amazing service and high‑quality products. Will definitely shop again!",
    avatarUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "2",
    name: "David Kim",
    role: "Regular Customer",
    message: "Fast delivery and great prices. Highly recommend this store!",
    avatarUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
  }
]

function TestimonialsSection({ testimonials = demoTestimonials }: { testimonials?: Testimonial[] }) {
  return (
    <section aria-labelledby="testimonials" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 id="testimonials" className="text-2xl sm:text-3xl font-extrabold text-center mb-8">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                {t.avatarUrl && (
                  <Image
                    src={t.avatarUrl}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="ml-4">
                  <p className="font-semibold">{t.name}</p>
                  {t.role && <p className="text-sm text-muted-foreground">{t.role}</p>}
                </div>
              </div>
              <p className="text-gray-700">“{t.message}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- Call To Action ---
function CallToActionSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          Visit Our Store
        </h2>
        <p className="mb-6 text-lg">
          Come experience our products in person or download our mobile app for convenience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/store">
            <Button size="lg" variant="secondary" className="font-semibold">
              Find Us on the Map
            </Button>
          </Link>
          <Link href="/app">
            <Button size="lg" className="bg-white text-black font-semibold hover:bg-gray-200">
              Download Our App
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export { TestimonialsSection, CallToActionSection }