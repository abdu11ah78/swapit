"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { motion } from "framer-motion"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="relative"
    >
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-size={size}
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-2 rounded-2xl border-2 bg-white/50 hover:bg-white/70 px-4 py-2.5 text-sm whitespace-nowrap shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-10 data-[size=sm]:h-8 text-gray-900 font-medium hover:border-white/50 relative overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <motion.div
            animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0"
          >
            <ChevronDownIcon className="size-4 text-gray-700/70" />
          </motion.div>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    </motion.div>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <SelectPrimitive.Content
          data-slot="select-content"
          className={cn(
            "bg-white/95 text-gray-900 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl border-2 border-white/40 shadow-2xl backdrop-blur-xl",
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
          )}
          position={position}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            className={cn(
              "p-2",
              position === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </motion.div>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-gray-700/70 px-3 py-2 text-xs font-semibold uppercase tracking-widest", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <SelectPrimitive.Item
        data-slot="select-item"
        className={cn(
          "focus:bg-gradient-to-r focus:from-gray-400/20 focus:to-gray-300/20 focus:text-gray-900 [&_svg:not([class*='text-'])]:text-gray-700/60 relative flex w-full cursor-default items-center gap-3 rounded-xl py-2.5 pr-8 pl-3 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-gray-800 hover:bg-gray-400/15 transition-all duration-200 font-medium",
          className
        )}
        {...props}
      >
        <motion.span
          className="absolute right-3 flex size-4 items-center justify-center"
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <SelectPrimitive.ItemIndicator>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CheckIcon className="size-4 text-gray-800 font-bold" />
            </motion.div>
          </SelectPrimitive.ItemIndicator>
        </motion.span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    </motion.div>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-gradient-to-r from-transparent via-gray-300/40 to-transparent pointer-events-none -mx-1 my-2 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <SelectPrimitive.ScrollUpButton
        data-slot="select-scroll-up-button"
        className={cn(
          "flex cursor-default items-center justify-center py-2 hover:bg-gray-400/10 rounded-lg transition-all",
          className
        )}
        {...props}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronUpIcon className="size-4 text-gray-700/60" />
        </motion.div>
      </SelectPrimitive.ScrollUpButton>
    </motion.div>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <SelectPrimitive.ScrollDownButton
        data-slot="select-scroll-down-button"
        className={cn(
          "flex cursor-default items-center justify-center py-2 hover:bg-gray-400/10 rounded-lg transition-all",
          className
        )}
        {...props}
      >
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDownIcon className="size-4 text-gray-700/60" />
        </motion.div>
      </SelectPrimitive.ScrollDownButton>
    </motion.div>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}