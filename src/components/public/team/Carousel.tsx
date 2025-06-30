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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export function TeamCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  })

  const { t } = useTranslationProvider()


  const team = [
    {
      name: 'Hernán Castro',
      title: t('shared.team.team_carousel.hernan_title'),
      description: t('shared.team.team_carousel.hernan_description'),
      avatar: '/assets/team/vector/hernan.png',
      linkedin: 'https://www.linkedin.com/in/hernan-castro-b87a9a13/'
    },
    {
      name: 'Ramón Castro',
      title: t('shared.team.team_carousel.ramon_title'),
      description: t('shared.team.team_carousel.ramon_description'),
      avatar: '/assets/team/vector/ramon.png',
      linkedin: 'https://www.linkedin.com/in/ramon-castro-marin-3a648b1a2/'
    },
    {
      name: 'Cristian Ramirez',
      title: t('shared.team.team_carousel.cristian_title'),
      description: t('shared.team.team_carousel.cristian_description'),
      avatar: '/assets/team/vector/cristian.png',
      linkedin: 'https://www.linkedin.com/in/cristian-ramírez-fernández-560b0375/'
    },
    {
      name: 'Javier Cordero',
      title: t('shared.team.team_carousel.javier_title'),
      description: t('shared.team.team_carousel.javier_description'),
      avatar: '/assets/team/vector/javier.png',
      linkedin: 'https://www.linkedin.com/in/javier-cordero-b70000100/'
    },
    {
      name: 'María José Castro',
      title: t('shared.team.team_carousel.maria_jose_title'),
      description: t('shared.team.team_carousel.maria_jose_description'),
      avatar: '/assets/team/vector/maria_jose.png',
      linkedin: 'https://www.linkedin.com/in/maria-jose-castro-hernandez-592126265/'
    },
    {
      name: 'Andrés Aguilar',
      title: t('shared.team.team_carousel.andres_title'),
      description: t('shared.team.team_carousel.andres_description'),
      avatar: '/assets/team/vector/andres.png',
      linkedin: 'https://www.linkedin.com/in/aguilarcarboni/'
    },
    {
      name: 'Ramón Castro Jr',
      title: t('shared.team.team_carousel.ramon_jr_title'),
      description: t('shared.team.team_carousel.ramon_jr_description'),
      avatar: '/assets/team/vector/ramonjr.png',
      linkedin: 'https://www.linkedin.com/in/ramon-castro-marin-3a648b1a2/'
    }
  ]

  return (
    <div className="w-full flex justify-center items-center h-full max-w-[90%] md:max-w-[80%] lg:max-w-[65%] relative">
      <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md absolute left-0 z-10"
          onClick={() => emblaApi?.scrollPrev()}
        >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {team.map((member, index) => (
            <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 px-4">
              <div className="p-1 group">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="w-full text-foreground cursor-pointer h-full text-center flex flex-col items-center justify-center space-y-4">
                          <Avatar className="w-40 h-40 border-2">
                            <AvatarImage src={member.avatar} className="object-cover" />
                            <AvatarFallback className="text-2xl font-bold bg-background text-foreground">
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
                          <DialogHeader className="text-foreground">
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
                          <div className="mt-6 flex justify-start">
                            <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <Button className="w-full">
                                <FaLinkedin className="h-4 w-4 mr-2" />
                                {t('shared.team.team_carousel.linkedin')}
                              </Button>
                            </Link>
                          </div>
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
      <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md absolute right-0 z-10"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}


