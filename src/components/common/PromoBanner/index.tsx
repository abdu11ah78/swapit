/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus } from "lucide-react";

export interface PromoBannerProps {
  templateId?: string;
  onClose?: () => void;
  isVisible?: boolean;
}

const PROMO_STORAGE_KEY = "promoBanner_dismissed";

export function PromoBanner({ 
  onClose,
  isVisible = true 
}: PromoBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isHoveringClose, setIsHoveringClose] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner before
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(PROMO_STORAGE_KEY);
      if (dismissed === "true") {
        setIsDismissed(true);
        return;
      }
    }

    // Only show banner if visible prop is true and not dismissed
    if (!isVisible) return;

    // Initial delay of 5 seconds before first appearance
    const initialTimer = setTimeout(() => {
      setShowBanner(true);
    }, 5000);

    let intervalTimer: NodeJS.Timeout;

    const setupInterval = () => {
      // Random interval between 25-35 seconds for subsequent appearances
      const randomDelay = Math.random() * (120000 - 90000) + 90000;
      intervalTimer = setTimeout(() => {
        setShowBanner(true);
        setupInterval(); // Setup next appearance
      }, randomDelay);
    };

    // Setup the interval after initial delay
    const scheduleInterval = setTimeout(() => {
      setupInterval();
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(scheduleInterval);
      clearTimeout(intervalTimer);
    };
  }, [isVisible]);

  const handleClose = () => {
    setShowBanner(false);
    
    // If "Don't show again" is checked, save to localStorage
    if (dontShowAgain) {
      if (typeof window !== "undefined") {
        localStorage.setItem(PROMO_STORAGE_KEY, "true");
        setIsDismissed(true);
      }
    }
    
    if (onClose) onClose();
  };

  const handleDontShowAgain = (checked: boolean) => {
    setDontShowAgain(checked);
    // Immediately save to localStorage when checkbox is toggled
    if (checked && typeof window !== "undefined") {
      localStorage.setItem(PROMO_STORAGE_KEY, "true");
      setIsDismissed(true);
      // Auto-close after a brief delay
      setTimeout(() => {
        setShowBanner(false);
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && !isDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            layoutId="promo-banner-card"
            className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row">
              {/* Content Section - Appears First */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center"
              >
                <span className="inline-block mb-3 px-4 py-1 bg-red-100 text-red-600 font-semibold text-sm rounded-full w-fit">
                  🎉 Special Offer
                </span>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
                  Join our newsletter and get
                </h2>

                <div className="mb-6">
                  <p className="text-4xl sm:text-5xl md:text-6xl font-black text-red-600 mb-2">
                    20% Off
                  </p>
                  <p className="text-base sm:text-lg text-gray-600">
                    your first order
                  </p>
                </div>

                <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  Sign up for our newsletter and receive an exclusive 20% discount on your first purchase. Get the latest updates, offers, and fashion tips straight to your inbox.
                </p>

                {/* Input & Button */}
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm sm:text-base"
                  />
                  <button className="w-full bg-black cursor-pointer text-white font-bold py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-sm sm:text-base">
                    Subscribe
                  </button>
                </div>

                {/* Checkbox */}
                <label className="mt-4 sm:mt-6 flex items-center text-xs sm:text-sm text-gray-600 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => handleDontShowAgain(e.target.checked)}
                    className="w-4 h-4 mr-3 accent-red-600 cursor-pointer"
                  />
                  <span className="group-hover:text-gray-900 transition-colors">Don't show this popup again</span>
                </label>
              </motion.div>

              {/* Image Section - Slides in from behind */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="md:w-2/5 h-48 sm:h-64 md:h-auto relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Promo Offer"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>

              {/* Close Button - Transforms X to Minus on Hover */}
              <motion.button
                onClick={handleClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors z-10"
                aria-label="Close promotional banner"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  onHoverStart={() => setIsHoveringClose(true)}
                  onHoverEnd={() => setIsHoveringClose(false)}
                  className="relative w-6 h-6 flex items-center justify-center"
                >
                  <AnimatePresence mode="wait">
                    {!isHoveringClose ? (
                      <motion.div
                        key="x-icon"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-6 h-6 text-gray-600 hover:text-gray-900" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="minus-icon"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Minus className="w-6 h-6 text-gray-600 hover:text-gray-900" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PromoBanner;