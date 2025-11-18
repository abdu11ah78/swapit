"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// Data structure
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
    imageUrl:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "3",
    message: "New Arrivals — Trending This Week!",
    href: "/new",
    imageUrl:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "4",
    message: "Clearance — Last Chance to Save!",
    href: "/clearance",
    imageUrl:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1920&q=80",
  },
]

export function PromotionalBanner({ promos = defaultPromos }: Props) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="w-full bg-white">
      {/* 🔸 Top banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        // 💡 Changed gradient from green to gray and black
        className="bg-gradient-to-r from-gray-700 to-black text-white py-4 px-6 shadow-md"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base font-medium tracking-wide"
          >
            {promos[0].message}
          </motion.p>
          {promos[0].href && (
            <Link href={promos[0].href}>
              <Button
                size="sm"
                variant="secondary"
                className="flex items-center cursor-pointer gap-2 bg-white text-black hover:bg-gray-200 font-semibold"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* 🔸 Image promos */}
      {promos.length > 1 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {promos.slice(1).map((promo) => (
            <motion.div
              key={promo.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              {/* Background Image */}
              {promo.imageUrl && (
                <motion.div className="relative w-full h-60 md:h-72 lg:h-80">
                  <Image
                    src={promo.imageUrl}
                    alt={promo.message}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              )}

              {/* Text & Button */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 z-10"
                initial={{ y: 40, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 drop-shadow-lg leading-tight">
                  {promo.message}
                </h3>

                {promo.href && (
                  <Link href={promo.href}>
                    <Button
                      size="sm"
                      className="bg-white/90 cursor-pointer text-black hover:bg-white transition-colors font-semibold flex items-center gap-2"
                    >
                      View More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}