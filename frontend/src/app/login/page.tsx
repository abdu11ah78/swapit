"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, AlertTriangle, X } from "lucide-react"
import toast from "react-hot-toast"
import { useAppContext } from "@/context/AppContext"
import { useLoginMutation } from "@/features/auth/auth.hooks"
import { apiClient } from "@/api/axios"

export default function UserLoginPage() {
    const router = useRouter()
    const { login, showAlert } = useAppContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const loginMutation = useLoginMutation()
    const isLoading = loginMutation.isPending

    // Banned account state
    const [showBanModal, setShowBanModal] = useState(false)
    const [bannedEmail, setBannedEmail] = useState("")
    const [reopenReason, setReopenReason] = useState("")
    const [isSubmittingReopen, setIsSubmittingReopen] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await loginMutation.mutateAsync({ email, password })
            login({
                id: result.userId,
                email,
                role: result.role,
                name: result.name || email.split("@")[0],
                image: result.image
            })
            toast.success("Welcome back!")
            router.push('/')
        } catch (err: any) {
            const status = err?.response?.status
            if (status === 403) {
                // Account is banned
                setBannedEmail(email)
                setShowBanModal(true)
            } else {
                showAlert({
                    title: "Login Failed",
                    message: err?.response?.data?.message || "Invalid credentials. Please verify your email and password and try again.",
                    type: "error",
                    confirmText: "Try Again"
                })
            }
        }
    }

    const handleReopenRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!reopenReason.trim()) return
        setIsSubmittingReopen(true)
        try {
            await apiClient.post("/auth/request-reopen", { email: bannedEmail, reason: reopenReason })
            setShowBanModal(false)
            toast.success("Your account reopening request has been submitted. An admin will review it shortly.")
        } catch {
            toast.error("Failed to submit request. Please try again later.")
        } finally {
            setIsSubmittingReopen(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#115e59]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4d7c0f]/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-slate-100 rounded-[3rem] p-8 md:p-10 relative z-10 shadow-2xl shadow-[#115e59]/5"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#115e59] to-[#4d7c0f] rounded-xl flex items-center justify-center shadow-lg shadow-[#115e59]/10 transition-transform group-hover:scale-110">
                            <span className="text-white font-black text-xl italic">S</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-[#115e59] italic uppercase">Swap<span className="text-[#4d7c0f]">It</span></span>
                    </Link>
                    <h1 className="text-3xl font-black text-[#115e59] tracking-tighter mb-2 italic uppercase">
                        Member <span className="text-[#4d7c0f] not-italic">Login</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">Welcome back to SwapIt</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#115e59] placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between px-1">
                            <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest">Password</label>
                            <button type="button" className="text-[10px] font-black text-slate-300 hover:text-[#4d7c0f] transition-colors uppercase tracking-widest">Forgot?</button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#115e59] text-white font-black tracking-widest rounded-2xl shadow-xl shadow-[#115e59]/20 flex items-center justify-center gap-3 group disabled:opacity-50 transition-all active:scale-95 hover:bg-[#4d7c0f] text-xs"
                    >
                        {isLoading ? "LOGGING IN..." : (
                            <>
                                LOGIN TO ACCOUNT
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        New here?{' '}
                        <Link href="/signup" className="text-[#115e59] hover:text-[#4d7c0f] transition-colors">Create Account</Link>
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">
                    <Shield className="w-3 h-3 text-[#4d7c0f]/40" />
                    Secure encrypted login
                </div>
            </motion.div>

            {/* Banned Account Modal */}
            <AnimatePresence>
                {showBanModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowBanModal(false)}
                                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Account Banned</h2>
                                <p className="text-slate-500 text-sm">
                                    Your account has been suspended by an administrator. You can submit a request to have it reviewed.
                                </p>
                            </div>

                            <form onSubmit={handleReopenRequest} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Reason for Reopening</label>
                                    <textarea
                                        value={reopenReason}
                                        onChange={(e) => setReopenReason(e.target.value)}
                                        placeholder="Explain why you believe your account should be reopened..."
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm resize-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmittingReopen || !reopenReason.trim()}
                                    className="w-full py-3 bg-[#115e59] text-white font-black tracking-widest rounded-2xl text-xs disabled:opacity-50 transition-all hover:bg-[#4d7c0f] active:scale-95"
                                >
                                    {isSubmittingReopen ? "SUBMITTING..." : "SUBMIT REOPENING REQUEST"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

