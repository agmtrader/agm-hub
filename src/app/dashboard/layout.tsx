import type { Metadata } from "next";
import "../globals.css"

import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils";

import { NextAuthProvider } from "../NextAuthProvider";
import FirebaseAuthProvider from "../FirebaseAuthProvider";

import Footer from "@/components/Footer";
import { DashboardHeader } from "@/components/Header";

export const metadata: Metadata = {
  title: "AGM Dashboard",
  description: "Creado por Andres Aguilar y Ramon Castro",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="en" className={cn(inter.className, "flex flex-col h-fit w-full  bg-agm-white overflow-x-hidden scroll-smooth")}>
      <body className='h-full w-full flex flex-row scroll-smooth '>
        <div className="h-full w-full  flex flex-row">
          <NextAuthProvider>
            <FirebaseAuthProvider>
            <div className="flex flex-col bg-agm-blue scrollbar-hide h-full min-h-[100vh] w-full gap-y-10 scroll-smooth">
              <DashboardHeader />
              {children}
              <Footer />
            </div>
            </FirebaseAuthProvider>
          </NextAuthProvider>
        </div>
      </body>
    </html>

  );
}