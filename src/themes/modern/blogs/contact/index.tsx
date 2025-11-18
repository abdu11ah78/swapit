/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { motion, Transition, cubicBezier } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Sparkles, ArrowRight, Check } from "lucide-react"

const newsletterData = {
  sectionId: "newsletter-signup",
  bgGradient: "from-white via-gray-50 to-white",
  heading: "Be Part of Something Extraordinary",
  subheading:
    "Get insider access to exclusive content, early product launches, and special offers crafted just for you.",
  inputPlaceholder: "your@email.com",
  buttonText: "Subscribe",
  footnote: "No spam. Only valuable insights.",
  animation: {
    duration: 0.8,
    delay: 0.2,
    easing: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
}

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setEmail("")
      }, 3000)
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setLoading(false)
    }
  }

  const customEase = cubicBezier(...newsletterData.animation.easing)

  const transitionProps: Transition = {
    duration: newsletterData.animation.duration,
    ease: customEase,
  }

  return (
    <section
      id={newsletterData.sectionId}
      className="relative py-16 md:py-20 px-4 md:px-8 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-3">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="newsletter-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#newsletter-grid)" />
        </svg>
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/3 -left-1/3 w-1/2 h-1/2 bg-gradient-to-br from-gray-900/15 via-gray-700/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 150, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/3 -right-1/3 w-1/2 h-1/2 bg-gradient-to-tl from-gray-900/15 via-gray-700/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Animated Accent Lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={transitionProps}
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Card Container */}
        <div className="relative group">
          {/* Gradient Border Animation */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-gray-900/20 via-gray-700/10 to-gray-900/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Card Content */}
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-white/60 p-8 md:p-16 shadow-2xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500">
            {/* Subtle Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gray-50 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            />

            <div className="relative z-10">
              {/* Icon Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ ...transitionProps, delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                viewport={{ once: true }}
                className="flex justify-center mb-8"
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900/10 to-gray-700/5 backdrop-blur-xl border-2 border-gray-900/20 flex items-center justify-center shadow-lg">
                    <Mail className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gray-900/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </motion.div>
              </motion.div>

              {/* Heading Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...transitionProps, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center mb-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/5 backdrop-blur-sm border border-gray-900/10 mb-6">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-gray-900/60"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Newsletter</span>
                </div>

                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                  {newsletterData.heading}
                </h2>
              </motion.div>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ ...transitionProps, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
              >
                {newsletterData.subheading}
              </motion.p>

              {/* Form Section */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...transitionProps, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8"
              >
                <motion.div
                  className="flex-1 relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <Input
                    type="email"
                    placeholder={newsletterData.inputPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/60 border-2 border-gray-200/60 text-gray-900 placeholder:text-gray-500 focus:border-gray-900/40 focus:ring-4 focus:ring-gray-400/20 focus:bg-white/80 transition-all duration-300 backdrop-blur-sm rounded-2xl font-medium h-14 px-6 text-base"
                    required
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-900/0 via-gray-900/5 to-gray-900/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading || success}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 h-14 cursor-pointer bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group min-w-fit"
                >
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />

                  <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                    {success ? (
                      <>
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Check size={20} />
                        </motion.div>
                        Subscribed!
                      </>
                    ) : loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={20} />
                        </motion.div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        {newsletterData.buttonText}
                        <motion.div
                          animate={{ x: [0, 6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight size={20} />
                        </motion.div>
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.form>

              {/* Footnote */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ ...transitionProps, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center text-sm text-gray-500 font-medium"
              >
                {newsletterData.footnote}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent mt-24"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </section>
  )
}