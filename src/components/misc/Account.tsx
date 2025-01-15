import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from '../ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { NavigationMenuLink } from '@radix-ui/react-navigation-menu'
import { navigationMenuTriggerStyle } from '../ui/navigation-menu'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from 'framer-motion' // Add this import
import { formatURL, getCallbackUrl } from '@/utils/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

type Props = {
}

const Account = ({}: Props) => {
  
  const {data:session} = useSession()
  const { lang, t } = useTranslationProvider()

  let callbackUrl = getCallbackUrl(window.location.pathname);
  
  return (
    <div className='h-fit w-full flex flex-col justify-center items-center'>
      <AnimatePresence>
        {session?.user ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Popover>
              <PopoverTrigger asChild className='w-fit h-full'>
                <Button variant='ghost' className='flex flex-col hover:bg-muted gap-y-5 w-full h-full hover:bg-agm-black/5'>
                  <div className='flex w-full text-agm-dark-blue h-full items-center gap-x-5'>
                    {session.user.image ?
                      <img className='rounded-full w-10 h-10' src={session?.user.image!} referrerPolicy="no-referrer" alt={'Missing'}/>
                      :
                      <div className='w-10 h-10 rounded-full bg-primary'></div>
                    }

                    {session.user.name ?
                      <p className='text-sm'>{session?.user.name}</p>
                      :
                      <p className='text-sm'>Anonymous</p>
                    }
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full h-full flex justify-center items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className='w-fit h-full flex text-agm-dark-blue justify-center items-center'
                >
                  <Button onClick={() => signOut({callbackUrl: callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang)})} className="flex">
                      <p className="text-sm">{t('shared.account.sign_out')}</p>
                  </Button>
                  <Link href="/profile" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), '')}>
                      <div className="flex">
                          <p className="text-sm">{t('shared.account.settings')}</p>
                      </div>
                  </NavigationMenuLink>
                </Link>
                </motion.div>
              </PopoverContent>
            </Popover>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className='flex w-full gap-x-5 justify-center items-center'
          >
            <Button
              className="flex w-fit h-full justify-center items-center"
            >
              <Link 
                href={
                  callbackUrl ? 
                    formatURL(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, lang) 
                    : 
                    formatURL('/signin', lang)
                }
              >
                <p className="text-sm">Sign in</p>
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Account