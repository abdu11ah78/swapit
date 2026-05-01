"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { loginRequest } from "@/features/auth/auth.api";
import { setAccessToken } from "@/lib/auth-storage";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Lock, Mail, Shield, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, showAlert } = useAppContext();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginRequest({ email, password });
      
      if (data.role?.toUpperCase() !== "ADMIN") {
        showAlert({
          title: "Access Denied",
          message: "The requested identity does not have administrative privileges. Verification failed.",
          type: "error",
          confirmText: "Back to User Portal"
        });
        return;
      }

      setAccessToken(data.token);
      login({
        id: data.userId,
        email: email,
        role: data.role
      });

      toast.success("Identity verified. Accessing Command Center.");
      router.push("/admin");
    } catch (err: any) {
      showAlert({
        title: "Authorization Failed",
        message: err.response?.data?.message || "Internal handshake error. Please verify administrative keys.",
        type: "error",
        confirmText: "Retry Handshake"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)] px-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--admin-primary)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--admin-primary)]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[2.5rem] p-8 md:p-10 relative z-10 shadow-2xl shadow-black/5"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 bg-[var(--admin-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--admin-primary)]/20 transition-transform group-hover:scale-110">
              <span className="text-black font-black text-xl italic">S</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-[var(--admin-text)] italic uppercase">Swap<span className="text-[var(--admin-primary)]">It</span> Admin</span>
          </Link>
          <h1 className="text-2xl font-black text-[var(--admin-text)] tracking-tighter mb-2 uppercase">
            Command <span className="text-[var(--admin-primary)]">Center</span>
          </h1>
          <p className="text-[var(--admin-text-muted)] text-[10px] font-black tracking-[0.3em] uppercase">Administrative Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--admin-text)] uppercase tracking-widest pl-1">Admin Identity</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)] group-focus-within:text-[var(--admin-primary)] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@swapit.com"
                className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)]/50 focus:outline-none focus:border-[var(--admin-primary)]/50 focus:ring-4 focus:ring-[var(--admin-primary)]/5 transition-all text-sm font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <label className="text-[10px] font-black text-[var(--admin-text)] uppercase tracking-widest">Access Key</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)] group-focus-within:text-[var(--admin-primary)] transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-4 pl-12 pr-12 text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)]/50 focus:outline-none focus:border-[var(--admin-primary)]/50 focus:ring-4 focus:ring-[var(--admin-primary)]/5 transition-all text-sm font-bold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[var(--admin-primary)] text-black font-black tracking-widest rounded-2xl shadow-xl shadow-[var(--admin-primary)]/10 flex items-center justify-center gap-3 group disabled:opacity-50 transition-all active:scale-95 hover:bg-[var(--admin-primary-hover)] text-xs uppercase"
          >
            {loading ? "Authorizing..." : (
              <>
                Enter Command Center
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-[var(--admin-border)] text-center">
          <p className="text-[var(--admin-text-muted)] text-[10px] font-black uppercase tracking-widest">
            Restricted System. Logins are monitored.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-[var(--admin-text-muted)] font-black uppercase tracking-[0.2em]">
          <Shield className="w-3 h-3 text-[var(--admin-primary)]/60" />
          Level 4 Security Clearance
        </div>
      </motion.div>
    </div>
  );
}
