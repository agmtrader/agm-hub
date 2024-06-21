"use client"

import * as React from "react"
import Link from "next/link"

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
import { Home } from "lucide-react"

import Account from "./Account"

import {
  Card,
  CardContent,
  CardDescription, 
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const navbarContent = [
    {
        'name':'Clients',
        'url':'/dashboard/clients'
    },
    {
        'name':'Open Account',
        'url':'/dashboard/open_account'
    },
    {
      'name':'Document Center',
      'url':'/dashboard/document_center'
  },
]

import { usePathname } from "next/navigation"

const Sidebar = () => {

  return (

    <Card className="border-0 bg-agm-dark-blue">
      <CardHeader>
        <CardTitle>
          <p className='text-3xl text-white font-bold'>AGM Dashboard</p>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col'>
        <NavigationMenu className="h-full w-full flex">
            <NavigationMenuList className="w-full gap-y-5 h-full justify-between flex flex-col">
                <div className="w-full h-full flex flex-col justify-start gap-y-5 items-start">
                    {navbarContent.map((item) => (
                        <NavigationMenuItem key={item.name} className="flex w-full h-fit justify-start">
                            <Link href={item.url} legacyBehavior passHref>
                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'w-full bg-agm-dark-blue hover:bg-agm-light-blue text-white hover:text-white')}>
                                    <div className="flex w-full text-start">
                                        <p className="text-sm">{item.name}</p>
                                    </div>
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    ))}
                </div>
                <NavigationMenuItem className="flex w-full h-fit ">
                    <Account />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
      </CardContent>
    </Card>
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