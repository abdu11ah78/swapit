"use client"

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion'; 

// --- 1. CORE DATA TYPES ---
export type AboutHeroProps = {
  mainHeadline: string;
  subHeadline: string;
  ctaText: string;
  ctaLink: string;
  backgroundImageUrl: string;
};

// Default props
const DEFAULT_ABOUT_HERO_PROPS: AboutHeroProps = {
  mainHeadline: "OUR VISION: THE FUTURE OF COMMERCE",
  subHeadline: "Pioneering next-gen solutions for seamless, intelligent, and interconnected marketplaces.",
  ctaText: "LEARN MORE ABOUT US",
  ctaLink: "/about/details",
  backgroundImageUrl: "https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500", 
};

// --- 2. FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const floatingVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// --- 3. THE COMPONENT ---
export function HeroSection({
  mainHeadline = DEFAULT_ABOUT_HERO_PROPS.mainHeadline,
  subHeadline = DEFAULT_ABOUT_HERO_PROPS.subHeadline,
  ctaText = DEFAULT_ABOUT_HERO_PROPS.ctaText,
  backgroundImageUrl = DEFAULT_ABOUT_HERO_PROPS.backgroundImageUrl,
}: Omit<AboutHeroProps, 'ctaLink'>) {

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* Background Image Container - Full height */}
      <div className="absolute inset-0">
          <Image
            src={backgroundImageUrl}
            alt="Image illustrating company's work and ethos"
            fill
            priority
            className="object-cover"
            style={{ filter: "brightness(0.7) contrast(1.2)" }} 
          />
          
          {/* LEFT TO RIGHT GRADIENT - Strong left fade for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* FLOATING DECORATIVE ELEMENTS */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-white/10 rounded-full"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
        className="absolute bottom-1/3 right-1/3 w-20 h-20 border-2 border-white/5 rounded-full"
      />

      {/* CONTENT PANEL - Pushed to bottom left, transparent background */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-20 flex items-end justify-start pb-60 md:pb-30 pl-6 md:pl-16 lg:pl-24" 
      >
        <motion.div
          className="relative max-w-xl w-full text-left space-y-15"
          variants={itemVariants}
        >
          {/* Decorative accent line */}
          <motion.div 
            className="w-12 h-0.5 bg-white/80"
            variants={itemVariants}
          />

          {/* Main Headline - Smaller, cleaner */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight"
            variants={itemVariants}
            style={{ textShadow: '2px 2px 20px rgba(0, 0, 0, 0.8)' }}
          >
            {mainHeadline}
          </motion.h1>

          {/* Sub Headline - Compact */}
          <motion.p
            className="text-base sm:text-lg text-white/90 leading-relaxed font-light max-w-md"
            variants={itemVariants}
            style={{ textShadow: '1px 1px 10px rgba(0, 0, 0, 0.8)' }}
          >
            {subHeadline}
          </motion.p>

          {/* CTA Button - Glass effect, floating */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                });
              }}
              whileHover={{ 
                scale: 1.08, 
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-md text-white 
                         font-bold py-3 px-8 rounded-full text-xs uppercase tracking-[0.25em] 
                         shadow-lg hover:bg-white/10 transition-all duration-300
                         border border-white/30 cursor-pointer"
            >
              {ctaText}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-white/50 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}