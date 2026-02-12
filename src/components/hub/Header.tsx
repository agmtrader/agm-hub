'use client'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import LanguageSwitcher from '../misc/LanguageSwitcher'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { cn } from '@/lib/utils'

const Header = () => {

  const tickers = [
      { label: 'SPX', value: '2,800.00', change: '+0.25%' },
      { label: 'NDX', value: '11,000.00', change: '+0.30%' },
      { label: 'RUT', value: '170.00', change: '+0.15%' },
  ]


  const { t } = useTranslationProvider();

  const sidebarItems = [
    { name: t('header.trading_portal'), url: 'https://www.clientam.com/sso/Login?partnerID=agmbvi2022' },
    { name: t('header.fill_risk_profile'), url: '/risk' },
    { name: t('header.learning_center'), url: '/learning' },
    { name: t('header.requirements'), url: '/requirements' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-10">
          <Link href="/" className="flex items-center space-x-2">
              <Image src="/assets/brand/agm-logo.png" alt="AGM Logo" width={150} height={50} />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {sidebarItems.map((item) => (
                  <Link href={item.url} target='_blank' rel='noopener noreferrer' className="transition-colors hover:text-primary">
                      {item.name}
                  </Link>
              ))}
          </nav>
          <div className='flex items-center gap-5'>
            <Button>
                <Link href="/apply">{t('header.apply_now')}</Link>
            </Button>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="w-full border-b bg-foreground text-white">
            <div className="mx-auto flex h-8 items-center gap-6 overflow-hidden px-5 text-xs uppercase tracking-wide">
            {tickers.map((ticker) => (
                <div key={ticker.label} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-semibold">{ticker.label}</span>
                <span>{ticker.value}</span>
                <span className={cn("font-medium", ticker.change.startsWith("-") ? "text-red-400" : "text-green-400")}>
                    {ticker.change}
                </span>
                </div>
            ))}
            </div>
        </div>
    </header>
  )
}

export default Header