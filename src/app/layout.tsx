import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
import { AppProvider } from '@/context/AppContext';
import { Toaster } from "react-hot-toast";

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
        <AppProvider>
          {children}
          <Toaster position="bottom-right" />
        </AppProvider>
      </body>
    </html>
  );
}