
import React from 'react'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { changeLang } from '@/utils/lang'

type Props = {}

const LanguageSwitcher = (props: Props) => {

  const path = usePathname()

  // Change to use router.push instead of redirect
  const router = useRouter()
  const handleLanguageSwitch = (lang: string) => {
      const newPath = changeLang(lang, path)
      router.push(newPath)
  }

  return (
      <div className='flex gap-x-2'>
          <Button onClick={() => handleLanguageSwitch('en')}>EN</Button>
          <Button onClick={() => handleLanguageSwitch('es')}>ES</Button>
      </div>
  )
}

export default LanguageSwitcher