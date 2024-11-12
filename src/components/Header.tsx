"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import useScrollPositions from '@/hooks/useScrollPositions'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './sidebar/Sidebar'
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { AlignJustify } from 'lucide-react'

const maxScroll = 100

export const Header = () => {
  const scroll = useScrollPositions()
  const [expandSidebar, setExpandSidebar] = useState(false)
  const { lang } = useTranslationProvider()

  return (
    <>
      <header className="fixed w-full z-50">
        <div className="relative">
          {/* Background that changes opacity based on scroll */}
          <div 
            className="absolute inset-0 bg-background transition-opacity duration-300"
            style={{ opacity: scroll > maxScroll ? 1 : 0 }}
          />

          {/* Header content */}
          <div className="flex items-center justify-between px-5 py-10 relative z-10">
            <Link className="flex items-center" href={`/${lang}`}>
              <Button className="bg-transparent" variant="ghost">
                {scroll > maxScroll && <Image src="/images/brand/agm-logo.png" alt="AGM Logo" height={200} width={200} />}
              </Button>
            </Link>
            <Button
              onClick={() => setExpandSidebar(true)}
              className="z-20 text-background"
            >
              <AlignJustify className="text-2xl" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {expandSidebar && <Sidebar setExpandSidebar={setExpandSidebar} />}
      </AnimatePresence>
    </>
  )
}

export const FormHeader = () => {
  const { lang } = useTranslationProvider()
  const [expandSidebar, setExpandSidebar] = useState(false)

  return (
    <>
      <header className=" w-full z-50">
        <div className="relative">
          {/* Background that changes opacity based on scroll */}
          <div 
            className="bg-background"
          />

          {/* Header content */}
          <div className="flex items-center justify-between px-5 py-10 relative z-10">
            <Link className="flex items-center" href={`/${lang}`}>
              <Button className="bg-transparent" variant="ghost">
                <Image src="/images/brand/agm-logo.png" alt="AGM Logo" height={200} width={200} />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => setExpandSidebar(true)}
              className="z-20"
            >
              <AlignJustify className="text-2xl text-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {expandSidebar && <Sidebar setExpandSidebar={setExpandSidebar} />}
      </AnimatePresence>
    </>
  )
}