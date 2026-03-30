"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }
      localStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } catch {
      setError("Could not reach login service");
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
        {error ? <p className="text-red-400 text-sm">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 font-bold">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
