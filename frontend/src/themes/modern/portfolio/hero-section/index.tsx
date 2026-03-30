"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export type PortfolioHeroSectionProps = {
  headline?: string;
  subHeadline?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
};

const DEFAULT_PORTFOLIO_HERO_PROPS: PortfolioHeroSectionProps = {
  headline: "OUR CREATIVE ACHIEVEMENTS",
  subHeadline:
    "Explore a curated selection of our best work, showcasing innovation, design excellence, and strategic impact across various industries.",
  backgroundImage:
    "https://images.unsplash.com/photo-1437419764061-2473afe69fc2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fHBvcnRmb2xpb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500", // Example image
  ctaText: "View All Projects",
  ctaLink: "/portfolio", // Link to your main portfolio page
};

// ---- Motion Variants ----
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.2 },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 },
  },
};

export function HeroSection({
  headline = DEFAULT_PORTFOLIO_HERO_PROPS.headline,
  subHeadline = DEFAULT_PORTFOLIO_HERO_PROPS.subHeadline,
  backgroundImage = DEFAULT_PORTFOLIO_HERO_PROPS.backgroundImage,
  ctaText = DEFAULT_PORTFOLIO_HERO_PROPS.ctaText,
  ctaLink = DEFAULT_PORTFOLIO_HERO_PROPS.ctaLink,
}: PortfolioHeroSectionProps) {
  return (
    <motion.section
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden bg-black"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black opacity-70" />
      </div>

      {/* Animated background glows (consistent with other sections) */}
      <motion.div
        animate={{ rotate: 360, opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-neutral-600/30 to-transparent rounded-full blur-3xl mix-blend-screen z-10"
      />
      <motion.div
        animate={{ rotate: -360, opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-neutral-600/30 to-transparent rounded-full blur-3xl mix-blend-screen z-10"
      />

      <div className="relative z-20 container mx-auto px-6 lg:px-8 max-w-5xl">
        {/* Section Header */}
        <motion.h1
          // CHANGE: Reduced headline size from lg:text-8xl to lg:text-6xl
          className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-black mb-6 leading-tight tracking-tighter"
          variants={textVariants}
        >
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
            {headline}
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed mb-10"
          variants={textVariants}
        >
          {subHeadline}
        </motion.p>

        {/* Call to Action Button */}
        {ctaText && ctaLink && (
          <motion.a
            href={ctaLink}
            variants={ctaVariants}
            className="inline-flex items-center cursor-pointer justify-center px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 ease-out 
                       bg-neutral-800 border border-neutral-700 text-white shadow-xl hover:bg-neutral-700 hover:border-neutral-600 
                       focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-black group"
          >
            {ctaText}
            {/* Subtle arrow on hover */}
            <svg
              className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </motion.a>
        )}
      </div>
    </motion.section>
  );
}

export default HeroSection;