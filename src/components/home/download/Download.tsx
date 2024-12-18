"use client"
import React, {useState} from 'react'

import { motion, AnimatePresence } from "framer-motion";

import { Laptop, Smartphone } from 'lucide-react'

import { Globe } from 'lucide-react';
import { FaLinux, FaApple, FaWindows} from 'react-icons/fa';
import { IoLogoAndroid } from 'react-icons/io';

import { DeviceTypes, osTypes } from '@/lib/types'

import { Button } from "../../ui/button"
import Link from 'next/link';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { isMobile, isWindows, isMacOs, isIOS, isAndroid } from 'react-device-detect';
import { containerVariants, itemVariants } from '@/lib/anims';

type Props = {}

function Download({}: Props) {

  const [device, setDevice] = useState<number|null>(() => {
    return isMobile ? DeviceTypes.MOBILE : DeviceTypes.PC;
  });

  const [os, setOS] = useState<number|null>(() => {
    console.log('Autodetected device:', isMobile, isIOS, isAndroid, isWindows, isMacOs)
    if (isMobile) {
      if (isIOS) return osTypes.IOS;
      if (isAndroid) return osTypes.ANDROID;
    } else {
      if (isWindows) return osTypes.WINDOWS;
      if (isMacOs) return osTypes.MACOS;
      // Assume Linux if not Windows or MacOS
      return osTypes.LINUX;
    }
    return null;
  });

  const downloadLinks = [
    { os: osTypes.WINDOWS, link: "https://download-windows-link.com" },
    { os: osTypes.LINUX, link: "https://download-linux-link.com" },
    { os: osTypes.MACOS, link: "https://download-macos-link.com" },
    { os: osTypes.ANDROID, link: "https://download-android-link.com" },
    { os: osTypes.IOS, link: "https://download-ios-link.com" },
  ];

  const { t } = useTranslationProvider()
  
  return (
    <motion.div 
      className='flex flex-col text-foreground py-20 justify-center text-center items-center h-full gap-y-10 w-full'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      <h1 className='text-5xl font-bold'>{t('agm-trader.download.title')}</h1>

      <Button>
        <Link href={downloadLinks.find(link => link.os === os)?.link || ''}>
          {t('agm-trader.download.download_now')}
        </Link>
      </Button>

    </motion.div>
  )
}

export default Download
