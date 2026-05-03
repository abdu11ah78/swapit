"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react"
import toast from "react-hot-toast"
import { useAppContext } from "@/context/AppContext" // Changed path to AppContext
import { useLoginMutation } from "@/features/auth/auth.hooks"

export default function UserLoginPage() {
    const router = useRouter()
    const { login, showAlert } = useAppContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const loginMutation = useLoginMutation()
    const isLoading = loginMutation.isPending

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
            showAlert({
                title: "Login Failed",
                message: err?.response?.data?.message || "Invalid credentials. Please verify your email and password and try again.",
                type: "error",
                confirmText: "Try Again"
            })
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
        </div>
    )
}
