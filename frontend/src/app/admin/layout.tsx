"use client";
import "../admin/styles/admin.css";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Navbar } from "../admin/components/layout/Navbar";
import { Sidebar } from "../admin/components/layout/Sidebar";
import { motion } from "framer-motion";
import { ThemeProvider } from "../admin/context/ThemeContext";
import { AdminProvider } from "../admin/context/AdminContext";
import { adminData } from "./lib/mockData";
import { AdminGuard } from "@/components/auth/AdminGuard";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // For login page, render without admin layout
  if (isLoginPage) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  // Authenticated - show admin layout
  return (
    <AdminGuard>
      <ThemeProvider>
        <AdminProvider>
          <div className="flex flex-col h-screen bg-slate-950">
            <Navbar
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              user={adminData}
            />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              <main className="flex-1 overflow-auto">
                <motion.div
                  className="p-4 sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </main>
            </div>
          </div>
        </AdminProvider>
      </ThemeProvider>
    </AdminGuard>
  );
}
