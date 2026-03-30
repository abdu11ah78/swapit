"use client";

import { motion } from "framer-motion";
import { OfferDto } from "@/features/offers/offers.api";

type Props = {
  offers: OfferDto[];
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  onCounter: (offerId: string) => void;
  isUpdating: boolean;
};

export function OffersList({
  offers,
  onAccept,
  onReject,
  onCounter,
  isUpdating,
}: Props) {
  if (offers.length === 0) {
    return (
      <p className="text-slate-500 font-bold">
        No offers found. Place one from an item detail page.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-black text-slate-400">
                Offer {offer.id}
              </p>
              <p className="text-sm font-black mt-1">Trade: {offer.tradeId}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-[#4d7c0f]">
                {offer.offeredLtp} LTP
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {offer.status}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              disabled={isUpdating}
              onClick={() => onAccept(offer.id)}
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase disabled:opacity-60"
            >
              Accept
            </button>
            <button
              disabled={isUpdating}
              onClick={() => onReject(offer.id)}
              className="px-3 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase disabled:opacity-60"
            >
              Reject
            </button>
            <button
              disabled={isUpdating}
              onClick={() => onCounter(offer.id)}
              className="px-3 py-1 rounded-lg bg-[#115e59] text-white text-[10px] font-black uppercase disabled:opacity-60"
            >
              Counter
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
