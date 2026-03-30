/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { MOCK_BLOG_POSTS, MOCK_CATEGORIES, MOCK_RECENT_POSTS, MOCK_TRENDING_POSTS } from "../blogData"
import { BlogList } from "../blogsList"
import { BlogSidebar } from "../blogsummaries"

const POSTS_PER_PAGE = 3

export default function BlogPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    let filtered = MOCK_BLOG_POSTS

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleCategorySelect = (slug: string | null) => {
    // The sidebar component needs to manage its own active state since the filtering logic is already here.
    // However, if the sidebar is expected to visually reflect the parent's state,
    // the sidebar's internal logic needs to be updated to use the 'activeCategory' prop.
    // FOR NOW, we just update the client state and let the sidebar call handleCategorySelect.
    setSelectedCategory(selectedCategory === slug ? null : slug)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-2">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blog-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blog-grid)" />
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3">
            Blog & Insights
          </h1>
          <p className="text-gray-600/80 text-lg max-w-2xl mx-auto">
            Discover stories, tips, and insights about web development, design, and business.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Blog List - 2/3 Width */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-6">
              {/* Search Bar */}
              <motion.div
                className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-white/40 shadow-lg p-5 group"
                whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <input
                  type="text"
                  placeholder="Search blogs by title, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-600/50 font-medium outline-none text-lg"
                />
              </motion.div>

              {/* Results Info */}
              {(selectedCategory || searchQuery) && (
                <motion.div
                  className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border-2 border-white/40"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    {selectedCategory && (
                      <p className="text-sm font-semibold text-gray-700">
                        Category: <span className="text-gray-900 font-black">{selectedCategory}</span>
                      </p>
                    )}
                    {searchQuery && (
                      <p className="text-sm font-semibold text-gray-700">
                        Search: <span className="text-gray-900 font-black">"{searchQuery}"</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setSearchQuery("")
                      setCurrentPage(1)
                    }}
                    className="text-xs font-bold px-3 py-1.5 cursor-pointer rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}

              {/* Blog List */}
              {paginatedPosts.length > 0 ? (
                <>
                  <BlogList posts={paginatedPosts} />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      className="flex items-center justify-center gap-3 mt-10 p-6 bg-white/60 rounded-2xl border-2 border-white/40"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 border border-gray-200/50 text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        ← Previous
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <motion.button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-bold cursor-pointer transition-all ${
                              currentPage === page
                                ? "bg-gray-900 text-white shadow-lg"
                                : "bg-white/50 hover:bg-white/70 border border-gray-200/50 text-gray-900"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {page}
                          </motion.button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white/50 cursor-pointer hover:bg-white/70 border border-gray-200/50 text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next →
                      </button>

                      <div className="ml-4 text-sm font-semibold text-gray-700">
                        Page <span className="text-gray-900">{currentPage}</span> of{" "}
                        <span className="text-gray-900">{totalPages}</span>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  className="text-center py-16 p-6 bg-white/60 rounded-2xl border-2 border-white/40"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-lg font-semibold text-gray-600">No blogs found matching your filters.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setSearchQuery("")
                      setCurrentPage(1)
                    }}
                    className="mt-4 text-sm font-bold px-4 py-2 cursor-pointer rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Sidebar - 1/3 Width */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BlogSidebar
              categories={MOCK_CATEGORIES}
              recentPosts={MOCK_RECENT_POSTS}
              trendingPosts={MOCK_TRENDING_POSTS}
              onCategorySelect={handleCategorySelect}
              // activeCategory={selectedCategory} <-- REMOVE THIS LINE
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}