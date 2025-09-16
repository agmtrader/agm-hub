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
import { Button } from "./ui/button"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { formatURL } from "@/utils/language/lang"
import { X } from "lucide-react"
import LanguageSwitcher from "./misc/LanguageSwitcher"
import { useSession } from "next-auth/react"

interface Props {
  setExpandSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({ setExpandSidebar }: Props) => {

  const { lang, t } = useTranslationProvider()
  const {data: session} = useSession()

  const navbarContent = [
    { name: 'AGM Home', url: '/' },
    { name: 'AGM Trader', url: '/trader' },
    { name: 'AGM Advisor', url: '/advisor' },
    { name: 'AGM Institutional', url: '/institutional'},
    { name: 'AGM Account Portal', url: 'https://www.clientam.com/sso/Login?partnerID=agmbvi2022' },
    { name: t('sidebar.apply'), url: '/apply' },
    { name: t('sidebar.risk'), url: '/apply/risk' },
    { name: t('sidebar.learning'), url: '/learning' },
    { name: t('sidebar.requirements'), url: '/requirements' },
    { name: t('sidebar.downloads'), url: '/downloads' },
    { name: t('sidebar.fees'), url: '/fees' },
  ]

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
          <NavigationMenuList className="w-full py-4 flex flex-col items-end justify-end gap-4">
            <Button className="w-fit p-2" variant='ghost' onClick={() => setExpandSidebar(false)}>
                <X className="w-6 h-6"/>
            </Button>
            <NavigationMenuItem className="flex w-full text-end justify-end items-end">
              <LanguageSwitcher />
            </NavigationMenuItem>
            {navbarContent.map((item, index) => (
              <NavigationMenuItem key={index} onClick={() => setExpandSidebar(false)} className="w-full text-end">
                <Link href={formatURL(item.url, lang)} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-end")}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}

            {session?.user?.scopes?.includes('all') && (
              <NavigationMenuItem className="w-full text-end">
                <Link href={formatURL('/dashboard', lang)} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-end")}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            
          </NavigationMenuList>
        </NavigationMenu>
      </motion.div>
    </div>

  )
}

export default Sidebar