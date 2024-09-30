import { Baby, Handshake, ArrowUp } from 'lucide-react'
import React from 'react'

const services = [
  {
    name: 'AGM Trader',
    icon: <ArrowUp className='text-white h-[12vw] w-[12vw]'/>,
    description: 'We provide easy trading and investing access through our mobile, desktop and web applications connected to more than 150 financial markets worldwide.',
    url: 'https://agmtrader.com'
  },
  {
    name: 'AGM Advisor',
    icon: <Handshake className='text-white h-[12vw] w-[12vw]'/>,
    description:'We also provide Advisory services for those clients that would like to delegate a portion of their financial assets or wealth through our advisory division.',
    url:'https://agm-advisor.vercel.app'
  },
  {
    name: 'AGM Institutional',
    icon: <Baby className='text-white h-[12vw] w-[12vw]'/>,
    description:'Our Institutional division provides world class execution services to the most sophisticated institutions like Advisory Firms, Hedge Funds, Broker/Dealers, Wealth Management firms, Insurance companies and more.',
    url:'https://agm-institutional.vercel.app'
  }
]

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export function Services() {
  return (
    <div className='flex flex-col h-fit w-full'>
      <div className='bg-secondary w-full h-full justify-center items-center flex flex-col gap-y-16 py-20'>
      <p className='font-bold text-5xl text-background'>Our Services</p>
        <Carousel className="w-full h-full max-w-[90%]">
          <CarouselContent>
            {services.map((service, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <div className="flex flex-col w-full justify-center items-center gap-y-5">
                <Card className='bg-primary-dark p-2 border-0 text-agm-white'>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className='w-full h-full flex justify-center text-foreground items-center cursor-pointer'>
                            {service.icon}
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-background">
                          <DialogHeader>
                            <DialogTitle className='text-foreground'>{service.name}</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            {service.description}
                          </DialogDescription>
                          <DialogFooter>
                          <Button asChild>
                              <Link href={service.url}>
                                Learn More
                              </Link>
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                  <p className='text-background w-fit text-center text-lg font-semibold'>{service.name}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}

export default Services

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

