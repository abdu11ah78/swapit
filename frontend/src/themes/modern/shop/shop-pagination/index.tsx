"use client"

import { motion, Variants } from "framer-motion"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/mpagination"

type ShopPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut", // ✅ Use named easing instead of numeric array
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring", // ✅ Valid type
      stiffness: 120,
      damping: 15,
    },
  },
}

export function ShopPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ShopPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    
    <motion.div
      className="relative w-full py-12 md:py-16 bg-gradient-to-t from-gray-400 to-neutral-300 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pagination-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pagination-grid)" />
        </svg>
      </div>

      {/* Floating Shadow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/3 -left-1/4 w-80 h-80 bg-black/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 w-80 h-80 bg-black/10 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      {/* Accent Lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        {/* Section Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-600/20 backdrop-blur-md border border-gray-600/30 mb-4"
            animate={{
              boxShadow: [
                "0 0 15px rgba(0,0,0,0)",
                "0 0 30px rgba(0,0,0,0.1)",
                "0 0 15px rgba(0,0,0,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              className="w-2 h-2 bg-gray-700/60 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </span>
          </motion.div>
        </motion.div>

        {/* Pagination Component */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Pagination>
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) onPageChange(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* Page numbers */}
              {pages.map((page, index) => (
                <motion.div
                  key={page}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PaginationItem>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange(page)
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </motion.div>
                  </PaginationItem>
                </motion.div>
              ))}

              {/* Ellipsis */}
              {totalPages > 7 && <PaginationEllipsis />}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) onPageChange(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>

        {/* Info Text */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-700/70 font-medium">
            Showing page <span className="font-bold text-gray-800">{currentPage}</span> of{" "}
            <span className="font-bold text-gray-800">{totalPages}</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
