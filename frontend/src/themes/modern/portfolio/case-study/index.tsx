"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link"; // Assuming you'll link to individual case study pages
import { motion, Variants } from "framer-motion";

export type CaseStudy = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string; // Link to the full case study page
  tags?: string[]; // Optional tags for filtering or categorization
};

export type CaseStudySectionProps = {
  headline?: string;
  subHeadline?: string;
  caseStudies?: CaseStudy[];
};

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs1",
    title: "Revolutionizing E-commerce with AI",
    description: "Developed an AI-powered recommendation engine that boosted conversion rates by 25% for a leading fashion retailer.",
    imageUrl: "https://images.unsplash.com/photo-1556740758-9448f21e06e7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/portfolio/case-study-1",
    tags: ["AI", "E-commerce", "Conversion"],
  },
  {
    id: "cs2",
    title: "Global Brand Expansion via Metaverse",
    description: "Designed and launched a virtual flagship store in the metaverse, enhancing brand presence and customer engagement.",
    imageUrl: "https://images.unsplash.com/photo-1627936160533-5c5e0d720c24?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/portfolio/case-study-2",
    tags: ["Metaverse", "Branding", "VR"],
  },
  {
    id: "cs3",
    title: "Optimizing Supply Chain with Blockchain",
    description: "Implemented a blockchain-based solution for transparent and efficient supply chain management, reducing overhead by 15%.",
    imageUrl: "https://images.unsplash.com/photo-1605792657161-5389659b81b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/portfolio/case-study-3",
    tags: ["Blockchain", "Logistics", "Efficiency"],
  },
  {
    id: "cs4",
    title: "Seamless Omnichannel Retail Experience",
    description: "Integrated online and in-store experiences with a unified platform, leading to a 30% increase in customer loyalty.",
    imageUrl: "https://images.unsplash.com/photo-1542838124-fd2e96d93425?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/portfolio/case-study-4",
    tags: ["Omnichannel", "Retail", "UX/UI"],
  },
];

const DEFAULT_CASE_STUDY_SECTION_PROPS: CaseStudySectionProps = {
  headline: "OUR SUCCESS STORIES",
  subHeadline: "Dive deep into our most impactful projects and discover how we deliver measurable results and innovative solutions.",
  caseStudies: DEFAULT_CASE_STUDIES,
};

// ---- Motion Variants (Reusing existing ones where applicable) ----
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.12 },
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function CaseStudySection({
  headline = DEFAULT_CASE_STUDY_SECTION_PROPS.headline,
  subHeadline = DEFAULT_CASE_STUDY_SECTION_PROPS.subHeadline,
  caseStudies = DEFAULT_CASE_STUDY_SECTION_PROPS.caseStudies,
}: CaseStudySectionProps) {
  return (
    <motion.section
      className="relative w-full py-24 md:py-36 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden" // Slightly lighter background
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Animated background glows (consistent) */}
      <motion.div
        animate={{ rotate: 360, opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-neutral-600/30 to-transparent rounded-full blur-3xl mix-blend-screen"
      />
      <motion.div
        animate={{ rotate: -360, opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-neutral-600/30 to-transparent rounded-full blur-3xl mix-blend-screen"
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28">
          <motion.div variants={textVariants} className="inline-block mb-6">
            <span className="px-4 py-2 bg-neutral-700/10 border border-neutral-600/20 rounded-full text-sm font-medium text-neutral-300 backdrop-blur-sm">
              Case Studies
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-black mb-6 leading-[0.95] tracking-tighter"
            variants={textVariants}
          >
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              {headline}
            </span>
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed"
            variants={textVariants}
          >
            {subHeadline}
          </motion.p>
        </div>

        {/* Case Studies Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={sectionVariants} // Using sectionVariants for stagger, but could use a new container variant too
        >
          {caseStudies!.map((study) => ( // Using ! for TypeScript safety
            <motion.div
              key={study.id}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="group relative bg-neutral-900/50 backdrop-blur-md rounded-xl border border-neutral-700/60 shadow-lg overflow-hidden transition-all duration-300 ease-out cursor-pointer"
            >
              <Link href={study.link} className="block">
                {/* Glowing border/shadow effect on hover */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -inset-1 bg-gradient-to-r from-blue-400/40 via-purple-500/40 to-pink-500/40 rounded-xl blur-lg -z-10"
                />

                {/* Image */}
                <div className="relative w-full h-52 sm:h-64 overflow-hidden">
                  <Image
                    src={study.imageUrl}
                    alt={study.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {study.title}
                  </h3>
                  <p className="text-md text-neutral-300 leading-relaxed mb-4">
                    {study.description}
                  </p>
                  
                  {/* Tags (Optional) */}
                  {study.tags && study.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                          {study.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 text-xs font-medium bg-neutral-800/70 text-neutral-400 rounded-full border border-neutral-700">
                                  {tag}
                              </span>
                          ))}
                      </div>
                  )}

                  {/* Read More Link */}
                  <div className="text-blue-400 font-semibold flex items-center group-hover:text-blue-300 transition-colors duration-300">
                    Read Case Study
                    <svg
                      className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default CaseStudySection;