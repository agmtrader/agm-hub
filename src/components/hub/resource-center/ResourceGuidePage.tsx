'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

import { ResourceSnapshot } from './ResourceSnapshot'
import { ResourceSteps } from './ResourceSteps'

type GuideStep = {
  title: string
  body?: string
  note?: string
}

type GuideMetric = {
  label: string
  value: string
  detail: string
}

type GuideSnapshot = {
  title: string
  description?: string
  speed: GuideMetric
  fees: GuideMetric
  steps: GuideMetric
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
  snapshot?: GuideSnapshot
  sections?: readonly GuideSection[]
  [key: string]: unknown
}

interface ResourceGuidePageProps {
  sectionAnchor: string
  content: Record<string, GuideCopy>
}

export function ResourceGuidePage({ sectionAnchor, content }: ResourceGuidePageProps) {
  const { lang } = useTranslationProvider()
  const copy = content[lang] ?? content.en
  const snapshot =
    copy.snapshot ??
    (typeof copy.snapshotTitle === 'string' && copy.speed && copy.fees && copy.stepsSummary
      ? {
          title: copy.snapshotTitle,
          description: typeof copy.snapshotDescription === 'string' ? copy.snapshotDescription : undefined,
          speed: copy.speed as GuideMetric,
          fees: copy.fees as GuideMetric,
          steps: copy.stepsSummary as GuideMetric,
        }
      : undefined)
  const explicitSections = Array.isArray(copy.sections) ? (copy.sections as readonly GuideSection[]) : []

  const titleToDataKey: Record<string, string> = {
    instructionsTitle: 'steps',
    rulesTitle: 'rules',
    levelsTitle: 'levels',
    availabilityTitle: 'availability',
    familyTitle: 'familySteps',
    afterTitle: 'afterSteps',
    stepsTitle: 'steps',
    optionsTitle: 'options',
    terminationTitle: 'termination',
    questionnaireTitle: 'questionnaire',
    wireTitle: 'wireSteps',
    achTitle: 'achSteps',
    associationTitle: 'associationSteps',
  }

  const inferredSections = Object.keys(copy).flatMap((key) => {
    if (!key.endsWith('Title') || key === 'snapshotTitle' || key === 'title') {
      return []
    }

    const sectionTitle = copy[key]
    if (typeof sectionTitle !== 'string') {
      return []
    }

    const dataKey = titleToDataKey[key] ?? key.slice(0, -'Title'.length)
    const steps = copy[dataKey]
    if (!Array.isArray(steps)) {
      return []
    }

    const introKeyCandidates = [`${dataKey}Intro`, `${dataKey}Description`, `${key.replace(/Title$/, 'Intro')}`, `${key.replace(/Title$/, 'Description')}`]
    const intro = introKeyCandidates.find((candidate) => typeof copy[candidate] === 'string')

    return [
      {
        title: sectionTitle,
        intro: intro ? (copy[intro] as string) : undefined,
        steps: steps as readonly GuideStep[],
      },
    ]
  })

  const sections = explicitSections.length > 0 ? explicitSections : inferredSections

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
        {snapshot ? (
          <ResourceSnapshot
            title={snapshot.title}
            description={snapshot.description}
            speed={snapshot.speed}
            fees={snapshot.fees}
            steps={snapshot.steps}
          />
        ) : null}
        {sections.map((section, index) => (
          <ResourceSteps key={`${section.title}-${index}`} title={section.title} intro={section.intro} steps={section.steps} />
        ))}
      </div>
    </motion.div>
  )
}
