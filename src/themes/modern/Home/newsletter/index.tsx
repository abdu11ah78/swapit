"use client"

import { useState } from "react"
import { motion, Transition, cubicBezier } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

// 🧩 ---- CONFIGURATION / VARIABLES ----
const newsletterData = {
  sectionId: "newsletter-signup",
  // 💡 ENHANCEMENT: Changed gradient for a moodier, deeper dark background
  bgGradient: "from-gray-950 via-gray-900 to-black",
  glowEffect: {
    enabled: true,
    // 💡 ENHANCEMENT: Softer, more atmospheric glow color
    color: "from-cyan-400/10 via-purple-500/10 to-transparent", 
  },
  icon: Mail,
  // 💡 ENHANCEMENT: Adjusted for a glassmorphic look
  iconBg: "bg-white/5 border border-white/20", 
  heading: "Stay Ahead of the Trend",
  subheading:
    "Join our insider circle and get exclusive offers, style inspiration, and early access to new drops.",
  inputPlaceholder: "Enter your email address",
  buttonText: "Subscribe",
  // 💡 ENHANCEMENT: High-contrast, metallic button style
  buttonStyle: "bg-neutral-100 text-black shadow-lg hover:bg-neutral-300 font-bold", 
  footnote: "No spam. Unsubscribe anytime.",
  animation: {
    duration: 0.8,
    delay: 0.2,
    easing: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
  apiEndpoint: "/api/newsletter/subscribe",
}

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      // Later you can connect this to your backend or Resend/Mailchimp API
      console.log("Subscribed with:", email)
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setLoading(false)
      setEmail("")
    }
  }

  const Icon = newsletterData.icon

  const customEase = cubicBezier(
    ...newsletterData.animation.easing
  )

  const transitionProps: Transition = {
    duration: newsletterData.animation.duration,
    ease: customEase,
  }

  const iconTransitionProps: Transition = {
    delay: newsletterData.animation.delay,
    duration: 0.5,
    type: "spring",
  }

  return (
    <section
      id={newsletterData.sectionId}
      className="relative py-24 px-6 overflow-hidden bg-neutral-950 text-white"
    >
      {/* BACKGROUND GRADIENT */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${newsletterData.bgGradient}`}
      />
      {newsletterData.glowEffect.enabled && (
        <div
          // 💡 ENHANCEMENT: Updated glow effect color
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full blur-3xl opacity-30 bg-gradient-to-tr ${newsletterData.glowEffect.color}`}
        />
      )}

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={transitionProps}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center bg-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/50">
            
        {/* ICON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={iconTransitionProps}
          className="flex justify-center mb-8"
        >
          <div
            // 💡 ENHANCEMENT: Glassmorphic icon container
            className={`p-4 rounded-2xl ${newsletterData.iconBg} backdrop-blur-xl transition-all duration-300 hover:scale-105`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* TEXT */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          {newsletterData.heading}
        </h2>
        <p className="text-neutral-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          {newsletterData.subheading}
        </p>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
          whileHover={{ scale: 1.005 }} // Subtle scale change to enhance 3D feel
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Input
            type="email"
            placeholder={newsletterData.inputPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // 💡 ENHANCEMENT: Frosted glass input with a vibrant focus ring
            className="w-full sm:w-96 bg-white/10 border-white/20 text-white placeholder:text-neutral-300 focus:ring-2 focus:ring-cyan-400 backdrop-blur-lg transition-colors"
            required
          />
          {/* Button is styled via newsletterData.buttonStyle, which was updated */}
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className={`
                ${newsletterData.buttonStyle} cursor-pointer 
                px-8 py-6 rounded-xl transition-all duration-300 
                // 💡 ENHANCEMENT: Inner shadow for 3D press effect
                active:shadow-inner active:shadow-black/20 
                // 💡 ENHANCEMENT: Subtle gradient on hover
                group relative overflow-hidden
            `}
          >
             {/* Gradient overlay for metallic shine effect */}
             <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-slow pointer-events-none rounded-xl" />
            
            {loading ? "Subscribing..." : newsletterData.buttonText}
          </Button>
        </motion.form>

        {/* FOOTNOTE */}
        <p className="text-sm text-neutral-400 mt-6">
          {newsletterData.footnote}
        </p>
      </motion.div>
    </section>
  )
}