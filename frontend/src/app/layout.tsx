import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
import { AppProvider } from '@/context/AppContext';
import { Toaster } from "react-hot-toast";
import Providers from "@/app/Providers";
import { Toaster as SonnerToaster } from "sonner";
import { MaintenanceOverlay } from "@/components/common/MaintenanceOverlay";

const font = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwapIt - Premier Barter Marketplace",
  description: "The ultimate marketplace for detailed asset exchange.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>
          <AppProvider>
            <MaintenanceOverlay />
            {children}
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                className: 'rounded-[1.5rem] bg-white border border-slate-100 text-[#115e59] font-bold text-sm shadow-2xl',
                duration: 4000,
                style: {
                  padding: '16px 24px',
                  boxShadow: '0 25px 50px -12px rgba(17, 94, 89, 0.1)',
                }
              }}
            />
            <SonnerToaster 
              richColors 
              position="top-right"
              toastOptions={{
                className: 'rounded-[2rem] border-slate-100 shadow-2xl font-sans',
                style: {
                  borderRadius: '1.5rem',
                }
              }}
            />
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}