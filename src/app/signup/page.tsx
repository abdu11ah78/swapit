
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Mail, MapPin, Lock, Eye, EyeOff, CheckCircle, Shield, ArrowRight, CheckCircle2 } from "lucide-react"
import toast from "react-hot-toast"
import { useAppContext } from "@/context/AppContext"

export default function UserSignupPage() {
    const router = useRouter()
    const { login } = useAppContext()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        location: "",
        agreeToTerms: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.agreeToTerms) {
            toast.error("Please agree to the terms")
            return
        }
        setIsLoading(true)

        // Mock persistence
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('swapit_users') || '[]')
            users.push(formData)
            localStorage.setItem('swapit_users', JSON.stringify(users))

            login(formData)

            toast.success("Account created successfully!")
            setIsLoading(false)
            router.push('/') // Redirect to home instead of /explore
        }, 1000)
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
                        Protocol <span className="text-[#4d7c0f] not-italic">Signup</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">Initialize New Node</p>
                </div>

                <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Operational Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Full name for verification"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#115e59] placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Network Identity (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="node@protocol.com"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#115e59] placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Deployment Location</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="City, Country"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#115e59] placeholder:text-slate-300 focus:outline-none focus:border-[#115e59]/20 focus:ring-4 focus:ring-[#115e59]/5 transition-all text-sm font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-[#115e59] uppercase tracking-widest pl-1">Secure Access Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#115e59] transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Create a strong key"
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
                            I verify compliance with the <span className="text-[#115e59]">Terms of Service</span> and <span className="text-[#115e59]">Privacy Policy</span>
                        </label>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="md:col-span-2 w-full py-5 bg-[#115e59] text-white font-black tracking-[0.2em] rounded-2xl shadow-xl shadow-[#115e59]/10 flex items-center justify-center gap-3 hover:bg-[#4d7c0f] transition-all active:scale-95 disabled:opacity-50 text-xs"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? "INITIALIZING NODE..." : (
                            <>
                                ACCESS PROTOCOL
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center border-t border-slate-50 pt-8">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        Already in the Network?{' '}
                        <Link href="/login" className="text-[#115e59] hover:text-[#4d7c0f] transition-colors">Authorize Login</Link>
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">
                    <Shield className="w-3 h-3 text-[#4d7c0f]/40" />
                    Protocol Handshake Encrypted
                </div>
            </motion.div>
        </div>
    )
}
