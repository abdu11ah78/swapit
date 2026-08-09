"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AppraisalWidget } from "./AppraisalWidget";

interface AppraisalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (estimatedValue: number) => void;
  categoryLabel?: string;
  isOwner?: boolean;
  itemId?: string; // If provided, updates item value in database upon success
  initialDescription?: string;
}

export function AppraisalModal({
  isOpen,
  onClose,
  onSuccess,
  categoryLabel = "Motorbike",
  isOwner = false,
  itemId,
  initialDescription = "",
}: AppraisalModalProps) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          >
            {/* Modal Content container to catch clicks */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-[#115e59] hover:bg-slate-50 transition-colors z-[10000]"
              >
                <X size={18} />
              </button>

              {/* Scrollable container for Widget */}
              <div className="max-h-[85vh] overflow-y-auto p-2">
                <AppraisalWidget
                  categoryLabel={categoryLabel}
                  initialDescription={initialDescription}
                  isOwner={isOwner}
                  itemId={itemId}
                  onSuccess={(val) => {
                    onSuccess(val);
                    onClose();
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
