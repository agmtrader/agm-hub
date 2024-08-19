import { Handshake } from 'lucide-react'
import React from 'react'
import { GraphUpArrow, Mortarboard } from 'react-bootstrap-icons'

const services = [
  {
    name: 'AGM Trader',
    icon: <GraphUpArrow className='text-white h-[12vw] w-[12vw]'/>,
    description:''
  },
  {
    name: 'AGM Advisor',
    icon: <Mortarboard className='text-white h-[12vw] w-[12vw]'/>,
    description:''
  },
  {
    name: 'AGM Institutional',
    icon: <Handshake className='text-white h-[12vw] w-[12vw]'/>,
    description:''
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
        <Carousel className="w-full h-full max-w-[70%]">
          <CarouselContent>
            {services.map((service, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <div className="p-1">
                  <Card className='bg-agm-dark-blue border-0 text-white'>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className='w-full h-full flex justify-center items-center cursor-pointer'>
                            {service.icon}
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{service.name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <p>{service.description}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
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