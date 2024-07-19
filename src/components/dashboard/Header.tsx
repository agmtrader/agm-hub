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
          <div>
            <div className='bg-black w-[100vw] fixed h-[100vh] z-10 bg-opacity-50'></div>
            <motion.div initial={{x:500}} animate={{x:0}} exit={{x:500}} transition={{duration:0.2  , y: { type: "spring", bounce: 0 }}} className='z-10 flex flex-col gap-y-5 items-end justify-start fixed right-0 w-[15vw] p-10 h-full bg-agm-white'>
              <div className='w-full h-fit flex justify-end items-start'>
                <Button variant={'ghost'} onClick={() => setExpandSidebar(false)}>
                  X
                </Button>
              </div>
              <Sidebar setExpandSidebar={setExpandSidebar}/>
            </motion.div>
          </div>
          }
      </AnimatePresence>
    </div>
  )
}

export default Header