"use client"

import React from "react";
import { motion, Variants } from "framer-motion";

export type Milestone = {
  id: string;
  year: string;
  description: string;
};

export type MilestonesSectionProps = {
  headline?: string;
  subHeadline?: string;
  milestones?: Milestone[];
};

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: "1",
    year: "2015",
    description: "Founded as a digital consultancy firm, specializing in custom web solutions for e-commerce startups.",
  },
  {
    id: "2",
    year: "2017",
    description: "Launched our proprietary AI-powered analytics platform, enhancing client decision-making and operational efficiency.",
  },
  {
    id: "3",
    year: "2019",
    description: "Expanded into international markets, opening offices in London and Singapore to serve a global client base.",
  },
  {
    id: "4",
    year: "2021",
    description: "Achieved Series B funding, accelerating product development and strategic partnerships in cloud infrastructure.",
  },
  {
    id: "5",
    year: "2023",
    description: "Recognized as a top innovator in connected commerce, receiving multiple industry awards for excellence.",
  },
  {
    id: "6",
    year: "2024",
    description: "Introduced our next-gen metaverse commerce solution, bridging virtual and physical retail experiences.",
  },
];

const DEFAULT_MILESTONES_SECTION_PROPS: MilestonesSectionProps = {
  headline: "OUR JOURNEY OF INNOVATION",
  subHeadline: "Charting a course through key achievements and pivotal moments that define our growth.",
  milestones: DEFAULT_MILESTONES,
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

// Variant for timeline items (staggered left/right)
const timelineItemVariants = (isLeft: boolean): Variants => ({
    hidden: { opacity: 0, x: isLeft ? -100 : 100 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    },
});

const dotVariants: Variants = {
    hidden: { scale: 0 },
    visible: { 
        scale: 1, 
        transition: { duration: 0.5, delay: 0.6, ease: "easeOut" } 
    },
};

// ---- Component ----
export function MilestonesSection({
  headline = DEFAULT_MILESTONES_SECTION_PROPS.headline,
  subHeadline = DEFAULT_MILESTONES_SECTION_PROPS.subHeadline,
  milestones = DEFAULT_MILESTONES_SECTION_PROPS.milestones,
}: MilestonesSectionProps) {
  return (
    <motion.section
      className="relative w-full py-24 md:py-36 bg-gradient-to-b from-black via-gray-900 to-gray-800 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Subtle background glows (Matching TeamSection) */}
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
              Our Milestones
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

        {/* Milestones Vertical Timeline */}
        <div className="relative max-w-5xl mx-auto">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-neutral-800 hidden md:block" />

            {/* Iterating over milestones */}
            {milestones!.map((milestone, index) => { 
                const isLeft = index % 2 === 0;

                return (
                    <motion.div
                        key={milestone.id}
                        custom={isLeft}
                        variants={timelineItemVariants(isLeft)}
                        whileInView="visible"
                        initial="hidden"
                        viewport={{ once: true, amount: 0.5 }}
                        className={`relative py-12 flex ${isLeft ? 'md:justify-start justify-center' : 'md:justify-end justify-center'}`}
                    >
                        {/* Timeline Dot (Center on MD+, Hidden on SM) */}
                        <motion.div
                            variants={dotVariants}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-neutral-500 shadow-md shadow-neutral-500/50 hidden md:block"
                        />

                        {/* Milestone Content Card */}
                        <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                            className={`relative w-full md:max-w-[45%] p-6 rounded-2xl bg-neutral-900/50 backdrop-blur-md border border-neutral-700/60 shadow-xl transition-all duration-300 ease-out 
                                ${isLeft ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} text-center`}
                        >
                            {/* Glowing border/shadow effect on hover */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                className="absolute -inset-1 bg-gradient-to-r from-neutral-600/40 via-gray-600/40 to-neutral-600/40 rounded-2xl blur-lg -z-10"
                            />

                            {/* Massive Year (Primary Visual Element) */}
                            <span className={`absolute top-0 text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-t from-neutral-700/10 to-transparent -z-0 
                                ${isLeft ? 'right-0 translate-x-1/4' : 'left-0 -translate-x-1/4'} hidden md:block`}>
                                {milestone.year}
                            </span>
                            
                            {/* Year Title (Visible on all screen sizes) */}
                            <p className={`text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-neutral-400 
                                ${isLeft ? 'md:justify-end' : 'md:justify-start'} flex justify-center w-full relative z-10`}>
                                {milestone.year}
                            </p>
                            
                            {/* Description */}
                            <p className="text-md text-neutral-300 relative z-10">
                                {milestone.description}
                            </p>
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
      </div>
    </motion.section>
  );
}

export default MilestonesSection;