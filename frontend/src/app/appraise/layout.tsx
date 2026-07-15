import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Item Appraisal | SwapIt",
  description:
    "Get an instant AI-powered market-value estimate for your item before swapping or listing on SwapIt.",
};

export default function AppraiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
