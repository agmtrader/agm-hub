"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import useScrollPositions from '@/hooks/useScrollPositions'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { AlignJustify } from 'lucide-react'
import { formatURL, goHome } from '@/utils/language/lang'
import { cn } from '@/lib/utils'

const maxScroll = 100

export const Header = () => {

  const scroll = useScrollPositions()
  const [expandSidebar, setExpandSidebar] = useState(false)
  const { lang } = useTranslationProvider()

  return (
    <div>
      <header className={cn("fixed w-full z-50", scroll > maxScroll ? "bg-background" : "bg-transparent")}>
        <div className="flex items-center justify-between p-5 relative z-10 h-32">
          <Button asChild className='bg-transparent hover:bg-transparent'>
            <Link href={formatURL('/', lang)}>
                {scroll > maxScroll ? 
                  <Image src="/assets/brand/agm-logo.png" priority={true} alt="AGM Logo" className="w-[150px] h-[50px] object-contain" width={150} height={50} /> 
                  : 
                  <Image src="/assets/brand/agm-logo-white.png" priority={true} alt="AGM Logo" className="w-[150px] h-[50px] object-contain" width={150} height={50} />
                }
            </Link>
          </Button>
          <Button
            onClick={() => setExpandSidebar(true)}
            className="z-20 text-background"
          >
            <AlignJustify className="text-2xl" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {expandSidebar && <Sidebar setExpandSidebar={setExpandSidebar} />}
      </AnimatePresence>
    </div>
  )
}


export const StaticHeader = () => {
  const { lang } = useTranslationProvider()
  const [expandSidebar, setExpandSidebar] = useState(false)

  return (
    <div className=''>
      <header className="w-full z-50 bg-background h-32">
        <div className="flex items-center justify-between p-5 relative z-10 h-32">
          <Button asChild className='bg-transparent hover:bg-transparent'>
            <Link href={formatURL('/', lang)}>
                <Image src="/assets/brand/agm-logo.png" priority={true} alt="AGM Logo" className="w-[150px] h-[50px] object-contain" width={150} height={50} /> 
            </Link>
          </Button>
          <Button
            onClick={() => setExpandSidebar(true)}
            className="z-20 text-background"
          >
            <AlignJustify className="text-2xl" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {expandSidebar && <Sidebar setExpandSidebar={setExpandSidebar} />}
      </AnimatePresence>
    </div>
  )
}