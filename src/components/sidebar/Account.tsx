import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from '../ui/button'

import Link from 'next/link'

import { cn } from '@/lib/utils'
import { NavigationMenuLink } from '@radix-ui/react-navigation-menu'
import { navigationMenuTriggerStyle } from '../ui/navigation-menu'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  dark?:boolean
}

const Account = ({dark}: Props) => {
  
  const {data:session} = useSession()

  return (
    <div className='h-full w-full flex flex-col justify-end items-end'>
      {session?.user ?
        <Popover>
          <PopoverTrigger asChild className='w-full h-full'>
            <Button variant='ghost' className='flex flex-col gap-y-5 w-full h-full hover:bg-agm-black/5'>
              <div className='flex w-full h-full items-center gap-x-5'>
                {session.user.image ?
                  <img className='rounded-full w-10 h-10' src={session?.user.image!} referrerPolicy="no-referrer" alt={'Missing'}/>
                  :
                  <div className='w-10 h-10 rounded-full bg-agm-orange'></div>
                }

                {session.user.name ?
                  <p className={cn('text-sm text-agm-black', dark && 'text-agm-white')}>{session?.user.name}</p>
                  :
                  <p className={cn('text-sm text-agm-black', dark && 'text-agm-white')}>Anonymous</p>
                }
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full h-full flex justify-center items-center">
            {session?.user &&
              <div className='w-fit h-full flex justify-center items-center'>
                  <Button onClick={() => signOut()} className="flex">
                      <p className="text-sm">Sign out</p>
                  </Button>
                  <Link href="/profile" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), '')}>
                      <div className="flex">
                          <p className="text-sm">Settings</p>
                      </div>
                  </NavigationMenuLink>
                </Link>
              </div>
            }
          </PopoverContent>
        </Popover>
        :
        <Button onClick={(e) => {
            e.preventDefault()
            signIn('google')
          }}
          className="flex"
        >
            <p className="text-sm">Sign in</p>
        </Button>
      }
    </div>
  )
}

export default Account