"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqSectionProps = {
  headline?: string;
  subHeadline?: string;
  faqs?: FaqItem[];
};

// --- Default Data ---
const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "a1",
    question: "What is your core focus as a digital consultancy?",
    answer:
      "Our core focus is on **custom web solutions and AI-driven analytics**. We specialize in building scalable e-commerce platforms and providing proprietary tools to enhance client decision-making and operational efficiency.",
  },
  {
    id: "a2",
    question: "How does your proprietary analytics platform work?",
    answer:
      "The platform utilizes machine learning models to ingest large volumes of business data, identifying key performance drivers and anomalies. It provides predictive insights and real-time operational efficiency metrics through a centralized dashboard.",
  },
  {
    id: "a3",
    question: "What is the scope of your metaverse commerce solution?",
    answer:
      "Our metaverse solution is designed to bridge virtual and physical retail. It includes 3D product visualization, virtual storefront development, and integrated tokenized loyalty systems, allowing for seamless cross-platform commerce.",
  },
  {
    id: "a4",
    question: "Do you serve international clients?",
    answer:
    "Yes. Following our international expansion in 2019, we now operate offices in London and Singapore, enabling us to provide tailored digital strategy and support to a global client base.",
  },
];

const DEFAULT_FAQ_PROPS: FaqSectionProps = {
  headline: "QUESTIONS & CLARIFICATIONS",
  subHeadline:
    "Your most pressing questions answered. Everything you need to know about our services, process, and technology.",
  faqs: DEFAULT_FAQS,
};

// ---- Motion Variants ----
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
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

const answerVariants: Variants = {
  open: {
    opacity: 1,
    height: "auto",
    paddingTop: "1rem", // Add space above answer content
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    paddingTop: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// --- Accordion Item Component ---
const AccordionItem: React.FC<{
  faq: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ faq, isOpen, onToggle }) => {
  return (
    <motion.div
      layout // Enables smooth layout changes with framer-motion
      className="mb-4 rounded-xl border border-neutral-700/60 shadow-lg overflow-hidden bg-neutral-900/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {/* Question Header */}
      <motion.button
        onClick={onToggle}
        className="flex justify-between cursor-pointer items-center w-full p-6 text-left focus:outline-none"
        whileHover={{ backgroundColor: "rgba(38, 38, 38, 0.7)" }} // Darker gray on hover
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
            <HelpCircle className="w-5 h-5 mr-4 text-neutral-400" />
            <span className="text-lg font-semibold text-white">
                {faq.question}
            </span>
        </div>
        
        {/* Chevron Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-neutral-400" />
        </motion.div>
      </motion.button>

      {/* Answer Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            variants={answerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="px-6 pb-6 overflow-hidden"
          >
            <p className="text-md text-neutral-300 border-t border-neutral-700/60 pt-4">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// --- Main Section Component ---
export function FaqSection({
  headline = DEFAULT_FAQ_PROPS.headline,
  subHeadline = DEFAULT_FAQ_PROPS.subHeadline,
  faqs = DEFAULT_FAQ_PROPS.faqs,
}: FaqSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(id === expandedId ? null : id);
  };

  return (
    <motion.section
      className="relative w-full py-24 md:py-36 bg-gradient-to-b from-black via-gray-900 to-gray-800 overflow-hidden" // Changed gradient start to black/gray
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
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
              FAQ
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

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto">
          {faqs!.map((faq) => ( 
            <AccordionItem
              key={faq.id}
              faq={faq}
              isOpen={faq.id === expandedId}
              onToggle={() => toggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default FaqSection;