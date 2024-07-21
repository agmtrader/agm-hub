"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import useScrollPositions from '@/hooks/useScrollPositions'

import {motion, AnimatePresence} from 'framer-motion'
import { List } from 'react-bootstrap-icons'
import Sidebar from '../sidebar/Sidebar'

const maxScroll = 100

type Props = {}

const Header = (props: Props) => {

  const [expandSidebar, setExpandSidebar] = useState(false)

  return (
    <div>
      <AnimatePresence>
        <div className='flex items-center justify-between w-full h-fit py-5 z-10 bg-transparent'>
        <Link className='w-full h-full flex items-center' href={'/'}>
            <Button variant={'ghost'} className='hover:bg-opacity-0 hover:bg-black'>
                <Image src={'/images/brand/agm-logo-white.png'} alt = 'AGM Logo' height = {150} width = {120}/>
            </Button>
            </Link>
        <Button variant={'ghost'} className='hover:bg-black hover:bg-opacity-10' onClick={() => setExpandSidebar(true)}>
            <List className='text-agm-white'/>
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