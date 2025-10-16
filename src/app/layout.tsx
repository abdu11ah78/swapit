import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from '@/components/common/navbar/navbar';
import { Footer } from '@/components/common/footer/footer';
import { AppProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';

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
        <AppProvider>  
          <Navbar />
          {children}
          <Toaster position="top-right" reverseOrder={false} />
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
