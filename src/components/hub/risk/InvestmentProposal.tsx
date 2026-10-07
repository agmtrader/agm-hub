'use client'
import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useMemo, useState, useRef, useEffect } from 'react'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Bond, InvestmentProposal as InvestmentProposalType, } from '@/lib/clients/investment-proposals'
import { DataTable } from '@/components/misc/DataTable'
import type { ColumnDefinition } from '@/components/misc/DataTable'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { ListRiskArchetypes, ReadRiskProfileById } from '@/utils/clients/risk-profile'
import {
  investmentProposalDistributionKeys,
  type InvestmentProposalDistribution,
} from '@/lib/clients/investment-proposals'

type Props = {
  investmentProposal: InvestmentProposalType
}

const PROJECTION_DISCLAIMER = 'This is a simulated projection. Each yearly return is applied to the previous year\'s portfolio value. The average annual return is the arithmetic average of the 10 simulated yearly returns.'

const InvestmentProposal = ({ investmentProposal }: Props) => {
  const parseDistribution = (
    rawDistribution: InvestmentProposalType['derived_distribution']
  ): InvestmentProposalDistribution | null => {
    if (!rawDistribution) return null

    let parsedDistribution: unknown = rawDistribution

    if (typeof rawDistribution === 'string') {
      try {
        parsedDistribution = JSON.parse(rawDistribution)
      } catch {
        return null
      }
    }

    if (!parsedDistribution || typeof parsedDistribution !== 'object') {
      return null
    }

    const normalizedDistribution = investmentProposalDistributionKeys.reduce((acc, key) => {
      const value = Number((parsedDistribution as Record<string, unknown>)[key])
      acc[key] = Number.isFinite(value) ? value : 0
      return acc
    }, {} as InvestmentProposalDistribution)

    const totalWeight = Object.values(normalizedDistribution).reduce((sum, value) => sum + value, 0)
    return totalWeight > 0 ? normalizedDistribution : null
  }

  const RATING_COLORS = {
        'AAA/AA/A': '#1D4ED8',
        'Treasuries': '#1E3A8A',
        'BBB': '#3B82F6',
        'BB': '#60A5FA',
        'ETFs': '#93C5FD',
        'Other': '#2563EB',
  } as const

  const GROUPS = [
    {
      key: 'treasuries',
      distributionKey: 'treasuries',
      label: 'Treasuries',
      color: RATING_COLORS['Treasuries'],
    },
    {
      key: 'aaa_a',
      distributionKey: 'bonds_aaa_a',
      label: 'AAA/AA/A',
      color: RATING_COLORS['AAA/AA/A'],
    },
    { key: 'bbb', distributionKey: 'bonds_bbb', label: 'BBB', color: RATING_COLORS['BBB'] },
    { key: 'bb', distributionKey: 'bonds_bb', label: 'BB', color: RATING_COLORS['BB'] },
    { key: 'etfs', distributionKey: 'etfs', label: 'ETFs', color: RATING_COLORS['ETFs'] },
  ] as const

  const [riskArchetypeName, setRiskArchetypeName] = useState<string | null>(null)
  const [projectionSeed, setProjectionSeed] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRiskArchetype = async () => {
      const riskProfileId = investmentProposal?.risk_profile_id

      if (!riskProfileId) {
        setRiskArchetypeName(null)
        return
      }

      try {
        const [matchedRiskProfile, riskArchetypes] = await Promise.all([
          ReadRiskProfileById(String(riskProfileId)),
          ListRiskArchetypes(),
        ])

        if (!matchedRiskProfile) {
          setRiskArchetypeName(null)
          return
        }

        const normalizedScore = Number(matchedRiskProfile.score)
        const score = Number.isNaN(normalizedScore) ? null : normalizedScore

        const matchedRiskArchetype = riskArchetypes?.find((archetype) => {
          if (score === null) return false
          const minScore = Number(archetype.min_score)
          const maxScore = Number(archetype.max_score)
          const isInRange = score >= minScore && score < maxScore
          const isUpperBoundMatch = score === maxScore && maxScore === 10
          return isInRange || isUpperBoundMatch
        })
        setRiskArchetypeName(matchedRiskArchetype?.name ?? null)
      } catch {
        setRiskArchetypeName(null)
      }
    }

    fetchRiskArchetype()
  }, [investmentProposal?.risk_profile_id])

  async function handleExport(format: 'png' | 'pdf') {

    if (format === 'png') {
      if (!containerRef.current) return
      const canvas = await html2canvas(containerRef.current, { backgroundColor: '#ffffff', scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = imgData
      link.download = 'investment-proposal.png'
      link.click()
      return
    }

    // Export only the visible overview section.
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [2000, 1400] })
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 40
    const overviewSection = document.querySelector<HTMLDivElement>('.export-overview')
    if (!overviewSection) return

    const canvas = await html2canvas(overviewSection, { backgroundColor: '#ffffff', scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = pdfWidth - margin * 2
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let position = margin
    let heightLeft = imgHeight

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
    heightLeft -= (pdfHeight - margin * 2)

    while (heightLeft > 0) {
      position -= (pdfHeight - margin * 2)
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= (pdfHeight - margin * 2)
    }

    pdf.save('investment-proposal.pdf')
  }

  const chartData = useMemo(() => {
    if (!investmentProposal) return { pieData: [], summaryStats: null as any }

    const proposal = investmentProposal

    const groupedBonds = {
      treasuries: proposal.assets?.treasury ?? [],
      aaa_a: proposal.assets?.aaa_a ?? [],
      bbb: proposal.assets?.bbb ?? [],
      bb: proposal.assets?.bb ?? [],
      etfs: proposal.assets?.etfs ?? [],
    }

    const totalAssetCount = Object.values(groupedBonds).reduce((sum, bonds) => sum + bonds.length, 0)
    const countBasedWeights = GROUPS.reduce((acc, group) => {
      const bonds = groupedBonds[group.key as keyof typeof groupedBonds] ?? []
      acc[group.key] = totalAssetCount > 0 ? bonds.length / totalAssetCount : 0
      return acc
    }, {} as Record<string, number>)
    const distribution = parseDistribution(proposal.derived_distribution)
    const weights = distribution
      ? GROUPS.reduce((acc, group) => {
          acc[group.key] = distribution[group.distributionKey]
          return acc
        }, {} as Record<string, number>)
      : countBasedWeights

    // Build pie data where "count" actually represents the allocation percentage (×100 for nicer numbers)
    const pieData = GROUPS.map(group => {
      const bonds = groupedBonds[group.key as keyof typeof groupedBonds] as Bond[]
      return {
        name: group.label,
        // use percentage * 100 so the PieChart adds up to ~100 (or 1 if required)
        count: (weights[group.key] || 0) * 100,
        color: group.color,
        bonds,
      }
    })

    // Calculate stats per rating (table) – we still want the actual # of bonds
    const perRating = GROUPS.map(group => {
      const bonds = groupedBonds[group.key as keyof typeof groupedBonds] as Bond[]
      const avgYield = bonds.length
        ? bonds.reduce((s, b) => s + (b['current_yield'] || 0), 0) / bonds.length
        : 0
      return {
        name: group.label,
        count: bonds.length,
        avgYield,
        percentage: (weights[group.key] || 0) * 100,
        color: group.color,
      }
    })

    // Expected average portfolio yield – weight each group's average by its allocation
    const averageYield = perRating.reduce((sum, item) => {
      const weight = (item.percentage ?? 0) / 100 // convert back to 0–1 range
      return sum + item.avgYield * weight
    }, 0)

    const totalBonds = perRating.reduce((s, i) => s + i.count, 0)

    const summaryStats = {
      totalBonds,
      averageYield,
      perRating,
    }

    return { pieData, summaryStats }
  }, [investmentProposal])

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
    []
  )

  useEffect(() => {
    // Generate the random sequence after mount so server and client render the same initial chart.
    setProjectionSeed(Math.random())
  }, [chartData.summaryStats?.averageYield, (investmentProposal as InvestmentProposalType & { starting_amount?: number | null }).starting_amount, (investmentProposal as InvestmentProposalType & { startingAmount?: number | string | null }).startingAmount])

  const projectionData = useMemo(() => {
    const portfolioYield = Number(chartData.summaryStats?.averageYield ?? 0)
    const maxAnnualReturn = Number.isFinite(portfolioYield) ? Math.abs(portfolioYield) : 0
    const rawStartingAmount = (investmentProposal as InvestmentProposalType & { starting_amount?: number | null }).starting_amount ?? (investmentProposal as InvestmentProposalType & { startingAmount?: number | string | null }).startingAmount
    const parsedStartingAmount = Number(rawStartingAmount)
    const startingAmount = Number.isFinite(parsedStartingAmount) && parsedStartingAmount > 0 ? parsedStartingAmount : 100
    const hasStartingAmount = Number.isFinite(parsedStartingAmount) && parsedStartingAmount > 0
    const baselineValue = hasStartingAmount ? startingAmount : 100
    let portfolioValue = baselineValue
    let randomSeed = projectionSeed

    const nextRandom = () => {
      randomSeed = (randomSeed * 9301 + 49297) % 233280
      return randomSeed / 233280
    }

    const yearlyProjection = [
      {
        year: 'Initial',
        value: Number(baselineValue.toFixed(2)),
        annualReturn: 0,
      },
      ...Array.from({ length: 10 }, (_, index) => {
      const yearOffset = index + 1
      // Repeat three growth years followed by one correction year.
      const isCorrection = yearOffset % 4 === 0
      const halfYield = maxAnnualReturn / 2
      const minimumReturn = isCorrection ? -halfYield : halfYield
      const maximumReturn = isCorrection ? 0 : maxAnnualReturn
      const sampledReturn = minimumReturn + nextRandom() * (maximumReturn - minimumReturn)
      const annualReturn = Math.min(maximumReturn, Math.max(minimumReturn, Number(sampledReturn.toFixed(2))))
      portfolioValue *= 1 + annualReturn / 100

      return {
        year: `Year ${yearOffset}`,
        value: Number(portfolioValue.toFixed(2)),
        annualReturn,
      }
      }),
    ]

    const annualReturns = yearlyProjection.slice(1)
    const averageAnnualReturn = annualReturns.reduce((sum, point) => sum + point.annualReturn, 0) / annualReturns.length
    const projectedValue = yearlyProjection.at(-1)?.value ?? baselineValue

    return {
      averageAnnualReturn,
      hasStartingAmount,
      baselineValue,
      maxVolatility: maxAnnualReturn,
      projectedValue,
      data: yearlyProjection.map((point, yearOffset) => ({
        ...point,
        averageValue: Number((baselineValue + (projectedValue - baselineValue) * yearOffset / annualReturns.length).toFixed(2)),
      })),
    }
  }, [chartData.summaryStats?.averageYield, (investmentProposal as InvestmentProposalType & { starting_amount?: number | null }).starting_amount, (investmentProposal as InvestmentProposalType & { startingAmount?: number | string | null }).startingAmount, projectionSeed])

  const summaryStatsColumns: ColumnDefinition<any>[] = [
    {
      header: 'Description',
      accessorKey: 'name',
    },
    {
      header: '# Assets',
      accessorKey: 'count',
      cell: ({ getValue }) => (
        <span className="text-sm text-subtitle ml-auto">
          {String(getValue() ?? '')}
        </span>
      ),
    },
    {
      header: '%',
      accessorKey: 'percentage',
      cell: ({ getValue }) => (
        <span className="text-sm text-subtitle ml-auto">
          {((getValue())).toFixed(1) || 0}%
        </span>
      ),
    },
    {
      header: 'Expected Yield',
      accessorKey: 'avgYield',
      cell: ({ getValue }) => (
        <span className="text-sm text-subtitle ml-auto">
          {((getValue())).toFixed(1) || 0 }%
        </span>
      )
    }
  ]

  return (
  <div>
    {/* Toolbar */}
    <div className="flex justify-end gap-2 mb-2">
      <Button size="sm" variant="primary" onClick={() => handleExport('pdf')}>
        <Download className="h-4 w-4 mr-1" /> PDF
      </Button>
    </div>

    {/* Main content to capture */}
    <div ref={containerRef} className="flex flex-col gap-5 w-full text-lg">
      {/* Overview section for export */}
      <div className="export-overview flex flex-col gap-5">

        <h3 className="text-5xl font-semibold text-primary">
          Investment Proposal
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-5">
          <Card className="p-6 w-full h-full gap-5 flex flex-col">
            <h3 className="text-xl font-semibold text-foreground">Portfolio Stats</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-subtitle text-sm">Expected Average Yield</p>
                  <p className="text-3xl font-bold text-primary">{chartData.summaryStats?.averageYield?.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-subtitle text-sm">Total Assets</p>
                  <p className="text-xl font-semibold text-foreground">{chartData.summaryStats?.totalBonds}</p>
                </div>
	                {investmentProposal?.risk_profile_id && (
	                  <div>
	                    <p className="text-subtitle text-sm">Risk Profile</p>
	                    <p className="text-xl font-semibold text-foreground">
	                      {riskArchetypeName ?? 'N/A'}
	                    </p>
	                  </div>
	                )}
                </div>
            <DataTable 
              data={chartData.summaryStats?.perRating ?? []} 
              columns={summaryStatsColumns} 
            />
          </Card>
          <Card className='w-full h-full gap-10 flex flex-col p-5'>
            <h3 className="text-xl font-semibold text-foreground">Portfolio Distribution by Rating</h3>

            <div className="h-fit">
              <ChartContainer
                config={{
                  value: {
                    label: "Portfolio Value",
                  },
                }}
                className="h-full w-full"
              >
                <PieChart>
                  <Pie
                    data={chartData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={130}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {chartData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                      content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-lg">
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-3 w-3 rounded-full" 
                                  style={{ backgroundColor: data.color }}
                                />
                                <span className="font-semibold">{data.name}</span>
                              </div>
                                <div className="grid gap-1 text-sm">
                                  <div>Allocation: {Number(data.count ?? 0).toFixed(1)}%</div>
                                </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2">
              {chartData.pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
          <Card className="col-span-2 p-6 w-full h-full gap-5 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">10-Year Return Projection</h3>
                <p className="mt-1 text-sm text-subtitle">
                  Three growth years at +half to +full portfolio yield, followed by one correction year at 0 to −half yield.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-subtitle">Projected Value</p>
                <p className="text-2xl font-bold text-primary">
                  {projectionData.hasStartingAmount
                    ? currencyFormatter.format(projectionData.projectedValue)
                    : `${projectionData.projectedValue.toFixed(1)} index`}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-subtitle tabular-nums">
                Simulated annual returns range from −{projectionData.maxVolatility.toFixed(2)}% to +{projectionData.maxVolatility.toFixed(2)}%, with an average annual return of {projectionData.averageAnnualReturn.toFixed(2)}%.
              </p>
            </div>

            {!projectionData.hasStartingAmount && (
              <p className="text-xs text-subtitle">
                No starting amount was saved for this proposal, so this chart uses a base index of 100.
              </p>
            )}

            <div className="h-[320px] w-full">
              <ChartContainer
                config={{
                  projectedValue: {
                    label: 'Projected Value',
                    color: '#1D4ED8',
                  },
                }}
                className="h-full w-full"
              >
                <LineChart data={projectionData.data} margin={{ top: 16, right: 24, left: 12, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={90}
                    tickFormatter={(value) =>
                      projectionData.hasStartingAmount
                        ? currencyFormatter.format(Number(value))
                        : `${Number(value).toFixed(0)}`
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-projectedValue)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#1D4ED8' }}
                    activeDot={{ r: 6 }}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null

                      const data = payload[0].payload as { year: string; value: number; annualReturn: number }

                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                          <p className="text-xs text-subtitle">{data.year}</p>
                          <p className="text-sm font-medium text-foreground">
                            {projectionData.hasStartingAmount
                              ? currencyFormatter.format(data.value)
                              : `${data.value.toFixed(2)} index`}
                          </p>
                          <p className="text-xs text-subtitle">Return that year: {data.annualReturn.toFixed(2)}%</p>
                        </div>
                      )
                    }}
                  />
                  <Line type="linear" dataKey="averageValue" stroke="#64748B" strokeWidth={2} strokeDasharray="2 5" strokeLinecap="round" dot={false} isAnimationActive={false} />
                </LineChart>
              </ChartContainer>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-subtitle" aria-label="Projection legend">
              <div className="flex items-center gap-2"><span className="w-8 shrink-0 border-t-2 border-[#1D4ED8]" aria-hidden="true" />Solid blue: simulated portfolio value with annual variation.</div>
              <div className="flex items-center gap-2"><span className="w-8 shrink-0 border-t-2 border-dotted border-[#64748B]" aria-hidden="true" />Dotted gray: straight-line reference from the initial value to the same simulated final value.</div>
            </div>
            <p className="text-pretty text-xs leading-relaxed text-subtitle">
              {PROJECTION_DISCLAIMER}
            </p>
          </Card>
      </div>
      </div>
    </div>
  )
}

export default InvestmentProposal
