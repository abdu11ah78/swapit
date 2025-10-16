"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Service } from "../../../../data/classic/user/types/types"

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetch("/api/portfolio/services")
      .then((res) => res.json())
      .then((data: Service[]) => setServices(data))
      .catch(() => {
        setServices([
          {
            id: "1",
            name: "Custom Furniture",
            description: "Tailored furniture designs for your home & office.",
            price: 250,
            imageUrl:
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
            ctaText: "Order Now",
            ctaLink: "/order/1",
          },
          {
            id: "2",
            name: "Interior Design",
            description: "Complete design service for modern interiors.",
            price: 500,
            imageUrl:
              "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80",
            ctaText: "Get a Quote",
            ctaLink: "/quote/2",
          },
        ])
      })
  }, [])

  return (
    <section className="py-16 container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-black mb-10">
        Our Services
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card
            key={service.id}
            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition"
          >
            {/* Image with zoom on hover */}
            {service.imageUrl && (
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-black mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">
                {service.description}
              </p>

              {/* Price Badge */}
              {service.price && (
                <span className="inline-block bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  ${service.price}
                </span>
              )}

              {/* CTA Button */}
              {service.ctaText && (
                <Button asChild className="w-full">
                  <Link href={service.ctaLink ?? `/order/${service.id}`}>
                    {service.ctaText}
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}