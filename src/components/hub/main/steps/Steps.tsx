'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LineChart, BarChart2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

interface StepDetail {
  icon: React.ReactNode
  title: string
  shortDescription: string
  longDescription: string
  highlights: string[]
}

const Steps = () => {

  const { lang, t } = useTranslationProvider()
  const [selectedStep, setSelectedStep] = useState<StepDetail | null>(null)

const managementTypes: StepDetail[] = [
  {
    icon: <LineChart className="h-12 w-12 text-primary" />,
    title: t('main.steps.management_types.broker.title'),
    shortDescription:
      t('main.steps.management_types.broker.short_description'),
    longDescription:
      t('main.steps.management_types.broker.long_description'),
    highlights: [
      t('main.steps.management_types.broker.highlights.1'),
      t('main.steps.management_types.broker.highlights.2'),
      t('main.steps.management_types.broker.highlights.3'),
      t('main.steps.management_types.broker.highlights.4'),
      t('main.steps.management_types.broker.highlights.5'),
      t('main.steps.management_types.broker.highlights.6'),
    ],
  },
  {
    icon: <BarChart2 className="h-12 w-12 text-primary" />,
    title: t('main.steps.management_types.advisor.title'),
    shortDescription:
      t('main.steps.management_types.advisor.short_description'),
    longDescription:
      t('main.steps.management_types.advisor.long_description'),
    highlights: [
      t('main.steps.management_types.advisor.highlights.1'),
      t('main.steps.management_types.advisor.highlights.2'),
      t('main.steps.management_types.advisor.highlights.3'),
      t('main.steps.management_types.advisor.highlights.4'),
      t('main.steps.management_types.advisor.highlights.5'),
      t('main.steps.management_types.advisor.highlights.6'),
    ],
  },
]

const accountTypes: StepDetail[] = [
  {
    icon: <BarChart2 className="h-12 w-12 text-primary" />,
    title: t('main.steps.account_types.individual.title'),
    shortDescription:
      t('main.steps.account_types.individual.short_description'),
    longDescription:
      t('main.steps.account_types.individual.long_description'),
    highlights: [
      t('main.steps.account_types.individual.highlights.1'),
      t('main.steps.account_types.individual.highlights.2'),
      t('main.steps.account_types.individual.highlights.3'),
      t('main.steps.account_types.individual.highlights.4'),
      t('main.steps.account_types.individual.highlights.5'),
      t('main.steps.account_types.individual.highlights.6'),
    ],
  },
  {
    icon: <LineChart className="h-12 w-12 text-primary" />,
    title: t('main.steps.account_types.institutional.title'),
    shortDescription:
      t('main.steps.account_types.institutional.short_description'),
    longDescription:
      t('main.steps.account_types.institutional.long_description'),
    highlights: [
      t('main.steps.account_types.institutional.highlights.1'),
      t('main.steps.account_types.institutional.highlights.2'),
      t('main.steps.account_types.institutional.highlights.3'),
      t('main.steps.account_types.institutional.highlights.4'),
      t('main.steps.account_types.institutional.highlights.5'),
      t('main.steps.account_types.institutional.highlights.6'),
    ],
  },
]


  return (
    <div className="container space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tighter">{t('main.steps.title')}</h2>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-xl tracking-tighter">
          {t('main.steps.description')}
        </h2>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {managementTypes.map((step) => (
          <Card
            key={step.title}
            className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
            onClick={() => setSelectedStep(step)}
          >
            <CardContent className="p-6 space-y-2">
              {step.icon}
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.shortDescription}</p>
              <p className="text-sm font-medium text-primary">{t('main.steps.read_more')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-xl tracking-tighter">
          {t('main.steps.after_selecting_management_type')}
        </h2>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {accountTypes.map((step) => (
          <Card
            key={step.title}
            className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
            onClick={() => setSelectedStep(step)}
          >
            <CardContent className="p-6 space-y-2">
              {step.icon}
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.shortDescription}</p>
              <p className="text-sm font-medium text-primary">{t('main.steps.read_more')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-5">
        <Button className="w-fit">
          <Link href={formatURL("/apply", lang)}>{t('shared.apply_for_an_account')}</Link>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="w-fit">
          <Link href={formatURL("/requirements", lang)}>{t('shared.view_requirements')}</Link>
        </Button>
      </div>

      <Dialog open={!!selectedStep} onOpenChange={(open) => !open && setSelectedStep(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedStep && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {selectedStep.icon}
                  <DialogTitle className="text-2xl font-bold">{selectedStep.title}</DialogTitle>
                </div>
              </DialogHeader>
              <Separator />
              <DialogDescription className="text-sm leading-relaxed">
                {selectedStep.longDescription}
              </DialogDescription>
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-foreground">{t('main.steps.key_highlights')}</h4>
                <ul className="space-y-2">
                  {selectedStep.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Steps
