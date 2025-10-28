"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, GalleryHorizontal, ShoppingBag, Clock, Shirt, Leaf } from "lucide-react"; // Added Calendar, User

// ⬅️ NEW: Import BlogOverlay (assuming path)
import BlogOverlay from "../../../../components/common/BlogOverlay"; 

// ⬅️ NEW: Define the structure BlogOverlay expects (from your previous component)
interface BlogOverlayData {
  id: string
  title: string
  excerpt: string // We will use GalleryItem.description for this
  content?: string // We won't have this, so it will be undefined
  imageUrl: string // We will use the first slide's URL
  author: string // We will use GalleryItem.client for this
  publishedAt: string // Will be a placeholder date
  category: string // Will be the client name
  readTime?: number
  tags?: string[]
}

// --------------------------------------------------------
// 1. DATA STRUCTURE (RETAINED)
// --------------------------------------------------------

export type SlideImage = {
  id: string;
  url: string;
  caption: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  client: string; 
  description: string; 
  slides: SlideImage[]; 
  icon: React.ElementType; 
};

export type OurGallerySectionProps = {
  headline?: string;
  subHeadline?: string;
  galleryItems?: GalleryItem[];
};

// ... (DEFAULT_GALLERY_ITEMS remains the same)
const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  // ... (Data remains the same as previous iteration)
  {
    id: "g1",
    title: "Luxury Watch E-boutique Launch",
    client: "Watchhaus Co.",
    description: "A headless e-commerce build focused on premium, fluid UX and high-security payment gateways.",
    slides: [
      { id: '1a', url: "https://images.unsplash.com/photo-1680810897186-372717262131?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8THV4dXJ5JTIwV2F0Y2glMjBFLWJvdXRpcXVlJTIwTGF1bmNofGVufDB8fDB8fHww&auto=format&fit=crop&w=1400&q=80", caption: "Storefront UX" },
      { id: '1b', url: "https://images.unsplash.com/photo-1526743655626-e3d757b13d61?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8THV4dXJ5JTIwV2F0Y2glMjBFLWJvdXRpcXVlJTIwTGF1bmNofGVufDB8fDB8fHww&auto=format&fit=crop&w=1400&q=80", caption: "Backend Integration" },
      { id: '1c', url: "https://images.unsplash.com/photo-1585679113986-222f4ce0065b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fEx1eHVyeSUyMFdhdGNoJTIwRS1ib3V0aXF1ZSUyMExhdW5jaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1400&q=80", caption: "Secure Checkout" },
    ],
    icon: Clock,
  },
  {
    id: "g2",
    title: "Mobile-First Fashion Retail App",
    client: "StyleSphere",
    description: "A sleek, performance-driven mobile application integrating AI recommendations and AR try-on features.",
    slides: [
      { id: '2a', url: "https://images.unsplash.com/photo-1570293632597-cf4b20f3a775?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TW9iaWxlLUZpcnN0JTIwRmFzaGlvbiUyMFJldGFpbCUyMEFwcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1400&q=80", caption: "Mobile Browsing" },
      { id: '2b', url: "https://images.unsplash.com/photo-1592179900359-06f0ea0b0c57?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fE1vYmlsZS1GaXJzdCUyMEZhc2hpb24lMjBSZXRhaWwlMjBBcHB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1400&q=80", caption: "AR Feature" },
      { id: '2c', url: "https://images.unsplash.com/photo-1604028879715-9fe3a9eb33e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fE1vYmlsZS1GaXJzdCUyMEZhc2hpb24lMjBSZXRhaWwlMjBBcHB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1400&q=80", caption: "Personalized Feed" },
    ],
    icon: Shirt,
  },
  {
    id: "g3",
    title: "Sustainable Goods Subscription Portal",
    client: "Eco-Essentials",
    description: "Built-in recurring order management and transparent environmental reporting for loyalty and growth.",
    slides: [
      { id: '3a', url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80", caption: "Subscription Dashboard" },
      { id: '3b', url: "https://images.unsplash.com/photo-1719825523711-eda3221c111c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fFN1c3RhaW5hYmxlJTIwR29vZHMlMjBTdWJzY3JpcHRpb24lMjBQb3J0YWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1400&q=80", caption: "Dynamic Pricing" },
      { id: '3c', url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80", caption: "Impact Reporting" },
    ],
    icon: Leaf,
  },
];

const DEFAULT_GALLERY_SECTION_PROPS: OurGallerySectionProps = {
  headline: "OUR E-COMMERCE PORTFOLIO",
  subHeadline: "See the latest impactful projects engineered for digital sales success.",
  galleryItems: DEFAULT_GALLERY_ITEMS,
};

// ---- Motion Variants (Retained) ----
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
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

const imageVariants: Variants = {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } }
};


