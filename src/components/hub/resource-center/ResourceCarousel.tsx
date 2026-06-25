import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ResourceSlide } from '@/lib/public/resource-center'
import { cn } from '@/lib/utils'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

interface ResourceCarouselProps {
  slides: ResourceSlide[]
  renderTitle?: (slide: ResourceSlide) => React.ReactNode
}

export function ResourceCarousel({ slides, renderTitle }: ResourceCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  })

  const { lang, t } = useTranslationProvider()

  return (
    <div className="w-full flex justify-center items-center h-full max-w-[90%] md:max-w-[80%] lg:max-w-[72%] relative">
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
          {slides.map((slide) => {
            const content = (
              <Card
                className={cn(
                  'h-full flex flex-col border-border/60 bg-card/90 transition-transform duration-200',
                  slide.href && 'hover:-translate-y-1'
                )}
              >
                <CardContent className="flex-1 p-6 flex items-center justify-center">
                  <div className="relative w-full aspect-video">
                    <Image src={slide.image} alt={slide.title} fill className="object-cover rounded-lg" />
                  </div>
                </CardContent>
                <CardHeader className="pt-2 pb-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    {slide.eyebrow ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {slide.eyebrow}
                      </p>
                    ) : null}
                    <div className="text-md font-semibold">{renderTitle ? renderTitle(slide) : slide.title}</div>
                    {slide.external ? (
                      <span className="inline-flex items-center gap-1 text-xs text-subtitle">
                        {t('learning.opens_external')}
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    ) : null}
                  </div>
                </CardHeader>
              </Card>
            )

            return (
              <div key={slide.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4">
                <div className="p-1 h-full">
                  {slide.href ? (
                    slide.external ? (
                      <a href={slide.href} target="_blank" rel="noopener noreferrer" className="h-full block">
                        {content}
                      </a>
                    ) : (
                      <Link href={formatURL(slide.href, lang)} className="h-full block">
                        {content}
                      </Link>
                    )
                  ) : (
                    content
                  )}
                </div>
              </div>
            )
          })}
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
