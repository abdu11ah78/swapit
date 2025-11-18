"use client"

import { motion, Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, TrendingUp, Clock, Sparkles } from "lucide-react"
import { useState } from "react"

export interface Category {
  id: string
  name: string
  slug: string
  count: number
}

export interface SidebarBlog {
  id: string
  title: string
  slug: string
  featuredImage: string
  publishedAt: string
  readTime?: number
}

interface BlogSidebarProps {
  categories: Category[]
  recentPosts: SidebarBlog[]
  trendingPosts: SidebarBlog[]
  onCategorySelect?: (slug: string | null) => void 
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    },
  },
}

import { MOCK_CATEGORIES, MOCK_RECENT_POSTS, MOCK_TRENDING_POSTS } from "../blogData"

export function BlogSidebar({
  categories = MOCK_CATEGORIES,
  recentPosts = MOCK_RECENT_POSTS,
  trendingPosts = MOCK_TRENDING_POSTS,
  onCategorySelect,
}: BlogSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  

  const handleCategoryClick = (slug: string) => {
    // Determine the new category state (toggle functionality)
    const newCategory = activeCategory === slug ? null : slug
    
    setActiveCategory(newCategory)
    
    // Pass string | null to the parent, matching the updated prop type
    onCategorySelect?.(newCategory) 
  }

  return (
    <motion.div
      className="sticky top-24 space-y-8" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Categories Section */}
      {categories.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl p-5"
        >
          {/* Ambient Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          />

          <div className="relative z-10">
            <motion.h3
              className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Explore Topics
            </motion.h3>

            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  variants={itemVariants}
                  className={`w-full flex items-center cursor-pointer justify-between px-4 py-2 rounded-xl transition-all duration-300 transform border-2 ${
                    activeCategory === category.slug
                      ? "bg-indigo-600 text-white shadow-lg border-indigo-600"
                      : "bg-white/70 hover:bg-white/90 text-gray-900 border-gray-100 hover:border-indigo-200"
                  }`}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={`font-semibold text-base text-left ${activeCategory === category.slug ? 'text-white' : 'text-gray-800'}`}>
                    {category.name}
                  </span>
                  <motion.div
                    className={`px-3 py-0.5 rounded-full text-xs font-bold transition-colors ${
                      activeCategory === category.slug
                        ? "bg-white/20 text-white"
                        : "bg-indigo-500/10 text-indigo-700"
                    }`}
                    animate={activeCategory === category.slug ? { scale: [1, 1.05, 1] } : {}}
                    // FIX APPLIED HERE: Added type: "tween"
                    transition={{ type: "tween", duration: 0.5, repeat: Infinity }} 
                  >
                    {category.count}
                  </motion.div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-xl p-5"
        >
          {/* Ambient Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          />

          <div className="relative z-10">
            <motion.h3
              className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Clock className="w-5 h-5 text-gray-500" />
              Latest Reads
            </motion.h3>

            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <motion.div
                    variants={itemVariants}
                    className="group relative flex gap-4 items-start rounded-xl bg-white/50 border border-gray-200/50 hover:border-gray-300 shadow-sm hover:shadow-md transition-all cursor-pointer p-3"
                    whileHover={{ scale: 1.01 }}
                  >
                    {/* Image (Core Component) */}
                    <motion.div
                      className="relative overflow-hidden rounded-xl w-14 h-14 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
                      />
                    </motion.div>

                    {/* Content (Title/List Core Components) */}
                    <div className="flex-1 min-w-0 pt-1">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500/80 mt-1 font-medium">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Trending Posts Section */}
      {trendingPosts.length > 0 && (
        <motion.div
          variants={itemVariants}
          // Gradient background for visual distinction
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50/60 to-white/40 backdrop-blur-xl border-2 border-red-200/40 shadow-xl p-5"
        >
          {/* Ambient Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          />

          <div className="relative z-10">
            <motion.h3
              className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-red-200 pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-5 h-5 text-red-500" />
              </motion.div>
              Trending Now
            </motion.h3>

            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {trendingPosts.map((post, idx) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <motion.div
                    variants={itemVariants}
                    className="group relative flex items-center gap-4 rounded-xl bg-white/50 border border-red-200/50 hover:border-red-400 shadow-sm transition-all cursor-pointer p-3 hover:bg-red-50/50"
                    whileHover={{ scale: 1.01 }}
                  >
                    {/* Trending Badge (Core Component) - now on the left */}
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-extrabold text-white text-base shadow-md"
                      animate={{ scale: [1, 1.05, 1] }}
                      // FIX APPLIED HERE: Added type: "tween"
                      transition={{ type: "tween", duration: 2, repeat: Infinity }} 
                    >
                      {idx + 1}
                    </motion.div>

                    {/* Content (Title/List Core Components) */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-600/70 mt-1 font-medium">
                        {post.readTime ? `${post.readTime} min read` : "Read more"}
                      </p>
                    </div>

                    {/* Arrow (Spatial relationship change: moved from inner flex to align with the badge) */}
                    <motion.div
                      className="flex-shrink-0 self-center"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-5 h-5 text-red-500" />
                    </motion.div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}