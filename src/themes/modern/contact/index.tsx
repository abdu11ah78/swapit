"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ContactFormData, ContactInfo } from "../../../data/classic/user/types/types"
import { Mail, Phone, MapPin, Send, CheckCircle, Sparkles } from "lucide-react" 
import toast from 'react-hot-toast'

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [contactInfo] = useState<ContactInfo>({
    email: "support@instabizshop.com",
    phone: "+1 234 567 890",
    address: "123 Business Street, NY, USA",
    locationEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.8862172565726!2d-73.98513068459362!3d40.75889607932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x3c9d1b39e1a3ad8!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1696514164711!5m2!1sen!2sus",
  })

  // This is correct and doesn't need the 'ease' property
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8,
      },
    },
  }

  // FIXED: Changed 'ease: string' to the equivalent cubic-bezier array [number, number, number, number] 
  // to satisfy the strict TypeScript definition in your environment.
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      // The standard cubic-bezier for "easeInOut"
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] as const }, 
    },
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log("Submitted:", formData)
      toast.success("Message sent successfully!")
      setSubmitSuccess(true)
      setFormData({ name: "", email: "", message: "" })
      
      // Reset success state after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      toast.error("Failed to send message")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-2">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="contact-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-grid)" />
        </svg>
      </div>

      {/* Floating Shadow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-black/8 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-black/8 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 22, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Title Section */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-600/20 backdrop-blur-md border border-gray-600/30 mb-6"
            animate={{ boxShadow: ["0 0 20px rgba(0,0,0,0)", "0 0 40px rgba(0,0,0,0.1)", "0 0 20px rgba(0,0,0,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              className="w-2 h-2 bg-gray-700/60 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">Get in Touch</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 leading-tight">
            Contact <motion.span
              className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Us
            </motion.span>
          </h1>
          <motion.p
            className="text-gray-600/80 text-lg md:text-xl max-w-2xl mx-auto font-medium"
            variants={itemVariants}
          >
            {/* FIXED: Replaced unescaped apostrophes with &apos; to fix ESLint error */}
            We&apos;d love to hear from you! Whether it&apos;s a project inquiry, feedback, or just to say hello.
          </motion.p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            className="group"
          >
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl p-8 md:p-10"
              whileHover={{ boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
            >
              {/* Ambient Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />

              <div className="relative z-10">
                <motion.h2
                  className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="w-8 h-8 text-gray-700" />
                  Send us a Message
                </motion.h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="relative"
                  >
                    <input
                      name="name"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-white/30 rounded-2xl font-medium text-gray-900 placeholder-gray-600/50 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-0"
                      // NOTE: Removed whileFocus animation to prevent potential type conflict if not explicitly defined
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <input
                      name="email"
                      type="email"
                      placeholder="Your Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-white/30 rounded-2xl font-medium text-gray-900 placeholder-gray-600/50 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-0"
                      // NOTE: Removed whileFocus animation to prevent potential type conflict if not explicitly defined
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  {/* Message Textarea */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="relative"
                  >
                    <textarea
                      name="message"
                      placeholder="Your Message..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-white/30 rounded-2xl font-medium text-gray-900 placeholder-gray-600/50 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm resize-none"
                      required
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-0"
                      // NOTE: Removed whileFocus animation to prevent potential type conflict if not explicitly defined
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 cursor-pointer bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative mt-6"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Button Glow */}
                    <motion.div
                      className="absolute inset-0 cursor-pointer bg-gradient-to-r from-gray-700/0 via-gray-700/50 to-gray-700/0 opacity-0"
                      animate={isSubmitting ? { opacity: [0, 1, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {submitSuccess ? (
                        <>
                          <CheckCircle size={20} />
                          Message Sent!
                        </>
                      ) : isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Sparkles size={20} />
                          </motion.div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </div>

              {/* Accent Lines */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          </motion.div>

          {/* Contact Info + Map */}
          <motion.div
            className="space-y-8"
            variants={itemVariants}
          >
            {/* Info Cards */}
            <motion.div
              className="group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl p-8"
              whileHover={{ boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
            >
              {/* Ambient Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />

              <div className="relative z-10">
                <motion.h2
                  className="text-2xl font-bold text-gray-900 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Get in Touch
                </motion.h2>

                <div className="space-y-6">
                  {[
                    { icon: Mail, label: "Email", value: contactInfo.email },
                    { icon: Phone, label: "Phone", value: contactInfo.phone },
                    { icon: MapPin, label: "Address", value: contactInfo.address },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-gray-200/50 hover:border-gray-300 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                      >
                        <motion.div
                          className="mt-1 p-3 rounded-xl bg-gray-900/10"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                        >
                          <Icon className="text-gray-900 h-5 w-5 font-bold" />
                        </motion.div>
                        <div>
                          <p className="text-xs font-bold text-gray-600/70 uppercase tracking-widest mb-1">
                            {item.label}
                          </p>
                          <p className="text-gray-900 font-semibold">{item.value}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Accent Lines */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>

            {/* Map */}
            <motion.div
              className="group overflow-hidden rounded-3xl shadow-xl border-2 border-white/40"
              whileHover={{ boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Map Container with Glass Effect */}
              <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20">
                <iframe
                  src={contactInfo.locationEmbedUrl}
                  width="100%"
                  height="380"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-3xl"
                ></iframe>
              </div>

              {/* Accent Lines */}
              <motion.div
                className="absolute -inset-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}