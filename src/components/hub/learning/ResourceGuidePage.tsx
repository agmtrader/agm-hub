'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

import { BankingStepsCard } from './BankingStepsCard'

type GuideStep = {
  title: string
  body?: string
  note?: string
}

type GuideSection = {
  title: string
  intro?: string
  steps: readonly GuideStep[]
}

type GuideCopy = {
  eyebrow: string
  title: string
  description: string
  back: string
  sections: readonly GuideSection[]
}

interface ResourceGuidePageProps {
  sectionAnchor: string
  content: Record<string, GuideCopy>
}

export function ResourceGuidePage({ sectionAnchor, content }: ResourceGuidePageProps) {
  const { lang } = useTranslationProvider()
  const copy = content[lang] ?? content.en

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl mx-auto py-14 px-6 flex flex-col gap-8">
      <div className="flex justify-start">
        <Button asChild variant="ghost">
          <Link href={formatURL(`/resource-center#${sectionAnchor}`, lang)}>
            <ArrowLeft className="w-4 h-4 text-foreground" />
            {copy.back}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{copy.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-bold">{copy.title}</h1>
        <p className="text-lg text-subtitle leading-8 max-w-5xl">{copy.description}</p>
      </div>

      <div className="grid gap-6">
        {copy.sections.map((section, index) => (
          <BankingStepsCard key={`${section.title}-${index}`} title={section.title} intro={section.intro} steps={section.steps} />
        ))}
      </div>
    </motion.div>
  )
}
