import type { Metadata } from "next";
import "../../globals.css";

import { Header } from "@/components/Header";
import { NextAuthProvider } from "../../../utils/NextAuthProvider";
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
    <div className="h-full w-full">
      <NextAuthProvider>
        <FirebaseAuthProvider>
        <div className="flex flex-col h-full w-full">
          <Header />
          {children}
        </div>
        </FirebaseAuthProvider>
      </NextAuthProvider>
    </div>
  );
}