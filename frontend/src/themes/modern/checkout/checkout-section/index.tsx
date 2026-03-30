"use client"

import { useAppContext } from "@/context/AppContext"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Check, Truck, ShieldCheck, Eye, Wallet, Sparkles, AlertCircle, Gavel, Cpu } from "lucide-react"
import toast from 'react-hot-toast'

interface TradeLogistics {
  fullName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

type LogisticsField = keyof TradeLogistics

export function TradeConfirmationPage() {
  const { wallet, removeFromWallet, updateQuantity, clearWallet } = useAppContext()
  const [step, setStep] = useState<"assets" | "logistics" | "escrow" | "validate">("assets")
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToGovernance, setAgreedToGovernance] = useState(false)

  const [logistics, setLogistics] = useState<TradeLogistics>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })

  const subtotal = wallet.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const networkFee = subtotal > 1000 ? 0 : 25
  const governanceFee = subtotal * 0.05
  const totalLTC = subtotal + networkFee + governanceFee

  const steps = [
    { id: "assets", label: "Asset Audit", icon: Wallet },
    { id: "logistics", label: "Node Logistics", icon: Truck },
    { id: "escrow", label: "Escrow Setup", icon: ShieldCheck },
    { id: "validate", label: "Final Validation", icon: Eye },
  ]

  const handleNext = () => {
    if (step === "assets") {
      if (wallet.length === 0) {
        toast.error("No assets detected in terminal.")
        return
      }
      setStep("logistics")
    } else if (step === "logistics") {
      setStep("escrow")
    } else if (step === "escrow") {
      setStep("validate")
    }
  }

  const handleBack = () => {
    if (step === "validate") setStep("escrow")
    else if (step === "escrow") setStep("logistics")
    else if (step === "logistics") setStep("assets")
  }

  const finalizeTrade = async () => {
    setIsLoading(true)
    setTimeout(() => {
      toast.success("Protocol handshake successful. Trade pending validation.")
      clearWallet()
      setStep("assets")
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 md:pt-32 pb-20 selection:bg-indigo-500/30">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="trade-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trade-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Secure Protocol Protocol</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Trade Terminal</h1>
          <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Verifying multi-node asset swap</p>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-start justify-between mb-20 gap-4">
          {steps.map((s, idx) => {
            const stepIndex = steps.findIndex((x) => x.id === step)
            const isActive = s.id === step
            const isCompleted = idx < stepIndex
            const Icon = s.icon

            return (
              <div key={s.id} className="flex-1 flex flex-col items-center group">
                <div className="flex items-center w-full mb-4">
                  <motion.div
                    className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${isActive
                        ? "bg-indigo-600 border-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                        : isCompleted
                          ? "bg-slate-800 border-indigo-500 text-indigo-400"
                          : "bg-slate-900 border-slate-800 text-slate-600"
                      }`}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </motion.div>
                  {idx < steps.length - 1 && (
                    <div className={`h-[1px] flex-1 mx-2 ${isCompleted ? "bg-indigo-500" : "bg-slate-800"}`} />
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-center ${isActive ? "text-white" : "text-slate-600"}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Logic */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === "assets" && (
                <motion.div
                  key="assets"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="p-10 rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl border border-slate-800">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Asset Synchronization</h2>
                    {wallet.length === 0 ? (
                      <div className="text-center py-20">
                        <AlertCircle className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-500 uppercase font-black text-xs tracking-widest">No signals detected</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {wallet.map((item) => (
                          <div key={item.id} className="flex items-center gap-6 p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800">
                              <Image src={item.imageUrl} alt={item.name} fill className="object-cover grayscale" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Asset ID: {item.id.slice(0, 8)}</h4>
                              <h3 className="text-lg font-bold uppercase tracking-tight">{item.name}</h3>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-black text-indigo-400">{item.price} LTC</div>
                              <div className="text-[10px] font-black text-slate-600 mt-1 uppercase">Unit Count: {item.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === "logistics" && (
                <motion.div
                  key="logistics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-10 rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl border border-slate-800"
                >
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Logistics Routing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(Object.keys(logistics) as LogisticsField[]).map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{field.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                          type="text"
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium focus:border-indigo-500 transition-all outline-none"
                          placeholder={`Enter ${field}...`}
                          value={logistics[field]}
                          onChange={(e) => setLogistics({ ...logistics, [field]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === "escrow" && (
                <motion.div
                  key="escrow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl border border-slate-800 text-center"
                >
                  <ShieldCheck className="w-20 h-20 text-indigo-500 mx-auto mb-8 animate-pulse" />
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">LTC Escrow protocol</h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto mb-10 leading-relaxed uppercase tracking-widest font-bold">
                    Your assets will be held in a secure decentralized escrow. LT Coins are only released upon mutually verified logistics handshake.
                  </p>
                  <div className="p-8 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 inline-block">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Protocol Fee Locked</div>
                    <div className="text-4xl font-black">{governanceFee.toFixed(0)} LTC</div>
                  </div>
                </motion.div>
              )}

              {step === "validate" && (
                <motion.div
                  key="validate"
                  className="space-y-6"
                >
                  <div className="p-10 rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl border border-slate-800">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Final Verification</h2>
                    <div className="space-y-6">
                      <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Node Coordinates</div>
                        <div className="text-sm font-bold">{logistics.fullName}</div>
                        <div className="text-xs text-slate-400 mt-1">{logistics.street}, {logistics.city}</div>
                      </div>
                      <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Escrow Status</div>
                          <div className="text-sm font-black text-green-400 uppercase tracking-widest">Awaiting Flash Release</div>
                        </div>
                        <Cpu className="text-indigo-500" size={24} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <div className="p-8 rounded-[3rem] bg-indigo-600 text-white shadow-[0_20px_50px_rgba(99,102,241,0.3)]">
              <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Consolidated Trade Power</div>
              <div className="text-5xl font-black tracking-tighter mb-10">{totalLTC.toFixed(0)} LTC</div>

              <div className="space-y-4 pb-10 border-b border-white/20">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Gross Asset Value</span>
                  <span>{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Network Fee</span>
                  <span>{networkFee}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Governance Fee</span>
                  <span>{governanceFee.toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {step !== "validate" ? (
                  <button
                    onClick={handleNext}
                    className="w-full py-5 bg-white text-indigo-600 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    Proceed Phase <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={finalizeTrade}
                    disabled={isLoading}
                    className="w-full py-5 bg-indigo-950 text-white rounded-full font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all"
                  >
                    {isLoading ? "Synchronizing..." : "Finalize Protocol Trade"} <Gavel size={14} />
                  </button>
                )}

                {step !== "assets" && (
                  <button
                    onClick={handleBack}
                    className="w-full py-4 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Backtrack Phase
                  </button>
                )}
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={18} className="text-indigo-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Protocol Guard</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">
                All trades are encrypted with 256-bit AES protocol. Trust score impact: <span className="text-white">+12 pts on success</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}