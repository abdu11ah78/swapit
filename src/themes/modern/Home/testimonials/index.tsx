/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Quote } from "lucide-react"

// --- TYPES ---
type Testimonial = {
  id: string
  name: string
  role: string
  message: string
  imageUrl: string
}

type TestimonialsSectionProps = {
  heading?: string
  subheading?: string
  testimonials?: Testimonial[]
}

// --- DEFAULT DATA ---
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sophia Lee",
    role: "Loyal Customer",
    message:
      "Their attention to quality and design always impresses me. Every order feels like an experience — not just a purchase.",
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "2",
    name: "Michael Green",
    role: "Verified Buyer",
    message:
      "Smooth checkout, fast delivery, and premium packaging. This brand really understands modern shopping aesthetics.",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "3",
    name: "Emily Carter",
    role: "First-time Shopper",
    message:
      "Minimal design, effortless browsing, and the quality exceeded expectations. Highly recommended.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2lybHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
  },
]

// --- FRAMER VARIANTS ---
const activeCardVariants: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: "spring", stiffness: 120, damping: 18 },
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

// --- ACTIVE TESTIMONIAL CARD ---
const ActiveTestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      key={testimonial.id}
      className="relative bg-neutral-900 text-white rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col justify-between"
      variants={activeCardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Background Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-neutral-700/20 to-neutral-400/20 transition-opacity duration-700 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Quote Icon */}
      <Quote size={42} className="text-neutral-400 mb-6 opacity-70 relative z-10" />

      {/* Message */}
      <p className="italic text-neutral-300 text-xl leading-relaxed mb-8 relative z-10">
        “{testimonial.message}”
      </p>

      {/* User Info */}
      <div className="flex items-center border-t border-neutral-700/50 pt-4 relative z-10">
        <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
          <img
            src={testimonial.imageUrl}
            alt={testimonial.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
          <p className="text-sm text-neutral-400">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

// --- MAIN SECTION ---
export function TestimonialsSection({
  heading = "What Our Customers Say",
  subheading = "Real feedback from people who love our products and trust our brand.",
  testimonials = DEFAULT_TESTIMONIALS,
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = testimonials[activeIndex]

  return (
    <section className="py-24 bg-neutral-200 text-neutral-900">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* HEADER */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="mb-12"
        >
          <p className="text-sm uppercase tracking-widest text-neutral-600 mb-2 font-medium">
            {subheading}
          </p>
          <h2 className="text-4xl font-extrabold text-black leading-tight">
            {heading}
          </h2>
        </motion.div>

        {/* HORIZONTAL SELECTORS */}
        <div className="flex justify-center gap-8 flex-wrap mb-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                activeIndex === i
                  ? "opacity-100"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`h-20 w-20 rounded-full overflow-hidden border-2 transition-all ${
                  activeIndex === i
                    ? "border-black shadow-lg"
                    : "border-neutral-400 hover:border-black"
                }`}
              >
                <img
                  src={t.imageUrl}
                  alt={t.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-3 font-medium text-sm">{t.name}</p>
              <p className="text-xs text-neutral-500">{t.role}</p>
            </motion.div>
          ))}
        </div>

        {/* ACTIVE CARD BELOW */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            {current && (
              <ActiveTestimonialCard key={current.id} testimonial={current} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
