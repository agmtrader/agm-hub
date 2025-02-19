'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { use, useState } from 'react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons'
import { videosDictionary } from '@/lib/resource-center'
import { chapters } from '@/lib/resource-center'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { formatURL } from '@/utils/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

type Props = {
    params: Promise<{
        'chapter-id': string
    }>
}

const ChapterPage = ({ params }: Props) => {

    const { 'chapter-id': chapterId } = use(params)

    const videos = videosDictionary.filter((video) => video.chapter === chapterId)
    const [selected, setSelected] = useState<any | null>(videos[0])
    const [showList, setShowList] = useState(true)

    const { lang } = useTranslationProvider()

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        slidesToScroll: 1
    })

    return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='h-full justify-start items-center gap-5 flex flex-col w-full'
    >
        <Button asChild className='absolute left-10 z-10' variant='ghost'>
            <Link href={formatURL('/learning', lang)}>
                <ArrowLeft className='w-4 h-4 text-foreground'/>
                Go back
            </Link>
        </Button>

        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-5xl font-bold'
        >
            Chapter {chapterId}
        </motion.h1>
        
        <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='text-2xl text-subtitle'
        >
            {chapters.find((chapter) => chapter.id === chapterId)?.title}
        </motion.p>

        {videos.length == 0 && (
            <p className='text-lg text-subtitle'>No videos available for this chapter. Please check back later.</p>
        )}

        {videos && selected && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='w-full h-full gap-8 flex items-start justify-center'
            >
                <motion.div 
                layout
                className='flex flex-col gap-2 w-[300px] p-6 bg-muted rounded-lg shadow-sm'
                >
                <h3 className='font-semibold mb-2 text-lg'>Available Videos</h3>
                <AnimatePresence mode="wait">
                    {showList && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='flex flex-col gap-3'
                    >
                        {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Button
                            onClick={() => setSelected(video)}
                            className={cn(
                                'text-sm p-3 w-fit h-fit justify-start text-left bg-transparent text-foreground hover:bg-primary/10',
                                selected.id === video.id && 'bg-primary text-background hover:bg-primary hover:text-background'
                            )}
                            >
                            {video.title}
                            </Button>
                        </motion.div>
                        ))}
                    </motion.div>
                    )}
                </AnimatePresence>
                <Button
                    onClick={() => setShowList(!showList)}
                    className='text-sm mt-2 p-2 w-fit bg-transparent hover:bg-transparent text-foreground hover:text-foreground'
                >
                    {showList ? 
                    <CaretDownFill className='w-4 h-4 text-foreground'/> 
                    : 
                    <CaretRightFill className='w-4 h-4 text-foreground'/>
                    }
                </Button>
                </motion.div>

                <motion.div
                key={selected.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className='w-[1024px] max-w-[90vw] h-auto flex items-center justify-center'
                >
                <div className="w-full relative" style={{ paddingTop: '56.25%' }}>
                    <iframe 
                        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-sm"
                        src={`https://www.youtube.com/embed/${selected.id}`} 
                        title={selected.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                </motion.div>
                
            </motion.div>
        )}

        <div className="w-full max-w-[1024px] relative">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-md absolute -left-12 top-1/2 -translate-y-1/2 z-10"
                onClick={() => emblaApi?.scrollPrev()}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {videos
                    .filter((video) => video.id !== selected.id)
                    .map((video, index) => (
                        <div 
                            key={video.id} 
                            className='relative aspect-video h-40 bg-muted rounded-lg shadow-sm cursor-pointer group flex-shrink-0' 
                            onClick={() => setSelected(video)}
                        >
                            <img 
                                src={`https://img.youtube.com/vi/${video.id}/0.jpg`} 
                                alt={video.title}
                                className='h-40 aspect-video rounded-lg object-cover' 
                            />
                            <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-4'>
                                <p className='text-white text-center text-sm'>{video.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-md absolute -right-12 top-1/2 -translate-y-1/2 z-10"
                onClick={() => emblaApi?.scrollNext()}
            >
                <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
        </div>

    </motion.div>
    )
}

export default ChapterPage