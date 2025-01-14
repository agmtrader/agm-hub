
import React from 'react'
import { Button } from '../ui/button'
import { formatURL } from '@/utils/lang'
import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation'
import { ES, US } from 'country-flag-icons/react/3x2'

type Props = {}

const LanguageSwitcher = (props: Props) => {

  const path = usePathname()
  function handleChangeLang(lang: string) {

    const paths = path.split('/')
    paths[1] = lang
    redirect(formatURL(paths.join('/'), lang))
  }

  return (
      <div className='flex gap-5 w-fit'>
          <Button className='w-fit h-fit p-0' variant='ghost' onClick={() => handleChangeLang('en')}>
            <US title='English' className='w-full h-6 rounded-md'/>
          </Button>
          <Button className='w-fit h-fit p-0' variant='ghost' onClick={() => handleChangeLang('es')}>
            <ES title='Spanish' className='w-full h-6 rounded-md'/>
          </Button>
      </div>
  )
}

export default LanguageSwitcher