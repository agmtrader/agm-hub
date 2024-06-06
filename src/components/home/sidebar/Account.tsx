import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from '../../ui/button'

import Link from 'next/link'

import { cn } from '@/lib/utils'
import { NavigationMenuLink } from '@radix-ui/react-navigation-menu'
import { navigationMenuTriggerStyle } from '../../ui/navigation-menu'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {}

const Account = (props: Props) => {
  
    const {data:session} = useSession()
    console.log(session)
  return (
    <div className='h-full w-full flex flex-col justify-end items-end'>
      {session?.user ?
        <Popover>
        <PopoverTrigger asChild>
          <Button variant={'ghost'} className='flex flex-col gap-y-5 w-full h-full'>
            <div className='flex w-full h-full items-center gap-x-5'>
              <p className='text-sm'>{session?.user.name}</p>
              <img className='rounded-full w-10 h-10' src={session?.user.image!} referrerPolicy="no-referrer" alt={''}/>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit h-full flex justify-center items-center">
          {session?.user &&
            <div className='w-fit h-full flex justify-center items-center'>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), '')}>
                    <div className="flex">
                        <p className="text-sm">Sign out</p>
                    </div>
                </NavigationMenuLink>
              </Link>
              <Button onClick={() => signOut()} variant={'ghost'}>
                <p className="text-sm">Sign out</p>
              </Button>
            </div>
          }
        </PopoverContent>
      </Popover>
        :
        <Button onClick={() => signIn('google')} variant={'ghost'}>
          <p className="text-sm">Sign in</p>
        </Button>
      }
    </div>
  )
}

export default Account