// --------------------------------------------------------
// 2. MAIN SECTION COMPONENT
// --------------------------------------------------------

export function OurGallery({
  headline = DEFAULT_GALLERY_SECTION_PROPS.headline,
  subHeadline = DEFAULT_GALLERY_SECTION_PROPS.subHeadline,
  galleryItems = DEFAULT_GALLERY_SECTION_PROPS.galleryItems,
}: OurGallerySectionProps) {
  
  const [activeIndex, setActiveIndex] = useState(0); 
  const [slideIndex, setSlideIndex] = useState(0); 

  // ⬅️ NEW STATE for Overlay
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayData, setOverlayData] = useState<BlogOverlayData | null>(null);

  const activeItem = galleryItems![activeIndex];
  const activeSlide = activeItem.slides[slideIndex];


  // AUTO-SWITCHING EFFECT (Cycles through images of the active project)
  useEffect(() => {
    // Reset slide index when the active project changes
    setSlideIndex(0); 

    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => 
        (prevIndex + 1) % activeItem.slides.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [activeIndex, activeItem.slides.length]);


  // Determine content side: 0 (Right), 1 (Left), 2 (Right), etc.
  const contentSide = activeIndex % 2 === 0 ? 'right' : 'left';

  // FIX: Define padding to push content towards the center
  const textPadding = contentSide === 'right' ? 'pl-8 lg:pl-0 pr-8 lg:pr-12' : 'pr-8 lg:pr-0 pl-8 lg:pl-12';
  
  const gradientDirection = contentSide === 'right' ? 'bg-gradient-to-l' : 'bg-gradient-to-r';
  const overlayPosition = contentSide === 'right' ? 'right-0' : 'left-0';
  const textAlignment = contentSide === 'right' ? 'items-end text-right' : 'items-start text-left';
  const textContainerMargin = contentSide === 'right' ? 'ml-auto' : 'mr-auto'; // Push the content container to the correct side


  // Function to handle project selection
  const handleProjectSelect = (index: number) => {
      setActiveIndex(index);
  }

  // ⬅️ NEW: Handlers for the Overlay
  const handleOpenOverlay = (item: GalleryItem) => {
      // Map the GalleryItem to the BlogOverlayData structure
      const mappedData: BlogOverlayData = {
          id: item.id,
          title: item.title,
          excerpt: item.description,
          imageUrl: item.slides[0].url, // Use the first slide image
          author: item.client, // Use client as author
          publishedAt: new Date().toISOString(), // Placeholder date
          category: item.client, // Use client as category
          // Optional fields set to default/null
          content: "Detailed project breakdown and implementation strategy...",
          readTime: 5,
          tags: item.client.split(' ').map(c => c.toLowerCase()),
      }
      setOverlayData(mappedData);
      setIsOverlayOpen(true);
  }

  const handleCloseOverlay = () => {
      setIsOverlayOpen(false);
      setOverlayData(null);
  }


  return (
    <>
      <motion.section
        className="relative w-full py-24 md:py-36 bg-gradient-to-tl from-gray-300 via-gray-600 to-gray-900 overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Animated background glows (retained) */}
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
          {/* Section Header (Retained) */}
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
            <motion.div variants={textVariants} className="inline-block mb-6">
              <span
                className="px-4 py-2 bg-gray-700/60 border border-gray-600/70 rounded-full text-sm font-medium text-gray-200 backdrop-blur-sm flex items-center"
              >
                <GalleryHorizontal className="w-4 h-4 mr-2" /> Featured Projects
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-black mb-6 leading-[0.95] tracking-tighter"
              variants={textVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-300">
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

          {/* 3. MAIN PROJECT DISPLAY (Image and Permanent Overlay Content) */}
          <motion.div 
              className="relative w-full h-[500px] sm:h-[650px] rounded-2xl border border-neutral-700/60 shadow-2xl overflow-hidden group"
              variants={textVariants}
          >
              {/* Image Area (CORE COMPONENT) - Cycles through slides */}
              <motion.div
                  key={activeItem.id + activeSlide.id} 
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0"
              >
                  <Image
                      src={activeSlide.url} 
                      alt={`${activeItem.title} - ${activeSlide.caption}`}
                      fill
                      className="object-cover" 
                      priority 
                  />
              </motion.div>
              
              {/* 5. PERMANENT CONTENT OVERLAY - Gradient and Text */}
              <div className={`
                  absolute top-0 bottom-0 z-10 flex p-8 sm:p-12 
                  ${overlayPosition} w-full lg:w-3/5 ${gradientDirection} from-black/90 via-black/50 to-transparent
              `}>
                  {/* Inner Content Container - Uses dynamic margin and padding for alignment */}
                  <div className={`flex flex-col justify-center w-full max-w-xl ${textAlignment} ${textContainerMargin} ${textPadding}`}>
                      
                      {/* Client Tag (CORE COMPONENT) */}
                      <span className="inline-block px-4 py-1 mb-3 text-sm font-semibold uppercase tracking-wider rounded-full bg-neutral-800 text-gray-300 border border-neutral-700 w-fit">
                          Client: {activeItem.client}
                      </span>

                      {/* Title (CORE COMPONENT) */}
                      <h3 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                          {activeItem.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-lg text-neutral-300 mb-8 font-light max-w-sm">
                          {activeItem.description}
                      </p>

                      {/* View Project Details Link (CORE COMPONENT) - MODIFIED TO TRIGGER OVERLAY */}
                      <button 
                        onClick={() => handleOpenOverlay(activeItem)} // ⬅️ CALL HANDLER
                        className={`
                            text-md font-semibold text-gray-300 flex items-center transition-colors duration-300 hover:text-white cursor-pointer w-fit 
                            ${contentSide === 'right' ? 'self-end flex-row-reverse' : 'self-start'} // ⬅️ ADD CURSOR POINTER
                        `}
                      >
                        View Project Details
                        <ArrowRight
                          className={`w-5 h-5 transition-transform duration-300 ${contentSide === 'right' ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'}`}
                          strokeWidth={2.5}
                        />
                      </button>
                  </div>
              </div>
              
              {/* 4. SHOP NOW BUTTON - HOVER OVERLAY (Appears on image hover) */}
              <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none"
              >
                  <Link href={`/shop?project=${activeItem.id}`} 
                      className="inline-flex items-center justify-center px-8 py-4 text-xl font-extrabold tracking-wide rounded-full bg-white/20 text-white border-4 border-white/80 hover:bg-white/40 hover:text-white transition-all duration-300 cursor-pointer shadow-2xl backdrop-blur-sm pointer-events-auto"
                  >
                      <ShoppingBag className="w-6 h-6 mr-3" />
                      SHOP NOW
                  </Link>
              </motion.div>
              
              {/* Slide Indicators for the CURRENTLY ACTIVE PROJECT's images (Retained) */}
              <div className={`absolute bottom-6 z-30 flex gap-3 ${contentSide === 'right' ? 'left-12' : 'right-12'}`}>
                  {activeItem.slides.map((_, index) => (
                      <div
                          key={index}
                          className={`
                              w-2 h-2 rounded-full transition-all duration-300
                              ${index === slideIndex ? 'bg-gray-300 w-6' : 'bg-neutral-600 hover:bg-neutral-400'}
                          `}
                          aria-label={`Project image ${index + 1}`}
                      />
                  ))}
              </div>
          </motion.div>
          
          {/* 5. PROJECT TABS (User control to switch projects) - ENHANCED UI (Retained) */}
          <div className="flex flex-wrap justify-center mt-12 gap-4">
              {galleryItems!.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeItem.id;

                  return (
                      <motion.button
                          key={item.id}
                          onClick={() => handleProjectSelect(index)}
                          // ENHANCED BUTTON UI
                          className={`
                              px-6 py-3 rounded-full text-sm cursor-pointer font-semibold transition-all duration-300 flex items-center 
                              shadow-2xl 
                              ${
                                  isActive
                                      // Active state: Light shining gray background with dark text
                                      ? 'bg-gray-200 text-gray-900 border border-gray-300 scale-[1.05] shadow-[0_0_20px_rgba(255,255,255,0.4)]' // White glow effect
                                      // Inactive state: Dark translucent background with light shining gray text
                                      : 'bg-neutral-800/60 text-gray-300 border border-neutral-700/80 shadow-inner shadow-black/50 hover:bg-neutral-700/80 hover:text-white'
                              }
                          `}
                          whileHover={{ 
                              scale: isActive ? 1.05 : 1.02,
                              // Subtle lift and shadow on hover
                              boxShadow: isActive ? "0 0 25px rgba(255,255,255,0.6)" : "0 8px 15px rgba(0,0,0,0.4), 0 0 10px rgba(100,100,100,0.2)"
                          }}
                          whileTap={{ scale: 0.98 }}
                      >
                          <Icon className="w-5 h-5 mr-2" />
                          {item.client}
                      </motion.button>
                  );
              })}
          </div>
        </div>
      </motion.section>
      
      {/* ⬅️ NEW: BlogOverlay Component */}
      <BlogOverlay
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        blogData={overlayData}
      />
    </>
  );
}

export default OurGallery;