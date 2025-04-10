'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { use, useState } from 'react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons'
import { videosDictionary } from '@/lib/dictionaries/resource-center'
import { chapters } from '@/lib/dictionaries/resource-center'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatURL } from '@/utils/language/lang'
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

    return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='h-full justify-start items-center gap-5 my-10 flex flex-col w-full'
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

        <div className="w-full max-w-[1024px] relative mt-8">
            <div className="flex items-center justify-center relative">
                <div className="absolute h-[2px] w-full top-1/2 -translate-y-1/2">
                    {videos.map((_, index) => {
                        if (index === videos.length - 1) return null;
                        const isWatched = index < videos.findIndex(v => v.id === selected.id);
                        return (
                            <div
                                key={`line-${index}`}
                                className={cn(
                                    "absolute h-full",
                                    isWatched ? "bg-blue-500" : "bg-orange-500",
                                    "transition-all duration-300"
                                )}
                                style={{
                                    left: `${(index / (videos.length - 1)) * 100}%`,
                                    width: `${100 / (videos.length - 1)}%`
                                }}
                            />
                        );
                    })}
                </div>

                <div className="flex justify-between w-full relative">
                    {videos.map((video, index) => {
                        const isWatched = index < videos.findIndex(v => v.id === selected.id);
                        const isCurrent = video.id === selected.id;
                        
                        return (
                            <button
                                key={video.id}
                                onClick={() => setSelected(video)}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                    "transition-all duration-300 relative",
                                    "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    isWatched ? "bg-blue-500 text-white" : "bg-orange-500 text-white",
                                    isCurrent && "ring-2 ring-offset-2 ring-black scale-110"
                                )}
                                aria-label={`Go to video ${index + 1}: ${video.title}`}
                            >
                                <span className="text-sm font-medium">
                                    {index + 1}
                                </span>
                                
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    <div className="bg-foreground text-background text-xs rounded px-2 py-1">
                                        {video.title}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

    </motion.div>
    )
}

export default ChapterPage