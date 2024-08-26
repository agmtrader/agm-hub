'use client'
import "./globals.css"
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils";
import { redirect, usePathname } from "next/navigation";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  const path = usePathname()
  if (path === '/') {
    redirect('/en')
  }

  return (

    <html lang="en" className={cn(inter.className, "flex flex-col h-fit w-fullbg-agm-white overflow-x-hidden scroll-smooth")}>
      <body className='h-full w-full flex flex-row scroll-smooth '>
        {children}
      </body>
    </html>

  )
}