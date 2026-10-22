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
      <div className='flex gap-5 w-fit'>
          <Button className='p-0' variant='ghost' onClick={() => handleChangeLang('en')}>
            <US title='English' className='w-10 rounded-md'/>
          </Button>
          <Button className='p-0' variant='ghost' onClick={() => handleChangeLang('es')}>
            <ES title='Spanish' className='w-10 rounded-md'/>
          </Button>
      </div>
  )
}

export default LanguageSwitcher
