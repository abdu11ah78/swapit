"use client";

import { motion } from "framer-motion";
import { CheckCircle2, SearchX, Truck } from "lucide-react";
import { type TradeDto } from "@/features/trades/trades.api";

type Props = {
  trades: TradeDto[];
  onMarkCompleted: (tradeId: string) => void;
  isUpdating: boolean;
};

export function TradesList({ trades, onMarkCompleted, isUpdating }: Props) {
  if (trades.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-50 shadow-inner">
        <SearchX className="mx-auto text-slate-100 mb-6" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
          No transactions recorded on this node.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {trades.map((trade) => (
        <motion.div
          key={trade.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-[#115e59]/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-[#115e59]/10 transition-all"
        >
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#115e59]/20 group-hover:bg-[#115e59]/5 group-hover:text-[#115e59] transition-all">
              {trade.status === "IN_PROGRESS" ? (
                <Truck size={24} />
              ) : (
                <CheckCircle2 size={24} />
              )}
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Trade {trade.id}
              </h3>
              <p className="text-lg font-black text-[#115e59] uppercase tracking-tighter">
                Item: {trade.itemId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 italic">
              <span className="text-[10px] font-black uppercase tracking-widest">
                {trade.status}
              </span>
            </div>
            {trade.status !== "COMPLETED" && (
              <button
                onClick={() => onMarkCompleted(trade.id)}
                disabled={isUpdating}
                className="px-4 py-2 rounded-xl bg-[#115e59] text-white text-xs font-black uppercase tracking-wider disabled:opacity-60"
              >
                Mark Completed
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
