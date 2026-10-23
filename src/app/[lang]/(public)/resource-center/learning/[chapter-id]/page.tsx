'use client'

import React, { use, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { chapters, videosDictionary } from '@/lib/public/resource-center'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

type Props = {
  params: Promise<{
    'chapter-id': string
  }>
}

interface Video {
  id: string
  title: string
  chapter: string
}

const ChapterPage = ({ params }: Props) => {
  const { 'chapter-id': chapterId } = use(params)

  const videos: Video[] = videosDictionary.filter((video) => video.chapter === chapterId)
  const [selected, setSelected] = useState<Video | null>(videos[0] ?? null)
  const [showList, setShowList] = useState(true)

  const { lang, t } = useTranslationProvider()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full justify-start items-center gap-5 my-8 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6"
    >
      <Button asChild className="self-start h-auto min-h-10 whitespace-normal text-left" variant="ghost">
        <Link href={formatURL('/resource-center#learning', lang)}>
          <ArrowLeft className="w-4 h-4 text-foreground" />
          {t('learning.go_back')}
        </Link>
      </Button>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center"
      >
        {t('learning.chapter_label')} {chapterId}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl sm:text-2xl text-subtitle text-center"
      >
        {(() => {
          const translated = t(`learning.chapters.${chapterId}.title`)
          return translated === `learning.chapters.${chapterId}.title`
            ? chapters.find((chapter) => chapter.id === chapterId)?.title
            : translated
        })()}
      </motion.p>

      {videos.length === 0 && <p className="text-lg text-subtitle">{t('learning.no_videos')}</p>}

      {videos.length > 0 && selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full min-w-0 gap-6 flex flex-col lg:flex-row items-start justify-center"
        >
          <motion.div layout className="flex shrink-0 flex-col gap-2 w-full lg:w-[280px] p-4 sm:p-6 bg-muted rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 text-lg">{t('learning.available_videos')}</h3>
            <AnimatePresence mode="wait">
              {showList && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-3"
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
                          'text-sm p-3 w-full min-h-11 h-auto whitespace-normal justify-start text-left bg-transparent text-foreground hover:bg-primary/10',
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
              aria-label={showList ? (lang === 'es' ? 'Ocultar videos' : 'Hide videos') : (lang === 'es' ? 'Mostrar videos' : 'Show videos')}
              aria-expanded={showList}
              onClick={() => setShowList(!showList)}
              className="text-sm mt-2 p-2 w-fit bg-transparent hover:bg-transparent text-foreground hover:text-foreground"
            >
              {showList ? (
                <CaretDownFill className="w-4 h-4 text-foreground" />
              ) : (
                <CaretRightFill className="w-4 h-4 text-foreground" />
              )}
            </Button>
          </motion.div>

          <motion.div
            key={selected.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="w-full min-w-0 flex-1 h-auto flex items-center justify-center"
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
          <div className="hidden sm:block absolute h-[2px] w-full top-1/2 -translate-y-1/2">
            {videos.map((_, index) => {
              if (index === videos.length - 1) return null
              const isWatched = index < videos.findIndex((v) => v.id === selected?.id)
              return (
                <div
                  key={`line-${index}`}
                  className={cn(
                    'absolute h-full',
                    isWatched ? 'bg-blue-500' : 'bg-orange-500',
                    'transition-[color,background-color,transform] duration-300'
                  )}
                  style={{
                    left: `${(index / (videos.length - 1)) * 100}%`,
                    width: `${100 / (videos.length - 1)}%`,
                  }}
                />
              )
            })}
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-3 justify-between w-full relative">
            {videos.map((video, index) => {
              const isWatched = index < videos.findIndex((v) => v.id === selected?.id)
              const isCurrent = video.id === selected?.id

              return (
                <button
                  key={video.id}
                  onClick={() => setSelected(video)}
                  className={cn(
                    'w-10 h-10 shrink-0 rounded-full flex items-center justify-center',
                    'transition-[color,background-color,transform] duration-300 relative',
                    'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    isWatched ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white',
                    isCurrent && 'ring-2 ring-offset-2 ring-black scale-110'
                  )}
                  aria-label={`Go to video ${index + 1}: ${video.title}`}
                >
                  <span className="text-sm font-medium">{index + 1}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChapterPage
