import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const team = [
  {
    name: 'Hernan Castro',
    title: 'CEO'
  },
  {
    name: 'Ramon Castro',
    title: 'COO'
  },
  {
    name: 'Cristian Ramirez',
    title: ''
  },
  {
    name: 'Javier Cordero',
    title: ''
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
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <p className="text-2xl">{member.name}</p>
                    <p className="text-md font-light">{member.title}</p>
                  </div>
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
