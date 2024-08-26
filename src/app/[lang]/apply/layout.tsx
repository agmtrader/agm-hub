import type { Metadata } from "next";
import "../../globals.css";

import { NextAuthProvider } from "../../NextAuthProvider";
import FirebaseAuthProvider from "../../FirebaseAuthProvider";
import Footer from "@/components/Footer";
import MarketOverview from "@/components/MarketOverview";

export const metadata: Metadata = {
  title: "AGM Technology",
  description: "Discover the new trading world.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="h-full w-full  flex flex-row">
      <NextAuthProvider>
        <FirebaseAuthProvider>
        <div className="flex flex-col scrollbar-hide h-full w-full scroll-smooth">
          {children}
        </div>
        </FirebaseAuthProvider>
      </NextAuthProvider>
    </div>
  );
}