import * as React from "react"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { chapters } from '@/lib/dictionaries/resource-center'
import { formatURL } from '@/utils/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

export function LearningCarousel() {

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  })

  const { lang } = useTranslationProvider()

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
          {chapters.map((chapter) => (
            <div key={chapter.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4">
              <div className="p-1 h-full">
                <Link href={formatURL(`/learning/${chapter.id}`, lang)} className="h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="flex-1 p-6 flex items-center justify-center">
                      <div className="relative w-full aspect-video">
                        <Image 
                          src={chapter.image || ''} 
                          alt={chapter.title} 
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </CardContent>
                    <CardHeader className="pt-2 pb-4">
                      <p className="text-md font-semibold text-center">
                        Chapter {chapter.id}: <span className="font-normal">{chapter.title}</span>
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
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