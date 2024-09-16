"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import useScrollPositions from '@/hooks/useScrollPositions'

import {motion, AnimatePresence} from 'framer-motion'
import { List } from 'react-bootstrap-icons'
import Sidebar from './sidebar/Sidebar'

const maxScroll = 100

export const Header = () => {

  var scroll = useScrollPositions()

  const [expandSidebar, setExpandSidebar] = useState(false)

  return (
    <div>
      <AnimatePresence>
        {scroll > maxScroll ? 
          <motion.div initial={{y:-100}} animate={{y:0}} transition={{y: { type: "spring", bounce: 0 }}} className='flex items-center justify-between fixed w-full h-fit px-5 py-5 z-10 bg-background'>
              <Link className='w-full h-full flex items-center' href={'/'}>
                <Button className='bg-transparent h-full' variant='ghost'>
                  <Image src={'/images/brand/agm-logo.png'} alt = 'AGM Logo' height = {200} width = {200}/>
                </Button>
              </Link>
              <Button variant='ghost' onClick={() => setExpandSidebar(true)}>
                <List className='text-2xl text-agm-dark-blue'/>
              </Button>
          </motion.div>
          :
          <div className='flex items-center justify-between fixed px-5 w-full h-fit py-10 z-10 bg-transparent'>
              <div></div>
              <Button onClick={() => setExpandSidebar(true)}>
                <List className='text-2xl'/>
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

type Props = {
  dark?: boolean
  bg?: boolean
}

export const FormHeader = ({dark, bg}: Props) => {

  const [expandSidebar, setExpandSidebar] = useState(false)

  return (
    <div className='w-full h-full flex justify-between items-center'>
      <AnimatePresence>
          <div className='flex items-center justify-between px-5 w-full h-fit py-5 z-10'>
            <Link className='w-full h-full flex items-center' href={'/'}>
                <Button className='h-full' variant='ghost'>
                  <Image src={'/images/brand/agm-logo.png'} alt = 'AGM Logo' width = {200} height={75}/>
                </Button>
              </Link>
            <Button onClick={() => setExpandSidebar(true)}>
              <List className='text-2xl'/>
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