/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image"; // Import Image component for optimized images
import { motion, Variants } from "framer-motion";
import { ShoppingCart, LayoutGrid, Zap, TrendingUp, Cpu, Shield } from "lucide-react";
import BlogOverlay from "../../../../components/common/BlogOverlay";

// Note: For this to work without errors, BlogOverlay expects a blogData prop.
// Since ServiceItem and BlogOverlayData are structurally different,
// we will cast the selectedService to `any` when passing it to BlogOverlay.
// This is a common temporary solution when a single overlay is reused for multiple data types.

export type ServiceItem = {
  id: string;
  icon: React.ElementType; // Icon component from lucide-react
  title: string;
  description: string;
  imageUrl: string; // NEW: Image URL for the card background
};

export type ServiceSectionProps = {
  headline?: string;
  subHeadline?: string;
  services?: ServiceItem[];
};

// UPDATED DEFAULT SERVICES WITH NEW IMAGE URLs
const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "s1",
    icon: ShoppingCart,
    title: "E-commerce Platform Development",
    description:
      "Building scalable online stores using Shopify, WooCommerce, or custom headless solutions for maximum flexibility and performance.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RS1jb2mmZXJjZSUyMFBsYXRmb3JtJTIwRGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: "s2",
    icon: LayoutGrid,
    title: "Omnichannel & Marketplace Integration",
    description:
      "Connecting your online store with physical retail, social media, and marketplaces (Amazon, eBay) for seamless operations.",
    imageUrl: "https://images.unsplash.com/photo-1723489553375-342965f1c4e6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8T21uaWNoYW5uZWwlMjAlMjYlMjBNYXJrZXRwbGFjZSUyMEludGVncmF0aW9ufGVufDB8fDB8fHww&auto=format&fit=fit&q=60&w=500",
  },
  {
    id: "s3",
    icon: Zap,
    title: "Performance & Conversion Optimization",
    description:
      "Focusing on speed, user experience (UX), and funnel analysis to boost conversion rates and reduce cart abandonment.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1661685901503-dd3f9e0f3cfa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHBlcmZvcm1hbmNlJTIwcmV2aWV3fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: "s4",
    icon: TrendingUp,
    title: "Digital Marketing & SEO Strategy",
    description:
      "Driving targeted traffic through e-commerce SEO, paid media campaigns, and data-driven content strategies.",
    imageUrl: "https://images.unsplash.com/photo-1709281847981-73a69aa6f770?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RGlnaXRhbCUyME1hcmtldGluZyUyMCUyNiUyMFNFTyUyMFN0cmF0ZWd5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: "s5",
    icon: Cpu,
    title: "Inventory & ERP System Integration",
    description:
      "Integrating your store with stock management, CRM, and ERP systems for automated inventory and financial control.",
    imageUrl: "https://images.unsplash.com/photo-1556743769-8d7477994b25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8SW52ZW50b3J5JTIwJTI2JTIwRVJQJTIwU3lzdGVtJTIwSW50ZWdyYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: "s6",
    icon: Shield,
    title: "Security & PCI Compliance",
    description:
      "Ensuring your customer data is safe and your platform meets all payment industry standards for secure transactions.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1700830452666-ce1f5f478d21?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFNlY3VyaXR5JTIwJTI2JTIwUENJJTIwQ29tcGxpYW5jZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  },
];

const DEFAULT_SERVICE_SECTION_PROPS: ServiceSectionProps = {
  headline: "E-COMMERCE GROWTH SERVICES",
  subHeadline:
    "From storefront development to conversion strategy, we provide full-stack services engineered for sustained online sales success.",
  services: DEFAULT_SERVICES,
};

// ---- Motion Variants ----
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

// ---- Component ----
export function ServiceSection({
  headline = DEFAULT_SERVICE_SECTION_PROPS.headline,
  subHeadline = DEFAULT_SERVICE_SECTION_PROPS.subHeadline,
  services = DEFAULT_SERVICE_SECTION_PROPS.services,
}: ServiceSectionProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleLearnMore = (service: ServiceItem) => {
    setSelectedService(service);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <motion.section
        // Main background gradient from bottom-left
        className="relative w-full py-24 md:py-36 bg-gradient-to-bl from-gray-300 via-gray-600 to-gray-900 overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Animated background glows */}
        <motion.div
          animate={{ rotate: 360, opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-3xl mix-blend-soft-light"
        />
        <motion.div
          animate={{ rotate: -360, opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-purple-400/30 to-transparent rounded-full blur-3xl mix-blend-soft-light"
        />

        <div className="relative z-10 container mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28">
            <motion.div variants={textVariants} className="inline-block mb-6">
              <span
                className="px-4 py-2 bg-gray-700/60 border border-gray-600/70 rounded-full text-sm font-medium text-gray-200 backdrop-blur-sm"
              >
                Our E-commerce Services
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-black mb-6 leading-[0.95] tracking-tighter"
              variants={textVariants}
            >
              <span className="text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-300">
                {headline}
              </span>
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-300 dark:text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed"
              variants={textVariants}
            >
              {subHeadline}
            </motion.p>
          </div>

          {/* Services Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={sectionVariants}
          >
            {services!.map((service) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="group relative p-8 bg-neutral-900/50 backdrop-blur-md rounded-2xl border border-neutral-700/60 shadow-xl overflow-hidden transition-all duration-300 ease-out"
                >
                  {/* Background Image with Dark Overlay */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Dark Overlay with reduced opacity for visibility */}
                    <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>

                  {/* Glowing border/shadow effect on hover - KEPT vibrant for contrast on the border */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/40 via-purple-500/40 to-pink-500/40 rounded-2xl blur-lg -z-10"
                  />

                  {/* Content (Icon, Title, Description, Link) */}
                  <div className="relative z-10">
                    {/* Icon - CHANGED text-cyan-400 to text-gray-300 */}
                    <div
                      className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-neutral-800/70 border border-neutral-700/80"
                    >
                      <Icon className="w-8 h-8 text-gray-300" />
                    </div>

                    {/* Title - CHANGED group-hover:text-cyan-300 to group-hover:text-white */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-md text-neutral-400 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Learn More Button - UPDATED TO TRIGGER OVERLAY */}
                    <div 
                      onClick={() => handleLearnMore(service)}
                      className="mt-4 text-sm font-semibold text-gray-300 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer group-hover:text-white"
                    >
                      Learn More
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* BlogOverlay Component */}
      {selectedService && (
        <BlogOverlay
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          // FIX APPLIED: Changed prop from 'data' to 'blogData' 
          // and cast to 'any' to handle the structural type mismatch.
          blogData={selectedService as any}
        />
      )}
    </>
  );
}

export default ServiceSection;