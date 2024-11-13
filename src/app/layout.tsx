'use client'
import "./globals.css"
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/react"
import { usePathname, useRouter } from "next/navigation"
import { changeLang } from "@/utils/lang"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const path = usePathname()
  const router = useRouter()

  if (typeof window !== 'undefined') {
    if (!path.includes('/en') && !path.includes('/es')) {
      const newPath = changeLang('en', path)
      router.push(newPath)
    }
  }

  return (
    <html lang="en" className={cn(inter.className, "h-screen scrollbar-hide select-none w-screen")}>
      <body className='h-full w-full'>
        <SpeedInsights />
        <Analytics />
        {children}
        <Toaster />
      </body>
    </html>
  )
}