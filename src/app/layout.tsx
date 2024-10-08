'use client'
import "./globals.css"
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils";
import { redirect, usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  const path = usePathname()
  if (!path.includes('/en') && !path.includes('/es')) {
    let paths = path.split('/')
    paths.splice(1, 0, 'en')
    let paths1 = paths.join('/')
    redirect(paths1)
  }

  return (

    <html lang="en" className={cn(inter.className, "h-screen w-screen")}>
      <body className='h-full w-full'>
        {children}
        <Toaster />
      </body>
    </html>

  )
}