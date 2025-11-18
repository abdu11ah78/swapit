// app/layout.tsx (Updated)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
// IMPORT AppProvider HERE
import { AppProvider } from '@/context/AppContext'; 

// ... (font definitions and metadata remain the same)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "InstabizSite - Empowering Small Business E-commerce",
  description: "Created By Entecra",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* WRAP THE CHILDREN WITH AppProvider */}
        <AppProvider>
          {children} 
        </AppProvider>
      </body>
    </html>
  );
}