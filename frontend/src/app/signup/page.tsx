
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, MapPin, Lock, Eye, EyeOff, Shield, ArrowRight } from "lucide-react"
import toast from "react-hot-toast"
import { useAppContext } from "@/context/AppContext"
import { useRegisterMutation } from "@/features/auth/auth.hooks"

export default function UserSignupPage() {
    const router = useRouter()
    const { login, showAlert } = useAppContext()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        agreeToTerms: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [modal, setModal] = useState<null | 'terms' | 'privacy'>(null)
    const registerMutation = useRegisterMutation()
    const isLoading = registerMutation.isPending

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.agreeToTerms) {
            showAlert({
                title: "Policy Agreement",
                message: "Please review and agree to the Terms of Service and Privacy Policy to continue.",
                type: "warning",
                confirmText: "I'll do that"
            })
            return
        }

        try {
            const result = await registerMutation.mutateAsync({
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
            })

            login({
                id: result.userId,
                name: formData.name,
                email: formData.email,
                role: result.role,
            })

            toast.success("Account created successfully!")
            router.push('/')
        } catch (err: any) {
            showAlert({
                title: "Registration Failed",
                message: err?.response?.data?.message || "We encountered an issue creating your account. Please check your details and try again.",
                type: "error",
                confirmText: "Try Again"
            })
        }
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#115e59]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-[#4d7c0f]/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white border border-slate-100 rounded-[3rem] p-8 md:p-10 relative z-10 shadow-2xl shadow-[#115e59]/5"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#115e59] to-[#4d7c0f] rounded-xl flex items-center justify-center shadow-lg shadow-[#115e59]/10 transition-transform group-hover:scale-110">
                            <span className="text-white font-black text-xl italic">S</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-[#115e59] italic uppercase">Swap<span className="text-[#4d7c0f]">It</span></span>
                    </Link>
                    <h1 className="text-3xl font-black text-[#115e59] tracking-tighter mb-2 italic uppercase">
                        Create <span className="text-[#4d7c0f] not-italic">Account</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">Join the marketplace today</p>
                </div>

                <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your full name"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#115e59] placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@example.com"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#115e59] placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Phone Number</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="+92 XXX XXXXXXX"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#115e59] placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Create a strong password"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-[#115e59] placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm font-bold"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-[#115e59] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3 px-1">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className="w-4 h-4 rounded-lg border-slate-200 bg-slate-50 text-[#115e59] focus:ring-[#115e59]/20 cursor-pointer"
                            required
                        />
                        <label htmlFor="terms" className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none cursor-pointer">
                            I agree to the <button type="button" onClick={() => setModal('terms')} className="text-[#115e59] hover:underline">Terms of Service</button> and <button type="button" onClick={() => setModal('privacy')} className="text-[#115e59] hover:underline">Privacy Policy</button>
                        </label>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="md:col-span-2 w-full py-5 bg-[#115e59] text-white font-black tracking-[0.2em] rounded-2xl shadow-xl shadow-[#115e59]/10 flex items-center justify-center gap-3 hover:bg-[#4d7c0f] transition-all active:scale-95 disabled:opacity-50 text-xs"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? "CREATING ACCOUNT..." : (
                            <>
                                START TRADING
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center border-t border-slate-50 pt-8">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#115e59] hover:text-[#4d7c0f] transition-colors">Login Here</Link>
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">
                    <Shield className="w-3 h-3 text-[#4d7c0f]/40" />
                    Secure encrypted registration
                </div>
            </motion.div>

            {/* Legal Modals */}
            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModal(null)}
                            className="absolute inset-0 bg-[#115e59]/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-12 relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                <h2 className="text-2xl font-black text-[#115e59] uppercase tracking-tighter mb-6">
                                    {modal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                                </h2>
                                <div className="space-y-4 text-slate-500 text-sm leading-relaxed">
                                    {modal === 'terms' ? (
                                        <>
                                            <p className="font-bold text-[#115e59]">1. Acceptance of Terms</p>
                                            <p>By accessing and using SwapIt, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
                                            <p className="font-bold text-[#115e59]">2. Marketplace Conduct</p>
                                            <p>Users are responsible for the accuracy of their listings. Prohibited items include illegal substances, weapons, and counterfeit goods. SwapIt reserves the right to remove any listing.</p>
                                            <p className="font-bold text-[#115e59]">3. Trading & Escrow</p>
                                            <p>All trades are final once confirmed by both parties. Our LTP (Link Trading Points) system is used for valuation and must not be manipulated.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-[#115e59]">1. Information Collection</p>
                                            <p>We collect information you provide directly to us, such as when you create an account, list an item, or communicate with other users.</p>
                                            <p className="font-bold text-[#115e59]">2. Data Usage</p>
                                            <p>Your data is used to facilitate trades, improve our AI valuation engine, and maintain the security of our marketplace.</p>
                                            <p className="font-bold text-[#115e59]">3. Security</p>
                                            <p>We implement industry-standard encryption to protect your personal information and transaction history.</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setModal(null)}
                                className="mt-8 w-full py-4 bg-[#115e59] text-white font-black tracking-widest rounded-2xl uppercase text-xs"
                            >
                                I Understand
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
