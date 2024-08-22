import { Handshake } from 'lucide-react'
import React from 'react'
import { Bank, GraphUpArrow, Mortarboard } from 'react-bootstrap-icons'

const services = [
  {
    name: 'AGM Trader',
    icon: <GraphUpArrow className='text-white h-[12vw] w-[12vw]'/>,
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
    icon: <Bank className='text-white h-[12vw] w-[12vw]'/>,
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
    <div className='flex flex-col h-full w-full'>
      <div className='bg-agm-blue w-full h-full justify-center items-center flex flex-col gap-y-16 py-20'>
      <p className='font-bold text-5xl text-agm-white'>Our Services</p>
        <Carousel className="w-full h-full max-w-[70%]">
          <CarouselContent>
            {services.map((service, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <div className="flex flex-col w-full justify-center items-center gap-y-5">
                <Card className='bg-agm-dark-blue p-2 border-0 text-agm-white'>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className='w-full h-full flex justify-center items-center cursor-pointer'>
                            {service.icon}
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className='text-agm-dark-blue'>{service.name}</DialogTitle>
                          </DialogHeader>
                          <div className="text-agm-dark-blue grid gap-4 py-4">
                            <p>{service.description}</p>
                            <Button asChild>
                              <Link href={service.url}>
                                Learn More
                              </Link>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                  <p className='text-agm-white w-fit text-center text-lg font-semibold'>{service.name}</p>
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

