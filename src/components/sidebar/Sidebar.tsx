"use client"
import Link from "next/link"

import React from "react"

import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { motion } from "framer-motion"

import Account from "./Account"
import { Button } from "../ui/button"

const navbarContent = [
  {
    'name':'AGM Home',
    'url':'/'
  },
  {
    'name':'AGM Trader',
    'url':'https://agmtrader.com'
  },
  {
    'name':'AGM Advisor',
    'url':'https://agm-advisor.vercel.app'
  },
  {
    'name':'AGM Institutional',
    'url':'https://agm-institutional.vercel.app'
  },
  {'name':'AGM Portal',
    'url':'https://www.clientam.com/sso/Login?partnerID=agmbvi2022'
  },
  {
    'name':'AGM Dashboard',
    'url':'/dashboard'
  },
  {
    'name':'Apply for an account',
    'url':'/apply'
  },
]

interface Props {
  setExpandSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({setExpandSidebar}:Props) => {

  return (
    <div>
      <div className='bg-black w-[100vw] fixed h-[100vh] z-10 bg-opacity-50'></div>
        <motion.div initial={{x:500}} animate={{x:0}} exit={{x:500}} transition={{duration:0.2  , y: { type: "spring", bounce: 0 }}} className='z-10 flex flex-col gap-y-5 items-end justify-start fixed right-0 w-fit py-10 px-6 h-full bg-agm-white'>
        <NavigationMenu className="h-full w-full flex justify-start items-start">
            <NavigationMenuList className="w-full gap-y-5 h-[90vh] justify-between flex flex-col">
              <div className='w-full text-agm-dark-blue h-fit flex flex-col gap-y-5 justify-end items-end'>
                <Button variant={'ghost'} onClick={() => setExpandSidebar(false)}>
                  X
                </Button>
                {navbarContent.map((item, index) => (
                    <NavigationMenuItem key={index} onClick={() => setExpandSidebar(false)} className="flex w-full h-fit justify-end">
                        <Link href={item.url} legacyBehavior passHref>
                            <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                                <div className="flex">
                                    <p className="text-sm">{item.name}</p>
                                </div>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}
                </div>
                <NavigationMenuItem className="flex w-full h-fit">
                    <Account dark={false}/>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
      </motion.div>
    </div>
  )
}

export default Sidebar


const ListItem = React.forwardRef<
React.ElementRef<"a">,
React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
return (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
)
})
ListItem.displayName = "ListItem"