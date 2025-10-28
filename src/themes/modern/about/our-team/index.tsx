"use client"

import React, { useState } from "react";
import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";

// ... (Type definitions and DEFAULT_TEAM_MEMBERS remain the same)
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
};

export type TeamSectionProps = {
  headline?: string;
  subHeadline?: string;
  members: TeamMember[];
};

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "CEO & Founder",
    imageUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZW1wbG95ZWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    bio: "A visionary leader with over 15 years in digital transformation and market innovation, dedicated to building connected commerce ecosystems.",
  },
  {
    id: "2",
    name: "Bob Williams",
    role: "CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGVtcGxveWVlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
    bio: "Responsible for all technological aspects, Bob leads our engineering teams in developing scalable, secure, and cutting-edge platforms.",
  },
  {
    id: "3",
    name: "Carol Davis",
    role: "Head of Marketing",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW1wbG95ZWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    bio: "An expert in global market strategy, Carol drives brand awareness and product adoption through data-informed creative campaigns.",
  },
  {
    id: "4",
    name: "David Brown",
    role: "Lead Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZW1wbG95ZWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    bio: "David ensures our codebase is robust and efficient, overseeing the development and deployment of new features and microservices.",
  },
];

const DEFAULT_TEAM_SECTION_PROPS: TeamSectionProps = {
  headline: "MEET OUR VISIONARIES",
  subHeadline:
    "Dedicated to innovation and excellence, our diverse team drives the future of commerce.",
  members: DEFAULT_TEAM_MEMBERS,
};

// ---- Motion Variants ----
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut", staggerChildren: 0.15 },
  },
};

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

const memberCardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const bioOverlayVariants: Variants = {
    initial: { opacity: 0, y: "60%" },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: "60%", transition: { duration: 0.3 } },
};


// ---- Component ----
export function TeamSection({
  headline = DEFAULT_TEAM_SECTION_PROPS.headline,
  subHeadline = DEFAULT_TEAM_SECTION_PROPS.subHeadline,
  members = DEFAULT_TEAM_SECTION_PROPS.members,
}: TeamSectionProps) {
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

  return (
    <motion.section
      className="relative w-full py-24 md:py-36 bg-gradient-to-b from-gray-800 via-gray-900 to-black overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
     {/* Animated background glows */}
        <motion.div
        animate={{ rotate: 360, opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-gray-400/50 via-gray-500/50 to-transparent rounded-full blur-3xl mix-blend-screen"
        />

        <motion.div
        animate={{ rotate: -360, opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-gray-400/50 via-gray-500/50 to-transparent rounded-full blur-3xl mix-blend-screen"
        />

        <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-gray-400/40 via-gray-500/40 to-transparent rounded-full blur-3xl mix-blend-screen"
        />


      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28">
          <motion.div variants={textVariants} className="inline-block mb-6">
            <span className="px-4 py-2 bg-neutral-700/10 border border-neutral-600/20 rounded-full text-sm font-medium text-neutral-300 backdrop-blur-sm">
              Our Team
            </span>
          </motion.div>

          <motion.h2
            // CHANGE: Reduced headline size from lg:text-8xl to lg:text-6xl
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

        {/* Team Grid (NEW LAYOUT LOGIC) */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
        >
          {members.map((member) => {
            const isHovered = member.id === hoveredMemberId;
            return (
              <motion.div
                key={member.id}
                variants={memberCardVariants}
                onHoverStart={() => setHoveredMemberId(member.id)}
                onHoverEnd={() => setHoveredMemberId(null)}
                whileHover={{
                  y: -8, // Subtle lift
                  scale: 1.01,
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                }}
                className="group relative cursor-pointer h-[400px]" // Fixed height for new structure
              >
                <div className="relative w-full h-full bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden p-0">
                  
                  {/* Glowing border/shadow effect on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 via-blue-500/40 to-purple-500/40 rounded-2xl blur-lg -z-10"
                  />
                  
                  {/* Profile Image (CORE COMPONENT - now larger) */}
                  <div className="relative w-full h-3/5 overflow-hidden">
                    <motion.div
                      animate={{ scale: isHovered ? 1.05 : 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover object-center"
                      />
                    </motion.div>
                    
                    {/* NEW: Rotating Overlay Effect (instead of the ring) */}
                    <motion.div
                      animate={{ rotate: isHovered ? 360 : 0, opacity: isHovered ? 0.6 : 0 }}
                      transition={{
                          duration: 8,
                          repeat: isHovered ? Infinity : 0,
                          ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-transparent mix-blend-overlay"
                    />

                    {/* Gradient to blend image into text section */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-900/90 to-transparent" />
                  </div>

                  {/* Text Container (CORE COMPONENT - now layered at the bottom) */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-center z-10">
                    <motion.h3
                      className="text-2xl font-bold mb-1 text-white"
                      transition={{ duration: 0.3 }}
                    >
                      {member.name}
                    </motion.h3>
                    <p className="text-sm font-medium text-cyan-400 mb-2 tracking-wider uppercase">
                      {member.role}
                    </p>
                    <motion.div
                        initial={{ width: "40%" }}
                        animate={{ width: isHovered ? "100%" : "40%" }}
                        transition={{ duration: 0.4 }}
                        className="h-[2px] bg-gradient-to-r from-transparent via-neutral-500 to-transparent mx-auto mt-3"
                    />
                  </div>
                  
                  {/* Bio Overlay (NEW LAYOUT LOGIC - replaces inline bio) */}
                  <AnimatePresence>
                    {isHovered && member.bio && (
                      <motion.div
                        variants={bioOverlayVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 p-8 rounded-2xl flex items-center bg-neutral-900/95 backdrop-blur-sm z-30"
                      >
                          <p className="text-base text-neutral-300 leading-relaxed text-center">
                              {member.bio}
                          </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default TeamSection;