"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import useScrollPositions from '@/hooks/useScrollPositions'

import {motion, AnimatePresence} from 'framer-motion'
import { List } from 'react-bootstrap-icons'
import Sidebar from '../sidebar/Sidebar'
import { cn } from '@/lib/utils'

const maxScroll = 100

type Props = {
  dark: boolean
  bg?: boolean
}

const Header = ({dark, bg}: Props) => {

  const [expandSidebar, setExpandSidebar] = useState(false)

  return (
    <div className='w-full h-full flex'>
      <AnimatePresence>
          <div className={cn('flex items-center justify-between fixed w-full h-fit py-5 z-10 bg-transparent', bg && 'bg-agm-white')}>
            <Link className='w-full h-full flex items-center' href={'/'}>
                <Button variant={'ghost'} className='hover:bg-opacity-0 hover:bg-black'>
                  <Image src={dark ? '/images/brand/agm-logo-white.png':'/images/brand/agm-logo.png'} alt = 'AGM Logo' height = {150} width = {120}/>
                </Button>
              </Link>
            <Button variant={'ghost'} className='hover:bg-black hover:bg-opacity-10' onClick={() => setExpandSidebar(true)}>
              <List className={cn('text-agm-black', dark && 'text-agm-white')}/>
            </Button>
          </div>
      </AnimatePresence>
      <AnimatePresence>
        {expandSidebar &&
          <Sidebar setExpandSidebar={setExpandSidebar}/>
        }
      </AnimatePresence>
    </div>
  )
}

export default Header