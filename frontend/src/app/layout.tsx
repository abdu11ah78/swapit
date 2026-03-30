import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
import { AppProvider } from '@/context/AppContext';
import { Toaster } from "react-hot-toast";
import Providers from "@/app/Providers";
import { Toaster as SonnerToaster } from "sonner";

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
            {children}
            <Toaster position="bottom-right" />
            <SonnerToaster richColors position="top-right" />
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}