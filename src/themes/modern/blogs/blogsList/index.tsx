"use client"

import { motion, Variants } from "framer-motion"
import Image from "next/image"
import React, { useState } from "react" // Imported useState
import { Calendar, User, ArrowRight, Sparkles} from "lucide-react" // Added Clock for clarity
import { MOCK_BLOG_POSTS } from "../blogData"

// Assuming this path is correct for your BlogOverlay component
import BlogOverlay from "../../../../components/common/BlogOverlay" 

// --- TYPES ---
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

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  featuredImage: string
  author: string
  publishedAt: string
  category: string
  readTime?: number
  tags?: string[]
}

interface BlogListProps {
  posts?: BlogPost[]
  isLoading?: boolean
}

// --- MOTION VARIANTS (TS FIXES APPLIED HERE) ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.8,
    },
  },
}

// Fixed Error 2693 (Removed duplicate 'Variants' assignment)
const itemVariants: Variants = { 
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      // Fixed Error 2322: Replaced "easeOut" string with cubic-bezier array
      ease: [0.2, 0, 1, 1] 
    },
  },
}

// --- COMPONENT ---

export function BlogList({ posts = MOCK_BLOG_POSTS, isLoading = false }: BlogListProps) {
  // --- Overlay State and Handlers ---
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayData, setOverlayData] = useState<BlogOverlayData | null>(null);

  const handleOpenOverlay = (post: BlogPost) => {
      const mappedData: BlogOverlayData = {
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          imageUrl: post.featuredImage, 
          author: post.author, 
          publishedAt: post.publishedAt, 
          category: post.category, 
          content: post.content,
          readTime: post.readTime,
          tags: post.tags,
      }
      setOverlayData(mappedData);
      setIsOverlayOpen(true);
  }

  const handleCloseOverlay = () => {
      setIsOverlayOpen(false);
      setOverlayData(null);
  }
  
  // --- Loading/Empty State (Retained) ---

  if (isLoading) {
    return (
      <motion.div
        className="space-y-6 p-4 md:p-8 lg:p-20 pt-24 md:pt-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-white/40 p-4 md:p-8 lg:p-20 pt-24 md:pt-32 shadow-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl" />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <p className="text-gray-600 text-lg font-semibold">No blog posts found</p>
      </motion.div>
    )
  }

  // --- Main List Structure (Retained UI) ---

  return (
    <>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post) => (
          // The entire article acts as the clickable element
          <motion.article
            key={post.id}
            variants={itemVariants}
            className="group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 **cursor-pointer**" // ADDED cursor-pointer
            whileHover={{ boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
            onClick={() => handleOpenOverlay(post)} // ADDED CLICK HANDLER
          >
            {/* Ambient Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            />

            <div className="relative z-10 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
              {/* Featured Image */}
              <motion.div
                className="md:col-span-1 relative overflow-hidden rounded-2xl h-64 md:h-full min-h-64 flex-shrink-0"
                whileHover={{ scale: 1.08 }}
              >
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                {/* Image Overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
                />
              </motion.div>

              {/* Content Section */}
              <div className="md:col-span-2 flex flex-col justify-between">
                {/* Category Badge */}
                <motion.div
                  className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-gray-600/20 backdrop-blur-md border border-gray-600/30 mb-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-gray-700/60 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                    {post.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight hover:text-gray-700 transition-colors group-hover:text-gray-800">
                    {post.title}
                  </h3>
                </motion.div>

                {/* Excerpt */}
                <motion.p
                  className="text-gray-600/80 text-base font-medium leading-relaxed mb-4 line-clamp-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {post.excerpt}
                </motion.p>

                {/* Meta Information */}
                <motion.div
                  className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-lg border border-gray-200/50">
                    <Calendar size={16} className="text-gray-700" />
                    <span className="font-semibold">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-lg border border-gray-200/50">
                    <User size={16} className="text-gray-700" />
                    <span className="font-semibold">{post.author}</span>
                  </div>

                  {post.readTime && (
                    <div className="px-3 py-1.5 bg-white/50 rounded-lg border border-gray-200/50 font-semibold">
                      {post.readTime} min read
                    </div>
                  )}
                </motion.div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {post.tags.slice(0, 3).map((tag) => (
                      <motion.span
                        key={tag}
                        className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100/60 rounded-full border border-gray-200/50 hover:bg-gray-200/60 transition-colors **cursor-pointer**" // ADDED cursor-pointer
                        whileHover={{ scale: 1.05 }}
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Read More Link (Now just an internal button, its action is handled by the article onClick) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <motion.button
                    className="inline-flex items-center cursor-pointer gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read Article
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Accent Lines */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.article>
        ))}
      </motion.div>

      {/* BlogOverlay Component */}
      <BlogOverlay
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        blogData={overlayData}
      />
    </>
  )
}

export default BlogList