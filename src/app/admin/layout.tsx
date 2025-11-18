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
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  // Check if current route is login page
  const isLoginPage = pathname === "/admin/login";
  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }
    // Check if admin is authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        // Verify token with backend
        const response = await fetch("/api/admin/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, isLoginPage]);
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }
  // For login page, render without admin layout
  if (isLoginPage) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }
  // Not authenticated - will redirect to login
  if (!isAuthenticated) {
    return null;
  }
  // Authenticated - show admin layout
  return (
    <ThemeProvider>
      <AdminProvider>
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
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
  );
}
