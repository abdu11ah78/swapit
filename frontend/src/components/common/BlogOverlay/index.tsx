/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect } from 'react'
import { X, Sparkles, ArrowRight, Calendar, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BlogOverlayData {
  id: string
  title: string
  excerpt: string
  content?: string
  imageUrl: string
  author: string
  publishedAt: string
  category: string
  readTime?: number
  tags?: string[]
}

interface BlogOverlayProps {
  isOpen: boolean
  onClose: () => void
  blogData: BlogOverlayData | null
}

const BlogOverlay: React.FC<BlogOverlayProps> = ({ isOpen, onClose, blogData }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !blogData) return null

  const longContent = Array.from({ length: 4 }, (_, index) => (
    <p key={index} className="text-gray-600 mb-6 text-base leading-relaxed font-medium">
      Detailed insights into {blogData.title}: This section provides comprehensive analysis and practical applications. We explore key concepts, real-world examples, and valuable takeaways that will enhance your understanding and implementation strategy.
    </p>
  ))

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl bg-gradient-to-br from-white via-gray-50 to-white border-2 border-white/60 rounded-3xl shadow-2xl shadow-gray-900/10 p-6 sm:p-10 mt-8 mb-8 backdrop-blur-xl"
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            />

            {/* Close Button - FIXED FOR MOBILE */}
            <motion.button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 border border-gray-200/50 text-gray-900 transition-all duration-300 z-20 hover:shadow-lg active:scale-95 touch-manipulation"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
            >
              <X size={24} />
            </motion.button>

            <div className="relative z-10">
              {/* Category Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-600/20 backdrop-blur-md border border-gray-600/30 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  className="w-2 h-2 bg-gray-700/60 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                  {blogData.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {blogData.title}
              </motion.h2>

              {/* Meta Information */}
              <motion.div
                className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/50 rounded-lg border border-gray-200/50">
                  <Calendar size={14} className="text-gray-700" />
                  <span className="font-semibold">
                    {new Date(blogData.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/50 rounded-lg border border-gray-200/50">
                  <User size={14} className="text-gray-700" />
                  <span className="font-semibold">{blogData.author}</span>
                </div>

                {blogData.readTime && (
                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/50 rounded-lg border border-gray-200/50 font-semibold">
                    {blogData.readTime} min read
                  </div>
                )}
              </motion.div>

              {/* Featured Image */}
              <motion.div
                className="relative w-full h-48 sm:h-96 mb-6 sm:mb-8 shadow-xl rounded-2xl overflow-hidden border-2 border-white/40 group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={blogData.imageUrl}
                  alt={`Image of ${blogData.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.onerror = null
                    target.src = "https://placehold.co/1200x400/d1d5db/ffffff?text=Blog+Image"
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
                />
              </motion.div>

              {/* Excerpt */}
              <motion.p
                className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {blogData.excerpt}
              </motion.p>

              {/* Tags */}
              {blogData.tags && blogData.tags.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mb-6 sm:mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {blogData.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100/60 rounded-full border border-gray-200/50 hover:bg-gray-200/60 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Divider */}
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent my-6 sm:my-8"
              />

              {/* Content Section Header */}
              <motion.div
                className="flex items-center gap-2 mb-4 sm:mb-6 text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Sparkles size={20} className="text-gray-700" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Full Article</span>
              </motion.div>

              {/* Long Content */}
              <motion.div
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                {longContent}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  className="inline-flex items-center cursor-pointer gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                  whileHover={{ scale: 1.05, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                >
                  Continue Reading
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BlogOverlay