"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

type HeroSlide = {
  id: string
  headline: string
  subtext?: string
  ctaText: string
  ctaLink: string
  imageUrl: string
}

export function HeroSection() {
  const [slides] = React.useState<HeroSlide[]>([
    {
      id: "1",
      headline: "Shop the Best from InstaBizShop",
      subtext: "Your trusted marketplace for online & offline business.",
      ctaText: "Shop Now",
      ctaLink: "/shop",
      imageUrl:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: "2",
      headline: "Grow Your Business with Us",
      subtext: "Seamless sales online and at your shop.",
      ctaText: "Get Started",
      ctaLink: "/about",
      imageUrl:
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: "3",
      headline: "Discover New Collections",
      subtext: "Hand-picked products for your lifestyle.",
      ctaText: "Browse Categories",
      ctaLink: "/categories",
      imageUrl:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80",
    },
  ])

  const [api, setApi] = React.useState<CarouselApi>()

  // autoplay
  React.useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [api])

  return (
    <section className="relative w-full h-[85vh]">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="relative w-full h-[85vh] basis-full"
            >
              <Image
                src={slide.imageUrl}
                alt={slide.headline}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
                  {slide.headline}
                </h1>
                {slide.subtext && (
                  <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-6">
                    {slide.subtext}
                  </p>
                )}
                <Link href={slide.ctaLink}>
                  <Button
                    size="lg"
                    className="bg-white text-black font-semibold px-8 py-3 hover:bg-gray-200"
                  >
                    {slide.ctaText}
                  </Button>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-6 bg-black/50 text-white hover:bg-black/70 rounded-full p-3" />
        <CarouselNext className="right-6 bg-black/50 text-white hover:bg-black/70 rounded-full p-3" />
      </Carousel>
    </section>
  )
}