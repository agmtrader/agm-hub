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
      <div className='bg-black w-[100vw] fixed h-[100vh]  z-10 bg-opacity-50'></div>
        <motion.div initial={{x:500}} animate={{x:0}} exit={{x:500}} transition={{duration:0.2  , y: { type: "spring", bounce: 0 }}} className='z-10 flex flex-col gap-y-5 items-end justify-start fixed right-0 w-fit p-10 h-full bg-agm-white'>
        <NavigationMenu className="h-full w-full flex">
            <NavigationMenuList className="w-full gap-y-5 h-[80vh] justify-between flex flex-col">
              <div className='w-full h-fit flex justify-end items-start'>
                <Button variant={'ghost'} onClick={() => setExpandSidebar(false)}>
                  X
                </Button>
              </div>
                <div className="w-full h-full flex flex-col justify-start gap-y-5 items-start">
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
                    <Account />
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