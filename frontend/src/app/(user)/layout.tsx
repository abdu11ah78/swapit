import type { Metadata } from "next";
import "@/styles/globals.css";
import { MarketplaceHeader } from "@/components/layout/Header";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "SwapIt - Premier Barter Marketplace",
  description: "Advanced asset swapping and bidding network.",
};

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <MarketplaceHeader />
      <main>
        {children}
      </main>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

