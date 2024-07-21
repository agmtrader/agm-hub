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

  var scroll = useScrollPositions()

  const [expandSidebar, setExpandSidebar] = useState(false)

  return (
    <div>
      <AnimatePresence>
        {scroll > maxScroll ? 
          <motion.div initial={{y:-100}} animate={{y:0}} exit={{y:-100}} transition={{y: { type: "spring", bounce: 0 }}} className='flex items-center justify-between fixed w-full h-[10vh] px-5 z-10 bg-agm-white'>
              <Link className='w-full h-full flex items-center' href={'/'}>
                <Button variant={'ghost'}>
                  <Image src={'/images/brand/agm-logo.png'} height = {150} width = {120} alt = 'AGM Logo' fill={false}/>
                </Button>
              </Link>
              <Button variant={'ghost'} onClick={() => setExpandSidebar(true)}>
                <List />
              </Button>
          </motion.div>
          :
          <div className='flex items-center justify-between fixed w-full h-fit py-5 z-10 bg-transparent'>
            <Link className='w-full h-full flex items-center' href={'/'}>
                <Button variant={'ghost'} className='hover:bg-opacity-0 hover:bg-black'>
                  <Image src={'/images/brand/agm-logo-white.png'} alt = 'AGM Logo' height = {150} width = {120}/>
                </Button>
              </Link>
            <Button variant={'ghost'} className='hover:bg-black hover:bg-opacity-10' onClick={() => setExpandSidebar(true)}>
              <List className='text-agm-white'/>
            </Button>
          </div>
        }
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