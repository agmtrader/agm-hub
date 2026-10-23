'use client'
import React from 'react'
import { Button } from '../ui/button'
import { formatURL } from '@/utils/language/lang'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ES, US } from 'country-flag-icons/react/3x2'

const LanguageSwitcher = () => {

  const path = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  function handleChangeLang(lang: string) {

    const paths = path.split('/')
    paths[1] = lang
    const query = searchParams.toString()
    const target = formatURL(paths.join('/'), lang)
    router.push(`${target}${query ? `?${query}` : ''}${window.location.hash}`)
  }

  return (
      <div className='flex shrink-0 gap-1 w-fit'>
          <Button className='h-10 w-10 p-2' variant='ghost' aria-label='English' aria-pressed={path.split('/')[1] === 'en'} onClick={() => handleChangeLang('en')}>
            <US title='English' className='w-6 rounded-sm'/>
          </Button>
          <Button className='h-10 w-10 p-2' variant='ghost' aria-label='Español' aria-pressed={path.split('/')[1] === 'es'} onClick={() => handleChangeLang('es')}>
            <ES title='Spanish' className='w-6 rounded-sm'/>
          </Button>
      </div>
  )
}

export default LanguageSwitcher
