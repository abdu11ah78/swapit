"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Upload, X, Plus, Sparkles, ShieldCheck,
  MapPin, Zap, Info, Gavel, RefreshCw, Cpu
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import toast from 'react-hot-toast'

interface AssetCondition {
  label: string
  value: string
  multiplier: number
}

const CONDITIONS: AssetCondition[] = [
  { label: "Pristine", value: "pristine", multiplier: 1.0 },
  { label: "Near-Mint", value: "near_mint", multiplier: 0.85 },
  { label: "Operational", value: "operational", multiplier: 0.6 },
  { label: "Salvage", value: "salvage", multiplier: 0.2 },
]

export default function ItemCreationTerminal() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    baseValue: "",
    description: "",
    location: "Neo-Tokyo Node",
    condition: "near_mint",
    isBarterEnabled: true,
    isAuctionEnabled: false,
  })

  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; file: File }>>([])
  const [isAiCalculating, setIsAiCalculating] = useState(false)
  const [aiValuation, setAiValuation] = useState<number | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const id = `${Date.now()}-${index}`
          setUploadedImages((prev) => [...prev, { id, url: event.target?.result as string, file }])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const simulateAiValuation = () => {
    if (!formData.name || !formData.category) {
      toast.error("Enter name and category for AI audit")
      return
    }
    setIsAiCalculating(true)
    setTimeout(() => {
      const base = parseInt(formData.baseValue) || 500
      const multi = CONDITIONS.find(c => c.value === formData.condition)?.multiplier || 1
      setAiValuation(base * multi * (0.9 + Math.random() * 0.2))
      setIsAiCalculating(false)
      toast.success("AI Valuation Protocol Complete")
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Listing deployed to global trade grid")
    router.push("/admin/products/list")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 md:pt-32 px-4 md:px-8 pb-20 selection:bg-indigo-500/30">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent)]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/products/list" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 uppercase text-[10px] font-black tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Archive Control
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={16} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Inventory Uplink</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Post New Asset</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Metadata */}
          <div className="lg:col-span-2 space-y-10">
            {/* Visual Input */}
            <div className="p-10 rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-tighter">High-Res Documentation</h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{uploadedImages.length}/5 Slots</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {uploadedImages.map((img) => (
                    <motion.div
                      key={img.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-[2rem] overflow-hidden border border-slate-700 bg-slate-800"
                    >
                      <Image src={img.url} alt="asset preview" fill className="object-cover grayscale" />
                      <button
                        type="button"
                        onClick={() => setUploadedImages(prev => prev.filter(i => i.id !== img.id))}
                        className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {uploadedImages.length < 5 && (
                  <label className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group">
                    <div className="p-4 rounded-full bg-slate-800/50 group-hover:bg-indigo-500/20 transition-colors">
                      <Plus className="w-6 h-6 text-slate-600 group-hover:text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-400">Inject Frame</span>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Intellectual Data */}
            <div className="p-10 rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl border border-slate-800 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Asset Designation</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-sm font-black focus:border-indigo-500 transition-all outline-none uppercase tracking-tight"
                    placeholder="Neural Core X1..."
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Asset Class</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-sm font-black focus:border-indigo-500 transition-all outline-none uppercase appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Scan Classes...</option>
                    <option value="electronics">Cybernetics</option>
                    <option value="hardware">Hardware</option>
                    <option value="data">Data Shards</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Asset Narrative</label>
                <textarea
                  className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] px-8 py-6 text-sm font-medium focus:border-indigo-500 transition-all outline-none min-h-[160px] resize-none"
                  placeholder="Describe technical specifications and asset history..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Deployment Node</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-12 py-5 text-sm font-black focus:border-indigo-500 transition-all outline-none uppercase tracking-tight"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Condition State</label>
                  <div className="flex gap-2">
                    {CONDITIONS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, condition: c.value })}
                        className={`flex-1 py-4 px-2 rounded-2xl border transition-all text-[8px] font-black uppercase tracking-widest ${formData.condition === c.value ? "bg-indigo-600 border-indigo-600" : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600"
                          }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Valuation & Controls */}
          <div className="space-y-8">
            {/* Valuations */}
            <div className="p-8 rounded-[3rem] bg-indigo-600 text-white shadow-[0_20px_50px_rgba(99,102,241,0.25)]">
              <div className="flex items-center gap-2 mb-8">
                <Zap size={18} fill="currentColor" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Value Intel</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Estimated Market Value (LTC)</label>
                  <input
                    type="number"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-2xl font-black focus:bg-white/20 transition-all outline-none placeholder:text-white/30"
                    placeholder="0000"
                    value={formData.baseValue}
                    onChange={(e) => setFormData({ ...formData, baseValue: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={simulateAiValuation}
                  disabled={isAiCalculating}
                  className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all group"
                >
                  {isAiCalculating ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  {isAiCalculating ? "Auditing Network..." : "Request AI Valuation"}
                </button>

                {aiValuation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-white/10 rounded-2xl border border-white/20"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">AI Optimized Value</div>
                    <div className="text-3xl font-black">{aiValuation.toFixed(0)} <span className="text-xs uppercase">LTC</span></div>
                    <p className="text-[8px] font-medium uppercase mt-2 opacity-50 flex items-center gap-1">
                      <Info size={10} /> Based on nodes in {formData.location}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Protocol Overrides */}
            <div className="p-8 rounded-[3rem] bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Barter Protocol</h4>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">Accept non-LTC swap offers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isBarterEnabled: !formData.isBarterEnabled })}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.isBarterEnabled ? "bg-indigo-600" : "bg-slate-800"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isBarterEnabled ? "right-1" : "left-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Flash Auction</h4>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">Deploy 24h auction logic</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isAuctionEnabled: !formData.isAuctionEnabled })}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.isAuctionEnabled ? "bg-indigo-600" : "bg-slate-800"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isAuctionEnabled ? "right-1" : "left-1"}`} />
                </button>
              </div>
            </div>

            {/* Submit Section */}
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
              >
                Deploy to Network <Gavel size={16} />
              </button>

              <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Trust Guarantee</span>
                </div>
                <p className="text-[9px] text-slate-500 font-medium uppercase leading-relaxed">
                  Deploying this asset will commit your node to the SwapIt Trade Mesh. Ensure all data is accurate to maintain your Trust Score.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}