'use client'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PieChart, Pie, Cell } from 'recharts'
import { useMemo, useState, useRef } from 'react'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import {
  Bond,
  InvestmentProposal as InvestmentProposalType,
} from '@/lib/tools/investment-proposals'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/misc/DataTable'
import type { ColumnDefinition } from '@/components/misc/DataTable'
import { Switch } from '@/components/ui/switch'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

type Props = {
  investmentProposal: InvestmentProposalType
}

const InvestmentProposal = ({ investmentProposal }: Props) => {
  
  const RATING_COLORS = {
        'AAA/AA/A': '#1D4ED8',
        'BBB': '#3B82F6',
        'BB': '#60A5FA',
        'ETFs': '#93C5FD',
        'Other': '#2563EB',
  } as const

  const GROUPS = [
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

  const [showPortfolioOverview, setShowPortfolioOverview] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

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

    // PDF – page-per-section (overview + one per bond group)
    // Create PDF in landscape 16:9 ratio (1280×720 points)
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [2000, 1400] })
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Define a uniform margin (in points)
    const margin = 40

    // Collect overview section and each bond section separately to ensure one page per part
    const overviewSection = document.querySelector<HTMLDivElement>('.export-overview')
    const bondSections = Array.from(document.querySelectorAll<HTMLDivElement>('.export-page')) as HTMLDivElement[]
    const sections = [overviewSection, ...bondSections].filter(Boolean) as HTMLDivElement[]

    if (!sections.length) return

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const canvas = await html2canvas(section, { backgroundColor: '#ffffff', scale: 2 })
      const imgData = canvas.toDataURL('image/png')

      const imgWidth = pdfWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let position = margin
      let heightLeft = imgHeight

      // For each section, we may need multiple PDF pages if it's tall
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= (pdfHeight - margin * 2)

      while (heightLeft > 0) {
        position -= (pdfHeight - margin * 2)
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= (pdfHeight - margin * 2)
      }

      if (i < sections.length - 1) {
        pdf.addPage()
      }
    }

    pdf.save('investment-proposal.pdf')
  }

  const chartData = useMemo(() => {
    if (!investmentProposal) return { pieData: [], summaryStats: null as any }

    const proposal = investmentProposal
    const distribution = proposal.distribution ?? null
    if (!distribution) return { pieData: [], summaryStats: null as any }
    const rawValues = GROUPS.map(group => distribution[group.distributionKey])
    const maxValue = Math.max(0, ...rawValues)
    const sumValues = rawValues.reduce((sum, value) => sum + value, 0)
    const isPercentage = maxValue > 1 || sumValues > 1.01
    const normalizeWeight = (value: number) => (isPercentage ? value / 100 : value)
    const weights = GROUPS.reduce((acc, group, index) => {
      acc[group.key] = normalizeWeight(rawValues[index] ?? 0)
      return acc
    }, {} as Record<string, number>)

    // Build pie data where "count" actually represents the allocation percentage (×100 for nicer numbers)
    const pieData = GROUPS.map(group => {
      const bonds = proposal[group.key as keyof typeof proposal] as Bond[]
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
      const bonds = proposal[group.key as keyof typeof proposal] as Bond[]
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
  
  const bondColumns: ColumnDefinition<Bond>[] = [
    {
      header: 'Symbol',
      accessorKey: 'symbol',
    },
    {
      header: 'Current Yield',
      accessorKey: 'current_yield',
      cell: ({ getValue }) => `${Number(getValue() ?? 0).toFixed(2)}%`,
    },
    {
      header: 'Equivalent',
      accessorKey: 'equivalent',
      cell: ({ getValue }) => (
        <Badge variant="secondary">{String(getValue() ?? '')}</Badge>
      ),
    },
  ]

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


        <div className="flex items-center gap-2">

          <Switch
            checked={showPortfolioOverview}
            onCheckedChange={(checked) => setShowPortfolioOverview(checked === true)}
          />

          <p className="text-sm text-subtitle">Show Portfolio Overview</p>
        </div>

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
      </div> {/* <-- end export-overview */}

      {showPortfolioOverview && (
        <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Detailed Bond Analysis</h2>
              {GROUPS.map((group) => {
                const bonds = investmentProposal
                  ? (investmentProposal[group.key as keyof typeof investmentProposal] as any[])
                  : []
                const title =
                  group.key === 'etfs'
                    ? 'ETFs'
                    : `${group.label} Rated Bonds`
                return (
                  <Card key={group.key} className="p-6 space-y-6 export-page">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: group.color }}
                        />
                        <h3 className="text-2xl font-semibold text-foreground">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <Separator />
                    <DataTable
                      data={bonds}
                      columns={bondColumns}
                      enablePagination
                      pageSize={10}
                      enableFiltering
                    />
                  </Card>
                )
              })}
        </div>
      )}

      <p className="text-base text-error">
          The investment proposal reflects the provided distribution. If you want to see more details, please contact us and set up a meeting.
          </p>
      </div>
    </div>
  )
}

export default InvestmentProposal