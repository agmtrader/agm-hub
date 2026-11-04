'use client'

import { useRef, useState } from 'react'
import { Maximize2, Play, RotateCcw, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const videoSrc = process.env.NEXT_PUBLIC_AGM_INTRO_VIDEO_URL || '/assets/videos/agm-introduction.mp4'

type PlaybackState = { time: number; paused: boolean; muted: boolean; volume: number }

function readPlayback(video: HTMLVideoElement): PlaybackState {
  return { time: video.currentTime, paused: video.paused, muted: video.muted, volume: video.volume }
}

export default function FloatingVideoPlayer() {
  const [visible, setVisible] = useState(true)
  const [started, setStarted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [expandedError, setExpandedError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const expandedVideoRef = useRef<HTMLVideoElement>(null)
  const playbackRef = useRef<PlaybackState>({ time: 0, paused: true, muted: false, volume: 1 })
  const { lang } = useTranslationProvider()
  const spanish = lang === 'es'

  const changeExpanded = (open: boolean) => {
    if (open) {
      if (videoRef.current) {
        playbackRef.current = readPlayback(videoRef.current)
        videoRef.current.pause()
      }
      setExpandedError(false)
    } else {
      const largeVideo = expandedVideoRef.current
      const state = largeVideo && largeVideo.readyState >= 1
        ? readPlayback(largeVideo)
        : playbackRef.current
      largeVideo?.pause()
      const video = videoRef.current
      if (video) {
        video.currentTime = state.time
        video.muted = state.muted
        video.volume = state.volume
        if (!state.paused) {
          setStarted(true)
          setHasError(false)
          void video.play().catch(() => {
            setStarted(false)
            setHasError(true)
          })
        }
      }
    }
    setExpanded(open)
  }

  const playVideo = async () => {
    const video = videoRef.current
    if (!video) return

    if (hasError) video.load()
    setHasError(false)
    setStarted(true)

    try {
      await video.play()
    } catch {
      setStarted(false)
      setHasError(true)
    }
  }

  if (!visible) return null

  return (
    <Dialog.Root open={expanded} onOpenChange={changeExpanded}>
    <aside
      hidden={expanded}
      aria-label={spanish ? 'Video de AGM' : 'AGM video'}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-40 aspect-[4/3] w-44 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-orange-400/80 bg-black shadow-[0_0_0_1px_rgba(249,115,22,0.3),0_0_20px_rgba(249,115,22,0.35),0_12px_32px_rgba(0,0,0,0.18)] sm:w-72"
    >
      <video
        ref={videoRef}
        aria-label={spanish ? 'Conoce AGM' : 'Discover AGM'}
        src={videoSrc}
        poster="/assets/videos/agm-introduction-poster.svg"
        preload="none"
        playsInline
        controls={started}
        controlsList="nofullscreen"
        className="agm-video h-full w-full object-contain"
        onError={() => {
          setStarted(false)
          setHasError(true)
        }}
      />
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={spanish ? 'Ampliar video' : 'Expand video'}
          className={`absolute left-1 top-1 z-30 flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400 ${started ? 'bg-black/60 text-white hover:bg-black/80' : 'text-secondary-dark hover:bg-slate-200/80'}`}
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] shadow-[inset_0_0_14px_rgba(249,115,22,0.2)]"
      />
      <button
        type="button"
        aria-label={spanish ? 'Cerrar video' : 'Close video'}
        onClick={() => {
          videoRef.current?.pause()
          setVisible(false)
        }}
        className={`absolute right-1 top-1 z-30 flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400 ${started ? 'bg-black/60 text-white hover:bg-black/80' : 'text-secondary-dark hover:bg-slate-200/80'}`}
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
      {!started && (
        <button
          type="button"
          onClick={playVideo}
          aria-label={hasError
            ? (spanish ? 'Reintentar video' : 'Retry video')
            : (spanish ? 'Reproducir video de AGM' : 'Play AGM video')}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white to-slate-100 p-4 text-center text-secondary-dark transition-colors hover:to-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400 sm:gap-4 sm:p-8"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg sm:h-16 sm:w-16">
            {hasError
              ? <RotateCcw className="h-5 w-5 sm:h-7 sm:w-7" aria-hidden="true" />
              : <Play className="ml-1 h-5 w-5 fill-current sm:h-7 sm:w-7" aria-hidden="true" />}
          </span>
          <span className="text-sm font-semibold sm:text-lg">
            {hasError
              ? (spanish ? 'No se pudo reproducir. Reintentar' : 'Unable to play. Try again')
              : (spanish ? 'Conoce AGM' : 'Discover AGM')}
          </span>
        </button>
      )}
    </aside>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-orange-400/70 bg-black shadow-2xl focus:outline-none">
        <Dialog.Title className="sr-only">{spanish ? 'Conoce AGM' : 'Discover AGM'}</Dialog.Title>
        <Dialog.Description className="sr-only">
          {spanish ? 'Video de AGM ampliado. Cierra para volver al reproductor pequeño.' : 'Expanded AGM video. Close to return to the small player.'}
        </Dialog.Description>
        <video
          ref={expandedVideoRef}
          aria-label={spanish ? 'Video de AGM ampliado' : 'Expanded AGM video'}
          src={videoSrc}
          poster="/assets/videos/agm-introduction-poster.svg"
          preload="metadata"
          playsInline
          controls
          controlsList="nofullscreen"
          className="agm-video aspect-video max-h-[80dvh] w-full object-contain"
          onLoadedMetadata={() => {
            const video = expandedVideoRef.current
            if (!video) return
            const state = playbackRef.current
            video.currentTime = state.time
            video.muted = state.muted
            video.volume = state.volume
            if (!state.paused) void video.play().catch(() => setExpandedError(true))
          }}
          onPlay={() => {
            setStarted(true)
            setExpandedError(false)
          }}
          onError={() => setExpandedError(true)}
        />
        {expandedError && (
          <p role="alert" className="px-4 pb-4 text-center text-sm text-white">
            {spanish ? 'No se pudo iniciar el video. Usa los controles para reintentar.' : 'The video could not start. Use the controls to try again.'}
          </p>
        )}
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label={spanish ? 'Volver al video pequeño' : 'Return to small video'}
            className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
    </Dialog.Root>
  )
}
