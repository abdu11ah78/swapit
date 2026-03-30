"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

/**
 * Fix: Use `React.ComponentPropsWithoutRef<typeof motion.nav>` instead of "nav"
 * to avoid conflicts between DOM and Motion event handlers.
 */

function Pagination({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.nav>) {
  return (
    <motion.nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center py-8", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-3 sm:gap-2", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentPropsWithoutRef<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentPropsWithoutRef<typeof motion.a>

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <motion.a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        "relative transition-all duration-300 rounded-xl border-2",
        isActive
          ? "bg-gradient-to-br from-gray-600/20 via-gray-700/20 to-gray-600/20 border-gray-600/40 text-gray-900 font-semibold shadow-lg hover:shadow-xl"
          : "bg-white/40 hover:bg-white/60 border-white/30 hover:border-white/50 text-gray-800 backdrop-blur-sm hover:backdrop-blur-lg",
        "hover:shadow-2xl transition-all duration-300",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.a>) {
  return (
    <motion.div
      whileHover={{ x: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("gap-1 px-3 sm:px-4 flex items-center group", className)}
        {...props}
      >
        <motion.div
          animate={{ x: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronLeftIcon className="w-4 h-4 group-hover:text-gray-900 transition-colors" />
        </motion.div>
        <span className="hidden sm:block group-hover:text-gray-900 transition-colors">
          Previous
        </span>
      </PaginationLink>
    </motion.div>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.a>) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("gap-1 px-3 sm:px-4 flex items-center group", className)}
        {...props}
      >
        <span className="hidden sm:block group-hover:text-gray-900 transition-colors">
          Next
        </span>
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRightIcon className="w-4 h-4 group-hover:text-gray-900 transition-colors" />
        </motion.div>
      </PaginationLink>
    </motion.div>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.span>) {
  return (
    <motion.span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-10 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm hover:bg-white/60 border border-white/30 hover:border-white/50 text-gray-700 transition-all duration-300",
        className
      )}
      whileHover={{ scale: 1.1 }}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </motion.span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
