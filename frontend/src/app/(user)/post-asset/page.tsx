"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Camera, Zap, Shield, HelpCircle, ArrowRight, Tag, MapPin, Scale, ChevronRight, Smartphone, Car, Watch, Laptop, Camera as CameraIcon, Gamepad2, Home, Sofa, Utensils, Sparkles, Cpu, Microwave, Dog, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

import { useCategories, useProvinces, useSubmitSuggestion } from "@/features/taxonomy/taxonomy.hooks"
import { toast } from "sonner"

const IconMap: Record<string, any> = {
    Smartphone, Car, Laptop, Watch, Gamepad2, Home, Sofa, Utensils, Sparkles, Cpu, Microwave, Dog, Briefcase, HelpCircle
}

export default function AssetPostingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const { data: categories = [], isLoading: isLoadingCats } = useCategories()
    const { data: provinces = [] } = useProvinces()
    const submitSuggestion = useSubmitSuggestion()

    const [selection, setSelection] = useState({
        category: '',
        productType: '',
        name: '',
        condition: 'New',
        provinceId: '',
        location: '',
        tradeFor: '',
        details: '',
        usage: '',
        defects: '',
        dynamicAttributes: {} as Record<string, string>
    })

    const [suggesting, setSuggesting] = useState<null | 'Category' | 'Attribute'>(null)
    const [suggestionName, setSuggestionName] = useState("")

    // AI Evaluation State
    const [isEvaluating, setIsEvaluating] = useState(false)
    const [evaluationResult, setEvaluationResult] = useState<number | null>(null)
    const [images, setImages] = useState<string[]>([])

    const handleNext = () => setStep(prev => prev + 1)
    const handleBack = () => setStep(prev => prev - 1)

    const handleImageUpload = () => {
        // Simulating image upload
        const newImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=60"
        setImages([...images, newImage])
    }

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleAiEvaluate = () => {
        setIsEvaluating(true)
        // Simulate AI analysis delay
        setTimeout(() => {
            const basePoints = Math.floor(Math.random() * 2000) + 500
            setEvaluationResult(basePoints)
            setIsEvaluating(false)
        }, 2500)
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59] selection:bg-[#4d7c0f]/20 font-sans pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4d7c0f]/10 border border-[#4d7c0f]/20 rounded-full mb-6">
                        <Plus size={14} className="text-[#4d7c0f]" />
                        <span className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-[0.2em]">Marketplace Lister</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#115e59] tracking-tighter uppercase mb-4">List Your <span className="text-[#4d7c0f]">Item</span></h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">Complete the details below to verify your item and begin trading.</p>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center items-center gap-4 mb-16">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'bg-[#115e59] text-white shadow-lg shadow-[#115e59]/20' : 'bg-slate-100 text-slate-400'}`}>
                                0{s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-[#4d7c0f]' : 'bg-slate-200'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4d7c0f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        {step === 1 && (
                            <div className="space-y-10">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#115e59] uppercase tracking-tighter mb-2">Select Category</h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Identify the classification for your item</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {categories.filter(c => c.isActive).map((cat) => {
                                        const Icon = IconMap[cat.icon] || HelpCircle
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => { setSelection({ ...selection, category: cat.id }); handleNext() }}
                                                className={`group p-6 rounded-[2.5rem] border transition-all flex flex-col items-center gap-4 hover:scale-105 active:scale-95 ${selection.category === cat.id ? 'bg-[#115e59] border-[#115e59] text-white shadow-xl shadow-[#115e59]/20' : 'bg-white border-slate-100 text-[#115e59] hover:border-[#4d7c0f]'}`}
                                            >
                                                <div className={`p-4 rounded-2xl transition-all ${selection.category === cat.id ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-[#4d7c0f]/10'}`}>
                                                    <Icon className={selection.category === cat.id ? "text-white" : "text-[#4d7c0f]"} size={24} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-center">{cat.name}</span>
                                            </button>
                                        )
                                    })}
                                    <button
                                        onClick={() => setSuggesting('Category')}
                                        className="group p-6 rounded-[2.5rem] border border-dashed border-slate-200 transition-all flex flex-col items-center gap-4 hover:border-[#4d7c0f] hover:bg-[#4d7c0f]/5"
                                    >
                                        <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-[#4d7c0f]/10">
                                            <HelpCircle className="text-slate-300 group-hover:text-[#4d7c0f]" size={24} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-center text-slate-400 group-hover:text-[#4d7c0f]">Other / Suggest</span>
                                    </button>
                                </div>

                                {suggesting === 'Category' && (
                                    <div className="flex flex-col gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] font-black text-[#115e59] uppercase tracking-widest">Suggest New Category</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold"
                                                placeholder="Category Name"
                                                value={suggestionName}
                                                onChange={(e) => setSuggestionName(e.target.value)}
                                            />
                                            <button
                                                onClick={async () => {
                                                    if (!suggestionName) return
                                                    await submitSuggestion.mutateAsync({ type: 'Category', name: suggestionName })
                                                    setSuggesting(null)
                                                    setSuggestionName("")
                                                }}
                                                className="bg-[#115e59] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-10">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#115e59] uppercase tracking-tighter mb-2">Refine Product Type</h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Specific classification for optimized matching</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {categories.find(c => c.id === selection.category)?.attributes
                                        .filter(a => a.name.toLowerCase().includes('type') && a.type === 'selection')
                                        .flatMap(a => JSON.parse(a.options || '[]'))
                                        .map((type: string) => (
                                        <button
                                            key={type}
                                            onClick={() => { setSelection({ ...selection, productType: type }); handleNext() }}
                                            className={`p-5 rounded-2xl border transition-all flex items-center justify-between group hover:border-[#4d7c0f] ${selection.productType === type ? 'bg-[#4d7c0f] border-[#4d7c0f] text-white shadow-lg shadow-[#4d7c0f]/20' : 'bg-white border-slate-100 text-[#115e59]'}`}
                                        >
                                            <span className="text-xs font-black uppercase tracking-widest">{type}</span>
                                            <ChevronRight size={16} className={selection.productType === type ? "text-white" : "text-slate-300 group-hover:text-[#4d7c0f]"} />
                                        </button>
                                    ))}
                                    {/* Fallback if no specific type attribute */}
                                    {(!categories.find(c => c.id === selection.category)?.attributes.some(a => a.name.toLowerCase().includes('type'))) && (
                                        <button
                                            onClick={() => { setSelection({ ...selection, productType: 'General' }); handleNext() }}
                                            className="p-5 rounded-2xl border border-slate-100 bg-white text-[#115e59] flex items-center justify-between group hover:border-[#4d7c0f]"
                                        >
                                            <span className="text-xs font-black uppercase tracking-widest">General / Standard</span>
                                            <ChevronRight size={16} className="text-slate-300 group-hover:text-[#4d7c0f]" />
                                        </button>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex justify-center">
                                    <button onClick={handleBack} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#115e59] transition-colors">Back to Categories</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-10">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-[#115e59] uppercase tracking-tighter mb-2">Item Intelligence</h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Final details to establish value</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">Item Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-[#115e59] focus:outline-none focus:border-[#115e59] transition-all"
                                                placeholder="e.g. Vintage Camera M2"
                                                value={selection.name}
                                                onChange={(e) => setSelection({ ...selection, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">Visual Evidence ({images.length})</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {images.map((img, i) => (
                                                    <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border border-slate-100 group">
                                                        <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => handleRemoveImage(i)}
                                                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 opacity-100 transition-all backdrop-blur-sm"
                                                        >
                                                            <Plus size={12} className="rotate-45" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <div
                                                    onClick={handleImageUpload}
                                                    className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#115e59] transition-all group"
                                                >
                                                    <div className="p-2 bg-white rounded-xl shadow-sm text-slate-300 group-hover:text-[#115e59] transition-all">
                                                        <Plus size={20} />
                                                    </div>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Add</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">Detailed Description</label>
                                            <textarea
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-[#115e59] h-32 resize-none focus:outline-none focus:border-[#115e59]"
                                                placeholder="Tell us about the item..."
                                                value={selection.details}
                                                onChange={(e) => setSelection({ ...selection, details: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">State / Province</label>
                                                <select
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-[#115e59] appearance-none focus:outline-none focus:border-[#115e59]"
                                                    value={selection.provinceId}
                                                    onChange={(e) => setSelection({ ...selection, provinceId: e.target.value })}
                                                >
                                                    <option value="">Select State</option>
                                                    {provinces.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">City / Area</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#115e59]" />
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-[#115e59] focus:outline-none focus:border-[#115e59]"
                                                        placeholder="Specific Location"
                                                        value={selection.location}
                                                        onChange={(e) => setSelection({ ...selection, location: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">Usage History</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-[#115e59] focus:outline-none focus:border-[#115e59]"
                                                placeholder="e.g. Used for 6 months, mostly weekends"
                                                value={selection.usage}
                                                onChange={(e) => setSelection({ ...selection, usage: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">Known Defects</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-[#115e59] focus:outline-none focus:border-[#115e59]"
                                                placeholder="e.g. Small scratch on screen, volume button sticky"
                                                value={selection.defects}
                                                onChange={(e) => setSelection({ ...selection, defects: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">Desired Exchanges</label>
                                            <textarea
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-[#115e59] h-20 resize-none focus:outline-none focus:border-[#115e59]"
                                                placeholder="What are you looking for in return?"
                                                value={selection.tradeFor}
                                                onChange={(e) => setSelection({ ...selection, tradeFor: e.target.value })}
                                            />
                                        </div>

                                        {/* Dynamic Attributes */}
                                        {categories.find(c => c.id === selection.category)?.attributes
                                            .filter(a => !a.name.toLowerCase().includes('type'))
                                            .map(attr => (
                                            <div key={attr.id} className="space-y-2">
                                                <label className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">{attr.name} {attr.isRequired && '*'}</label>
                                                {attr.type === 'selection' ? (
                                                    <select
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-[#115e59] appearance-none focus:outline-none focus:border-[#115e59]"
                                                        value={selection.dynamicAttributes[attr.id] || ""}
                                                        onChange={(e) => setSelection({
                                                            ...selection,
                                                            dynamicAttributes: { ...selection.dynamicAttributes, [attr.id]: e.target.value }
                                                        })}
                                                        required={attr.isRequired}
                                                    >
                                                        <option value="">Select {attr.name}</option>
                                                        {JSON.parse(attr.options || '[]').map((opt: string) => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                        <option value="other">Other...</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={attr.type === 'number' ? 'number' : 'text'}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-[#115e59] focus:outline-none focus:border-[#115e59]"
                                                        placeholder={`Enter ${attr.name}`}
                                                        value={selection.dynamicAttributes[attr.id] || ""}
                                                        onChange={(e) => setSelection({
                                                            ...selection,
                                                            dynamicAttributes: { ...selection.dynamicAttributes, [attr.id]: e.target.value }
                                                        })}
                                                        required={attr.isRequired}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Results display */}
                                {evaluationResult !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-[#115e59]/5 border border-[#115e59]/20 rounded-3xl p-6 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#115e59] rounded-2xl flex items-center justify-center text-white">
                                                <Sparkles className="animate-pulse" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">AI Valuation Complete</p>
                                                <p className="text-2xl font-black text-[#115e59] tracking-tighter">{evaluationResult.toLocaleString()} LTP</p>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[9px] font-bold text-slate-400">Confidence Score</p>
                                            <p className="text-sm font-black text-[#115e59]">98.5%</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-4 pt-4 border-t border-slate-100">
                                    <button onClick={handleBack} className="flex-1 py-5 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">Back Selection</button>

                                    {!evaluationResult ? (
                                        <button
                                            onClick={handleAiEvaluate}
                                            disabled={isEvaluating || !selection.name}
                                            className="flex-[2] py-5 bg-[#115e59] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#115e59]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {isEvaluating ? (
                                                <>
                                                    <Zap className="animate-bounce w-4 h-4" />
                                                    ANALYZING ASSET NODES...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    RUN AI EVALUATION
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push('/')}
                                            className="flex-[2] py-5 bg-[#4d7c0f] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#4d7c0f]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4"
                                        >
                                            ASCEND OFFERING <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
