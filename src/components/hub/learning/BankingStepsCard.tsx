'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StepItem = {
  title: string
  body?: string
  note?: string
}

interface BankingStepsCardProps {
  title: string
  intro?: string
  steps: readonly StepItem[]
}

export function BankingStepsCard({ title, intro, steps }: BankingStepsCardProps) {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {intro ? <p className="text-base text-subtitle leading-7">{intro}</p> : null}
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={`${step.title}-${index}`} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center shrink-0 font-semibold">
                {index + 1}
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{step.title}</p>
                {step.body ? <p className="text-subtitle leading-7">{step.body}</p> : null}
                {step.note ? <p className="text-sm text-subtitle">{step.note}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
