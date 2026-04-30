"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { loginRequest } from "@/features/auth/auth.api";
import { setAccessToken } from "@/lib/auth-storage";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAppContext();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginRequest({ email, password });
      
      if (data.role?.toUpperCase() !== "ADMIN") {
        toast.error("Access denied. Admin privileges required.");
        return;
      }

      setAccessToken(data.token);
      login({
        id: data.userId,
        email: email,
        role: data.role
      });

      toast.success("Admin access authorized.");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-black text-white">Admin Login</h1>
        <input className="w-full rounded-lg bg-slate-950 border border-slate-800 text-white px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full rounded-lg bg-slate-950 border border-slate-800 text-white px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 font-bold">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
