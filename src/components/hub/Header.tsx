'use client'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import LanguageSwitcher from '../misc/LanguageSwitcher'
import TickerHeader from '../misc/TickerHeader'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/language/lang'

const Header = () => {

  const { t, lang } = useTranslationProvider();

  const ibkrURL = 'https://www.clientam.com/sso/Login?partnerID=agmbvi2022'

  const sidebarItems = [
    { name: t('header.about'), url: '/#about' },
    { name: t('header.accounts'), url: '/#steps' },
    { name: t('header.tools'), url: '/#get-started' },
    { name: t('header.products'), url: '/#products' },
    { name: t('header.learning_center'), url: '/learning' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TickerHeader />
        <div className="container flex h-16 items-center justify-between py-10">
          <Link href={formatURL('/', lang)} className="flex items-center space-x-2">
              <Image src="/assets/brand/agm-logo.png" alt="AGM Logo" width={150} height={50} />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {sidebarItems.map((item) => (
                  <Link key={item.name} href={formatURL(item.url, lang)} className="transition-colors hover:text-primary">
                      {item.name}
                  </Link>
              ))}
          </nav>
          <div className='flex items-center gap-5'>
            <Button variant='ghost' asChild>
                <Link href={ibkrURL} target='_blank' rel='noopener noreferrer'>{t('header.sign_in')}</Link>
            </Button>
            <Button asChild>
                <Link href={formatURL('/apply', lang)} target='_blank' rel='noopener noreferrer'>{t('header.apply')}</Link>
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
    </header>
  )
}

export default Header
