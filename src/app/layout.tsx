import "./globals.css"
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/react"
import { PathChecker } from "@/utils/PathChecker"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(inter.className, "h-screen scrollbar-hide select-none w-screen")}>
      <body className='h-full w-full'>
        <PathChecker />
        <SpeedInsights />
        <Analytics />
        {children}
        <Toaster />
      </body>
    </html>
  )
}