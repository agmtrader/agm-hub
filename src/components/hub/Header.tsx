'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import LanguageSwitcher from '../misc/LanguageSwitcher'
import TickerHeader from '../misc/TickerHeader'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/language/lang'
import { usePathname, useSearchParams } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

const Header = () => {

  const { t, lang } = useTranslationProvider();
  const [menuOpen, setMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isProviderSurface = pathname?.includes('/apply') || pathname?.includes('/requirements');
  const providerId = isProviderSurface
    ? searchParams.get('provider_id') || searchParams.get('provider') || searchParams.get('application_provider') || (pathname?.includes('/apply') ? searchParams.get('id') : null)
    : null;
  const providerLogoId = providerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(providerId)
    ? providerId
    : null;
  const logoSrc = providerLogoId
    ? `/assets/providers/${providerLogoId}.png`
    : '/assets/brand/agm-logo.png';
  const logoAlt = providerLogoId ? 'Application provider logo' : 'AGM Logo';

  const ibkrURL = 'https://www.clientam.com/sso/Login?partnerID=agmbvi2022'

  const sidebarItems = [
    { name: t('header.about'), url: '/#about' },
    { name: t('header.accounts'), url: '/#steps' },
    { name: t('header.products'), url: '/#products' },
    { name: t('header.tools'), url: '/#get-started' },
    { name: t('header.learning_center'), url: '/resource-center' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TickerHeader />
        <div className="container flex min-h-16 items-center justify-between gap-3 py-3 lg:py-4">
          {providerId ? (
            <div aria-label={logoAlt} className="flex min-w-0 shrink-0 items-center cursor-default">
              <Image src={logoSrc} alt={logoAlt} width={200} height={50} className="h-9 w-auto max-w-[150px] object-contain sm:h-[50px]" />
            </div>
          ) : (
            <Link href={formatURL('/', lang)} className="flex shrink-0 items-center">
              <Image src={logoSrc} alt={logoAlt} width={150} height={50} className="h-auto w-[104px] object-contain sm:w-[140px] xl:w-[150px]" />
            </Link>
          )}
          {!providerId && (
            <nav className="hidden xl:flex items-center gap-5 text-sm font-medium">
                {sidebarItems.map((item) => (
                    <Link key={item.name} href={formatURL(item.url, lang)} className="transition-colors hover:text-primary">
                        {item.name}
                    </Link>
                ))}
            </nav>
          )}
          <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
            {!providerId && <>
              <Button variant='ghost' asChild className='hidden md:inline-flex'>
                  <Link href={ibkrURL} target='_blank' rel='noopener noreferrer'>{t('header.sign_in')}</Link>
              </Button>
              <Button asChild className='hidden md:inline-flex'>
                  <Link href={formatURL('/apply', lang)} target='_blank' rel='noopener noreferrer'>{t('header.apply')}</Link>
              </Button>
            </>}
            <LanguageSwitcher />
            {!providerId && (
              <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 xl:hidden" aria-label={lang === 'es' ? 'Abrir menú' : 'Open menu'}>
                    <Menu className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{lang === 'es' ? 'Menú' : 'Menu'}</DialogTitle>
                  </DialogHeader>
                  <nav aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'} className="flex flex-col gap-1">
                    {sidebarItems.map((item) => (
                      <Link key={item.url} href={formatURL(item.url, lang)} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="grid gap-3 border-t pt-4 sm:grid-cols-2">
                    <Button variant="outline" asChild><Link href={ibkrURL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>{t('header.sign_in')}</Link></Button>
                    <Button asChild><Link href={formatURL('/apply', lang)} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>{t('header.apply')}</Link></Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
    </header>
  )
}

export default Header
