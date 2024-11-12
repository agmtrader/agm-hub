
import React from 'react'
import { Button } from '../ui/button'
import { changeLang, formatURL } from '@/utils/lang'
import { usePathname } from 'next/navigation'

type Props = {}

const LanguageSwitcher = (props: Props) => {
  const path = usePathname()
  return (
      <div className='flex gap-x-2'>
          <Button onClick={() => formatURL('en', path)}>EN</Button>
          <Button onClick={() => formatURL('es', path)}>ES</Button>
      </div>
  )
}

export default LanguageSwitcher