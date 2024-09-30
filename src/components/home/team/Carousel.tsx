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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const team = [
  {
    name: 'Hernan Castro',
    title: 'Chief Executive Officer',
    description: 'Mr. Castro has also more than 30 years of experience in the securities markets and is also a founding partner of AGM and as such has helped the firm become an International Broker/Dealer and Advisor. Mr. Castro is not only our Chief Operating Officer, but he oversees our Investment Advisory Division. Mr. Castro has been registered with FINRA in the USA as a Series 7 and Serie 66 under CRD # 4575350.'
  },
  {
    name: 'Ramon Castro',
    title: 'Chief Operating Officer',
    description: 'Mr. Castro has also more than 30 years of experience in the securities markets and is also a founding partner of AGM and as such has helped the firm become an International Broker/Dealer and Advisor. Mr. Castro is not only our Chief Operating Officer, but he oversees our Investment Advisory Division. Mr. Castro has been registered with FINRA in the USA as a Series 7 and Serie 66 under CRD # 4575350.'
  },
  {
    name: 'Cristian Ramirez',
    title: 'Chief Financial Officer',
    description: 'Cristian has been with AGM for over 8 years, he has a background in business and data analytics, besides being our CFO, he is an experienced Options trader and has been part of a couple of Broker/Dealers and a Fund Management company in the past. Mr. Ramirez has a very strong background in Statistical and Financial analysis, as well as in accounting.'
  },
  {
    name: 'Javier Cordero',
    title: 'Trade Support Specialist',
    description: 'Javier started with AGM as an Intern from Texas Tech University, where he is in his final year to obtain his BA in Business. He has been with us for 2 years and has excelled in the different areas that he has been part of. He is in charge of the Customer Service Department and makes sure that every client has a tailored introduction to their relationship with AGM.'
  },
  {
    name: 'Maria Jose Castro',
    title: 'Trade Support Specialist',
    description: 'Maria Jose is our newest addition to the AGM team, she is also in her final year to obtain her BA in Business from Texas Tech University. She is part of our Customer Service Department and makes sure that every client has great service and support experience with AGM. She is also in charge of our marketing department and social media.'
  },
  {
    name: 'Andres Aguilar',
    title: 'IT Specialist',
    description: 'Andres has been with AGM since the beginning of 2024, he is working on obtaining his BS in Computer Science from Texas Tech University. Andres is in charge of our IT department and has shown great skills to develop our front end systems to be able to provide a better experience to our customers. He is also responsible for most of our back end processes so everything works as expected.  '
  }
]

export function TeamCarousel() {
  return (
    <Carousel className="w-full h-full max-w-[65%]">
      <CarouselContent>
        {team.map((member, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="w-full text-agm-dark-blue cursor-pointer h-full text-center flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold">{member.name}</p>
                          <p className="text-sm text-primary">{member.title}</p>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="text-agm-dark-blue">
                          <DialogTitle>{member.name}</DialogTitle>
                          <DialogDescription>{member.title}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p className="text-sm font-light">
                          {member.description}
                          </p>
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


