'use client'
import "./globals.css"
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { redirect, usePathname } from "next/navigation"
import { changeLang } from "@/utils/language/lang"
import 'core-js/features/regexp'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  const path = usePathname()

  if (typeof window !== 'undefined') {
    if (!path.includes('/en') && !path.includes('/es')) {
      const newPath = changeLang('en', path)
      redirect(newPath)
    }
  }

  return (
    <html lang="en" className={cn(inter.className, "h-screen bg-background scrollbar-hide select-none w-screen")}>
      <body className='h-full w-full'>
        {children}
        <Toaster />
      </body>
    </html>
  )
}