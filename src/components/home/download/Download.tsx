"use client"
import React, {useState} from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Smartphone } from 'lucide-react'

import { DeviceTypes, osTypes } from '@/lib/types'

import { Button } from "../../ui/button"
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { FaApple, FaLinux, FaWindows, FaAndroid } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { downloads } from '@/lib/downloads';

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

  const { t } = useTranslationProvider()  

  const handleDownload = () => {
    if (device === null || os === null) return;
    
    const isDesktop = device === DeviceTypes.PC;
    const osIndex = os;
    
    // Get the download option based on the OS index
    const downloadOption = downloads[osIndex];
    const recommendedVersion = downloadOption?.versions.find(v => v.recommended);
    
    if (recommendedVersion?.url) {
      window.location.href = recommendedVersion.url;
    }
  };

  return (
    <motion.div 
      className='flex flex-col text-foreground justify-center text-center items-center h-full p-5 gap-y-10 w-full'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      id='download'
    >
      <motion.h2 className='text-5xl font-bold' variants={itemVariants}>{t('agm-trader.download.title')}</motion.h2>
      <motion.div className='flex flex-col justify-start items-center gap-y-10 h-fit' variants={itemVariants}>
        <p className='text-xl font-light'>{t('agm-trader.download.device')}</p>
        <div className='flex flex-row h-full gap-x-10'>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className='h-32 flex flex-col justify-center items-center' id='0' variant={device === DeviceTypes.PC ? 'primary':'secondary'} onClick={(event) => handleDevice(event)}>
              <Laptop size={'90%'} />
              <p className={cn('text-sm', device === DeviceTypes.PC ? 'text-background':'text-foreground')}>PC</p>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className='h-32 flex flex-col justify-center items-center' id='1' variant={device === DeviceTypes.MOBILE ? 'primary':'secondary'} onClick={(event) => handleDevice(event)}>
              <Smartphone size={'90%'}/>
              <p className={cn('text-sm', device === DeviceTypes.MOBILE ? 'text-background':'text-foreground')}>Mobile</p>
            </Button>
          </motion.div>
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
            <p className='text-xl font-light'>{t('agm-trader.download.operating_system')}</p>
            <div className='flex flex-row h-full gap-x-10'>
              <Button className='h-32 flex flex-col justify-center items-center' id='0' variant={os === osTypes.WINDOWS ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <FaWindows size={'90%'}/>
                <p className={cn('text-sm', os === osTypes.WINDOWS ? 'text-background':'text-foreground')}>Windows</p>
              </Button>
              <Button className='h-32 flex flex-col justify-center items-center' id='1' variant={os === osTypes.LINUX ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <FaLinux size={'90%'}/>
                <p className={cn('text-sm', os === osTypes.LINUX ? 'text-background':'text-foreground')}>Linux</p>
              </Button>
              <Button className='h-32 flex flex-col justify-center items-center' id='2' variant={os === osTypes.MACOS ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <FaApple size={'90%'}/>
                <p className={cn('text-sm', os === osTypes.MACOS ? 'text-background':'text-foreground')}>Mac</p>
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
            <p className='text-xl font-light'>{t('agm-trader.download.operating_system')}</p>
            <div className='flex flex-row h-full gap-x-10'>
              <Button className='h-32 flex flex-col justify-center items-center' id='3' variant={os === osTypes.ANDROID ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <FaAndroid size={'90%'}/>
                <p className={cn('text-sm', os === osTypes.ANDROID ? 'text-background':'text-foreground')}>Android</p>
              </Button>
              <Button className='h-32 flex flex-col justify-center items-center' id='4' variant={os === osTypes.IOS ? 'primary':'secondary'} onClick={(event) => handleOS(event)}>
                <FaApple size={'90%'} />
                <p className={cn('text-sm', os === osTypes.IOS ? 'text-background':'text-foreground')}>iOS</p>
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
            <Button onClick={handleDownload}>{t('agm-trader.download.download_now')}</Button>
          </motion.div>
        )}
      </AnimatePresence>


    </motion.div>
  )
}

export default Download