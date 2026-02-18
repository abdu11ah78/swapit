"use client"

import { motion, Transition } from "framer-motion" // 💡 Import Transition
import Image from "next/image"
import React from "react"

export type ShopHeroProps = {
  title?: string
  subtitle?: string
  backgroundUrl?: string
}

// 💡 Configuration object (easily editable / fetchable from backend later)
const heroConfig = {
  overlayGradient: "from-black/60 via-black/40 to-transparent",
  headingGradient: "from-white via-indigo-200 to-purple-400",
  glowColor: "bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)]",
  shadow:
    "shadow-[0_0_40px_rgba(255,255,255,0.25),_inset_0_0_60px_rgba(255,255,255,0.1)]",
  // Ensure the easing array is typed correctly, or remove 'ease' here and define it below
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  textDelay: 0.3,
  fadeIn: { opacity: 1, y: 0 },
  fadeOut: { opacity: 0, y: 40 },
}

// 💡 SOLUTION: Create a type-safe base transition object using the Transition type
const baseTransition: Transition = {
  duration: heroConfig.transition.duration,
  // The easing array is now correctly interpreted as a valid Easing[] type
  ease: heroConfig.transition.ease as [number, number, number, number],
};


export function ShopHero({
  title = "BROWSING TERMINAL",
  subtitle = "Real-time access to the SwapIt global trade protocol.",
  backgroundUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
}: ShopHeroProps) {
  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      {/* --- Background Image --- */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src={backgroundUrl}
          alt={title}
          fill
          priority
          className="object-cover brightness-[0.85]"
        />
      </motion.div>

      {/* --- Gradient Overlay --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // 💡 Use the type-safe object
        transition={baseTransition}
        className={`absolute inset-0 bg-gradient-to-t ${heroConfig.overlayGradient}`}
      />

      {/* --- Glow Effect --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className={`absolute inset-0 ${heroConfig.glowColor}`}
      />

      {/* --- Hero Content --- */}
      <motion.div
        initial={heroConfig.fadeOut}
        animate={heroConfig.fadeIn}
        // 💡 Spread the type-safe object with the added delay
        transition={{ delay: heroConfig.textDelay, ...baseTransition }}
        className="relative z-10 text-center px-6"
      >
        {/* Title */}
        <motion.h1
          className={`text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${heroConfig.headingGradient} ${heroConfig.shadow}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          // 💡 Spread the type-safe object with the added delay
          transition={{ delay: heroConfig.textDelay + 0.2, ...baseTransition }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="mt-4 text-lg md:text-2xl text-neutral-200 drop-shadow-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            // 💡 Spread the type-safe object with the added delay
            transition={{ delay: heroConfig.textDelay + 0.4, ...baseTransition }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Bottom Glow Line */}
        <motion.div
          className="mt-8 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-white via-neutral-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: heroConfig.textDelay + 0.6, duration: 0.6 }}
        />
      </motion.div>
    </section>
  )
}