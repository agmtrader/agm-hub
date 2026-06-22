'use client'

import { Clock3, CreditCard, ListOrdered } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SnapshotMetric = {
  label: string
  value: string
  detail: string
}

interface BankingMethodSnapshotProps {
  title: string
  description?: string
  speed: SnapshotMetric
  fees: SnapshotMetric
  steps: SnapshotMetric
}

const metricConfig = [
  { key: 'speed', icon: Clock3, accent: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { key: 'fees', icon: CreditCard, accent: 'text-rose-600 bg-rose-50 border-rose-200' },
  { key: 'steps', icon: ListOrdered, accent: 'text-amber-600 bg-amber-50 border-amber-200' },
] as const

export function BankingMethodSnapshot({
  title,
  description,
  speed,
  fees,
  steps,
}: BankingMethodSnapshotProps) {
  const metrics = { speed, fees, steps }

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description ? <p className="text-sm text-subtitle leading-6">{description}</p> : null}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {metricConfig.map(({ key, icon: Icon, accent }) => {
          const metric = metrics[key]

          return (
            <div key={key} className="rounded-xl border border-border/60 bg-muted/20 p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full border ${accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtitle">
                    {metric.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{metric.value}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-subtitle">{metric.detail}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
