import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from '@/components/common/navbar/navbar';
import { Footer } from '@/components/common/footer/footer';
import { AppProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import { default as ModernNavbar } from '@/components/common/modernnavbar/modernnavbar';
import PromoBanner from '@/components/common/PromoBanner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ThemeName: string = 'modern'

const NavbarComponent =
    ThemeName === 'classic' ? (
      <Navbar />
    ) : (
      <ModernNavbar />
    )

export const metadata: Metadata = {
  title: "InstabizSite - Empowering Small Business E-commerce",
  description: "Created By Entecra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Show PromoBanner only if theme is not 'classic', but 'modern'
  const shouldShowPromo = ThemeName === 'modern';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>  
          {NavbarComponent} 
          {children}
          <Toaster position="top-right" reverseOrder={false} />
          
          {/* PromoBanner - Only shows for classic theme */}
          <PromoBanner 
            templateId={ThemeName} 
            isVisible={shouldShowPromo}
          />
          
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}