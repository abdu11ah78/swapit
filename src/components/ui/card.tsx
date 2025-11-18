"use client"

import * as React from "react"
import { motion, type HTMLMotionProps, Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | null
  | "modern"
  | "modernOutline"
  | "modernGhost"
  | "modernDestructive"

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  title?: string
  description?: string
  image?: string
  badge?: string
  footerText?: string
  buttonText?: string
  buttonLink?: string
  actions?: { label: string; onClick?: () => void; variant?: ButtonVariant }[]
  variant?: "outlined" | "filled" | "hoverable" | "glass" | "modernOutlined" | "modernFilled" | "modernHoverable" | "modernGlass"
  onAction?: () => void
}

// --- FRAMER VARIANTS ---
const cardMotionVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: "spring", stiffness: 120, damping: 18 },
  },
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  tap: { scale: 0.98 },
}

export function Card({
  className,
  title,
  description,
  image,
  badge,
  footerText,
  buttonText,
  buttonLink,
  actions = [],
  variant = "modernHoverable",
  onAction,
  ...props
}: CardProps) {
  const [hovered, setHovered] = React.useState(false)

  const baseStyles =
    "flex flex-col overflow-hidden rounded-3xl border transition-all shadow-lg backdrop-blur-sm relative"

  const variants: Record<string, string> = {
    // Classic variants (kept for compatibility)
    outlined:
      "border border-neutral-400 bg-white text-black hover:shadow-md",
    filled:
      "bg-black text-white hover:bg-neutral-800 transition-all",
    hoverable:
      "bg-white border border-gray-200 hover:shadow-2xl hover:-translate-y-1 duration-300 text-black",
    glass:
      "bg-white/10 border border-white/30 backdrop-blur-md text-white hover:shadow-lg",
    // Modern variants (dark, neutral-based with dynamic effects)
    modernOutlined:
      "border border-neutral-600 bg-neutral-800/50 text-white hover:bg-neutral-700/70",
    modernFilled:
      "bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-700",
    modernHoverable:
      "bg-neutral-800/50 border border-neutral-600 text-white hover:shadow-2xl hover:-translate-y-2 duration-300",
    modernGlass:
      "bg-neutral-900/20 border border-neutral-500/50 backdrop-blur-lg text-white hover:shadow-xl",
  }

  return (
    <motion.div
      variants={cardMotionVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {/* Dynamic Glow on Hover for Modern Variants */}
      {(variant.startsWith("modern")) && (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-neutral-700/20 to-neutral-600/10 transition-opacity duration-500 rounded-3xl ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {image && (
        <div className="relative w-full h-52 overflow-hidden rounded-t-3xl">
          <Image
            src={image}
            alt={title || "Card image"}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {badge && (
            <span className="absolute top-3 left-3 bg-neutral-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 p-6 relative z-10">
        {title && (
          <h3 className="text-xl font-semibold tracking-tight leading-tight">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-neutral-400">
            {description}
          </p>
        )}

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant || "modern"}
                onClick={action.onClick}
                className="transition-all"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {buttonText && buttonLink && (
          <Button
            variant="modern"
            onClick={onAction}
            className="w-fit mt-3"
            asChild
          >
            <a href={buttonLink}>{buttonText}</a>
          </Button>
        )}
      </div>

      {footerText && (
        <div className="border-t border-neutral-700 mt-auto px-6 py-4 text-sm text-neutral-500 relative z-10">
          {footerText}
        </div>
      )}
    </motion.div>
  )
}

// === Subcomponents (for structured composition) ===
// (Kept similar, with minor dark-mode adjustments for consistency)

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("px-6 pt-6 flex flex-col gap-2", className)}
      {...props}
    />
  )
}

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none text-white", className)}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-neutral-400", className)}
      {...props}
    />
  )
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6 flex flex-col gap-3", className)}
      {...props}
    />
  )
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("border-t border-neutral-700 px-6 py-4 text-sm text-neutral-500", className)}
      {...props}
    />
  )
}
