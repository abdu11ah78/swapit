"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

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
      headline: "The Future of Barter",
      subtext: "Swap items instantly with AI-powered valuation. Your trusted protocol for smart trading.",
      ctaText: "Start Swapping",
      ctaLink: "/shop",
      imageUrl:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: "2",
      headline: "Smart AI Valuation",
      subtext: "Never wonder about a fair trade again. Our AI analyzes market trends for LT Coin estimates.",
      ctaText: "Post Your Item",
      ctaLink: "/items/new",
      imageUrl:
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: "3",
      headline: "Discover Smart Matches",
      subtext: "Let AI find the perfect trade for you. verified inventory for superior quality swaps.",
      ctaText: "AI Match Now",
      ctaLink: "/smart-match",
      imageUrl:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80",
    },
  ])

  const [api, setApi] = React.useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const totalSlides = slides.length

  // FIX: State for particle positions to avoid hydration mismatch
  const [particlePositions, setParticlePositions] = React.useState<{ left: string }[]>([])
  const particleCount = 5;


  React.useEffect(() => {
    // Generate and store particle positions only once on the client mount
    const newPositions = [...Array(particleCount)].map(() => ({
      left: `${Math.random() * 100}%`,
    }));
    setParticlePositions(newPositions);
  }, []); // <-- Empty dependency array runs this only once on client mount

  React.useEffect(() => {
    if (!api) return

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap())
    })

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [api])

  const handlePrevious = () => {
    if (api) api.scrollPrev()
  }

  const handleNext = () => {
    if (api) api.scrollNext()
  }

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Full Screen Carousel with Image */}
      <Carousel setApi={setApi} className="w-full h-full" opts={{ align: "start" }}>
        <CarouselContent className="h-full m-0 ml-0">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="relative w-full h-screen basis-full p-0 m-0"
            >
              {/* Full Screen Image with Ken Burns Effect */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.headline}
                  fill
                  priority
                  className="object-cover"
                  style={{ filter: "brightness(0.5) contrast(1.15)" }}
                />
              </motion.div>

              {/* Dark Gradient Overlay - Left to Right */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* OVERLAY CONTENT - Positioned on top of image and z-indexed */}
      <motion.div
        className="absolute top-20 inset-0 z-20 flex flex-col justify-between p-12 md:p-16 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* TOP CONTENT (Main Headline, Subtext, CTA) */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Slide Number / Indicator (Top Left - KEPT) */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex gap-1">
                  {slides.map((_, idx) => (
                    <motion.div
                      key={idx}
                      className={`h-1 transition-all ${idx === currentSlide ? "w-12 bg-gray-200" : "w-2 bg-gray-700"
                        }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    />
                  ))}
                </div>
                <span className="text-gray-500 font-mono text-sm">0{currentSlide + 1} / 0{totalSlides}</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {slides[currentSlide].headline}
              </motion.h1>

              {/* Decorative Underline */}
              <motion.div
                className="h-1 w-24 bg-gradient-to-r from-gray-200 to-gray-500 mb-8"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />

              {/* Subtext */}
              {slides[currentSlide].subtext && (
                <motion.p
                  className="text-lg text-gray-400 max-w-md leading-relaxed mb-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  {slides[currentSlide].subtext}
                </motion.p>
              )}

              {/* CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Link href={slides[currentSlide].ctaLink} passHref>
                  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="bg-gray-200 text-black cursor-pointer font-bold text-lg px-10 py-6 rounded-lg hover:bg-white transition-all flex items-center gap-3 group"
                    >
                      {slides[currentSlide].ctaText}
                      <motion.div
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>


        {/* BOTTOM NAVIGATION CONTROLS */}
        <motion.div
          className="flex items-center justify-start gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={handlePrevious}
            className="w-12 h-12 border border-gray-600 cursor-pointer rounded-full flex items-center justify-center hover:border-gray-400 hover:bg-gray-900 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!api?.canScrollPrev()}
          >
            <ArrowRight className="w-4 h-4 rotate-180 text-gray-400" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="w-12 h-12 border border-gray-600 cursor-pointer rounded-full flex items-center justify-center hover:border-gray-400 hover:bg-gray-900 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!api?.canScrollNext() && currentSlide === totalSlides - 1}
          >
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </motion.button>

          {/* Progress Indicator (Bottom Right - REMOVED) */}
        </motion.div>
      </motion.div>

      {/* Floating Particles (Corrected for Hydration) */}
      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gray-600 rounded-full pointer-events-none"
          animate={{
            y: [0, -400],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.8,
          }}
          style={{
            // Uses the stable, client-generated position from state
            left: pos.left,
            top: "100%",
          }}
        />
      ))}
    </section>
  )
}