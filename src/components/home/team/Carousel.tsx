import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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

const team = [
  {
    name: 'Hernan Castro',
    title: 'Chief Executive Officer'
  },
  {
    name: 'Ramon Castro',
    title: 'Chief Operating Officer'
  },
  {
    name: 'Cristian Ramirez',
    title: 'Chief Financial Officer'
  },
  {
    name: 'Javier Cordero',
    title: 'Trade Support Specialist'
  },
  {
    name: 'Maria Jose Castro',
    title: 'Trade Support Specialist'
  },
  {
    name: 'Andres Aguilar',
    title: 'IT Specialist'
  }
]

export function TeamCarousel() {
  return (
    <Carousel className="w-full h-full max-w-[70%]">
      <CarouselContent>
        {team.map((member, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="w-full cursor-pointer h-full text-center flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold">{member.name}</p>
                          <p className="text-sm text-agm-orange">{member.title}</p>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{member.name}</DialogTitle>
                          <DialogDescription>{member.title}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        </div>
                      </DialogContent>
                    </Dialog>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}


