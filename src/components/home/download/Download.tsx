"use client"
import React, {useState} from 'react'

import { motion, AnimatePresence } from "framer-motion";

import { Laptop, Smartphone } from 'lucide-react'
import { Apple, Windows, Ubuntu, Android2, Globe } from 'react-bootstrap-icons'

import { DeviceTypes, osTypes } from '@/lib/types'

import { Button } from "../../ui/button"
import Link from 'next/link';

type Props = {}

function Download({}: Props) {

  const [device, setDevice] = useState<number|null>(null)
  const [os, setOS] = useState<number|null>(null)

  function handleDevice(e:React.MouseEvent) {
    const id = Number(e.currentTarget.id)
    if (device === id) {
      setOS(null)
      setDevice(null)
    } else {
      if (device !== null) {
        setOS(null)
        setDevice(null)
        setDevice(id)
      } else {
        setOS(null)
        setDevice(id)
      }
    }
  }

  function handleOS(e:React.MouseEvent) {
    const id = Number(e.currentTarget.id)
    if (os === id) {
      setOS(null)
    } else {
      setOS(id)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className='flex flex-col text-foreground py-20 justify-center text-center items-center h-full gap-y-10 w-full'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      <motion.h2 className='text-5xl font-bold' variants={itemVariants}>Use Our Apps</motion.h2>
      <motion.div className='flex flex-col justify-start items-center gap-y-10 h-fit' variants={itemVariants}>
        <p className='text-xl font-light'>First of all, what device are you using?</p>
        <div className='flex flex-row h-full gap-x-10'>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className='h-32' id='0' variant={device === DeviceTypes.PC ? 'primary':'secondary'} onClick={(event) => handleDevice(event)}>
              <Laptop size={'90%'} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className='h-32' id='1' variant={device === DeviceTypes.MOBILE ? 'primary':'secondary'} onClick={(event) => handleDevice(event)}>
              <Smartphone size={'90%'}/>
            </Button>
          </motion.div>
          <Button asChild variant='secondary' className='h-32'>
            <Link href={'https://www.clientam.com/sso/Login?partnerID=agmbvi2022'} rel="noopener noreferrer" target="_blank" className='w-32'>
              <Globe size={'90%'}/>
            </Link>
          </Button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {device === DeviceTypes.PC && (
          <motion.div 
            key='pc' 
            className='flex flex-col items-center h-full gap-y-10 justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className='text-xl font-light'>Confirm your operating system</p>
            <div className='flex flex-row h-full gap-x-10'>
              <Button className='h-32' id='0' variant={os === osTypes.WINDOWS ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <Windows size={'90%'}/>
              </Button>
              <Button className='h-32' id='1' variant={os === osTypes.LINUX ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <Ubuntu size={'90%'}/>
              </Button>
              <Button className='h-32' id='2' variant={os === osTypes.MACOS ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <Apple size={'90%'}/>
              </Button>
            </div>
          </motion.div>
        )}

        {device === DeviceTypes.MOBILE && (
          <motion.div 
            key='mobile' 
            className='flex flex-col items-center h-full gap-y-10 justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className='text-xl font-light'>Confirm your operating system</p>
            <div className='flex flex-row h-full gap-x-10'>
              <Button className='h-32' id='3' variant={os === osTypes.ANDROID ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <Android2 size={'90%'}/>
              </Button>
              <Button className='h-32' id='4' variant={os === osTypes.IOS ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <Apple size={'90%'} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {device !== null && os !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button>Download now.</Button>
          </motion.div>
        )}
      </AnimatePresence>


    </motion.div>
  )
}

export default Download
