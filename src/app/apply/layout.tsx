import type { Metadata } from "next";
import "../globals.css"

import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils";

import { NextAuthProvider } from "@/app/NextAuthProvider";
import FirebaseAuthProvider from "@/app/FirebaseAuthProvider";

export const metadata: Metadata = {
  title: "AGM Technology",
  description: "Discover the new trading world.",
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
            <div className="flex flex-col scrollbar-hide h-full w-full scroll-smooth">
              {children}
            </div>
            </FirebaseAuthProvider>
          </NextAuthProvider>
        </div>
      </body>
    </html>

  );
}