import * as React from "react"
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', slidesToScroll: 1 })

  return (
    <div className="w-full flex justify-center items-center h-full max-w-[65%] relative">
      <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md"
          onClick={() => emblaApi?.scrollPrev()}
        >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {team.map((member, index) => (
            <div key={index} className="flex-[0_0_33.33%] min-w-0 px-4">
              <div className="p-1 group">
                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="w-full text-agm-dark-blue cursor-pointer h-full text-center flex flex-col items-center justify-center space-y-4">
                          <Avatar className="w-24 h-24 border-2 border-agm-dark-blue">
                            <AvatarFallback className="text-2xl font-bold bg-white text-agm-dark-blue">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xl font-semibold">{member.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{member.title}</p>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] overflow-hidden">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <DialogHeader className="text-agm-dark-blue">
                            <DialogTitle className="text-3xl font-bold">{member.name}</DialogTitle>
                            <DialogDescription className="text-lg text-primary font-medium">{member.title}</DialogDescription>
                          </DialogHeader>
                          <div className="mt-6">
                            <motion.p 
                              className="text-base leading-relaxed text-gray-700"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                            >
                              {member.description}
                            </motion.p>
                          </div>
                          <motion.div 
                            className="mt-6 flex justify-end"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                          >
                            <button className="px-4 py-2 bg-agm-dark-blue text-white rounded-md hover:bg-opacity-90 transition-colors">
                              Learn More
                            </button>
                          </motion.div>
                        </motion.div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


