"use client"
import Link from "next/link"
import React from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { motion } from "framer-motion"
import Account from "./Account"
import { Button } from "../ui/button"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"

const navbarContent = [
  { name: 'AGM Home', url: '/' },
  { name: 'AGM Trader', url: '/trader' },
  { name: 'AGM Advisor', url: '/advisor' },
  { name: 'AGM Institutional', url: '/institutional'},
  { name: 'AGM Portal', url: 'https://www.clientam.com/sso/Login?partnerID=agmbvi2022' },
  { name: 'AGM Dashboard', url: '/dashboard' },
  { name: 'Apply for an account', url: '/apply' },
]

interface Props {
  setExpandSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({ setExpandSidebar }: Props) => {
  const { lang } = useTranslationProvider()

  function formatURL(path: string) {
    if (path.includes('https://')) {
      return path
    }

    if (!path.includes('/en') && !path.includes('/es')) {
      let paths = path.split('/')
      paths.splice(1, 0, lang)
      return paths.join('/')
    }

    return path
  }

  return (
    <div>
      <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={() => setExpandSidebar(false)} />
      <motion.div
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        exit={{ x: 500 }}
        transition={{ duration: 0.2, type: "spring", bounce: 0 }}
        className='z-50 fixed right-0 top-0 w-fit h-full bg-background shadow-lg'
      >
        <NavigationMenu className="h-full w-full flex flex-col justify-between p-5">
          <NavigationMenuList className="w-full flex-grow flex flex-col gap-y-4">
            <Button variant={'ghost'} className="self-end my-5" onClick={() => setExpandSidebar(false)}>
              X
            </Button>
            {navbarContent.map((item, index) => (
              <NavigationMenuItem key={index} onClick={() => setExpandSidebar(false)} className="w-full text-end">
                <Link href={formatURL(item.url)} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-end")}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
          <Account dark={false} />
        </NavigationMenu>
      </motion.div>
    </div>
  )
}

export default Sidebar