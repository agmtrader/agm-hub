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
    <Carousel className="w-full h-full max-w-[80%]">
      <CarouselContent>
        {team.map((member, index) => (
          <CarouselItem key={index} className="basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <div className="w-full h-full flex flex-col justify-evenly items-center">
                    <p className="text-sm font-bold">{member.name}</p>
                    <p className="text-sm font-light">{member.title}</p>
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
