'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell } from 'recharts'
import { useMemo, useState, useEffect } from 'react'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Bond, InvestmentProposal as InvestmentProposalType } from '@/lib/tools/investment-proposals'
import type { RiskArchetype, RiskProfile } from '@/lib/tools/risk-profile'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/misc/DataTable'
import type { ColumnDefinition } from '@/components/misc/DataTable'
import { ListRiskArchetypes } from '@/utils/tools/risk-profile'
import { toast } from '@/hooks/use-toast'

type Props = {
  investmentProposal: InvestmentProposalType
  riskProfile: RiskProfile
}

const InvestmentProposal = ({ investmentProposal, riskProfile }: Props) => {
  
  const RATING_COLORS = {
        'AAA/AA/A': '#1D4ED8',
        'BBB': '#3B82F6',
        'BB': '#60A5FA',
        'ETFs': '#93C5FD',
        'Other': '#2563EB',
  } as const

  const GROUPS = [
    { key: 'aaa_a', label: 'AAA/AA/A', color: RATING_COLORS['AAA/AA/A'] },
    { key: 'bbb', label: 'BBB', color: RATING_COLORS['BBB'] },
    { key: 'bb', label: 'BB', color: RATING_COLORS['BB'] },
    { key: 'etfs', label: 'ETFs', color: RATING_COLORS['ETFs'] },
  ]

  const [showPortfolioOverview, setShowPortfolioOverview] = useState(false)
  const [riskArchetypes, setRiskArchetypes] = useState<RiskArchetype[]>([])
  const [currentArchetype, setCurrentArchetype] = useState<RiskArchetype | null>(null)

  useEffect(() => {
    async function fetchArchetypesAndMatch() {
      try {
        const archetypes = await ListRiskArchetypes()
        if (!archetypes) throw new Error('No archetypes found')
        setRiskArchetypes(archetypes || [])
        const matched = archetypes.find(a => riskProfile.score >= a.min_score && riskProfile.score <= a.max_score) || null
        setCurrentArchetype(matched)  
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to fetch archetypes', variant: 'destructive' })
      }
    }
    fetchArchetypesAndMatch()
  }, [riskProfile.score])

  const chartData = useMemo(() => {
    if (!investmentProposal) return { pieData: [], summaryStats: null as any }
    const proposal = investmentProposal
    const pieData = GROUPS.map(group => {
      const bonds = proposal[group.key as keyof typeof proposal] as any[]
      return {
        name: group.label,
        count: bonds.length,
        color: group.color,
        bonds,
      }
    })
    const totalBonds = pieData.reduce((sum, item) => sum + item.count, 0)
    const allBonds = GROUPS.flatMap(group => (proposal[group.key as keyof typeof proposal] as any[]))
    const averageYield = allBonds.length
      ? allBonds.reduce((sum, bond) => sum + (bond['current_yield'] || 0), 0) / allBonds.length
      : 0
    const perRating = pieData.map(item => {
      const avgYield = item.bonds.length
        ? item.bonds.reduce((s: number, b: any) => s + (b['current_yield'] || 0), 0) / item.bonds.length
        : 0
      const percentage = totalBonds ? (item.count / totalBonds) * 100 : 0
      return {
        name: item.name,
        count: item.count,
        avgYield,
        percentage,
        color: item.color,
      }
    })
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
      ),
    }
  ]

  return (
    <div className="flex flex-col gap-2 w-full text-lg">

    {/* Matched Risk Archetype */}
    {currentArchetype && (
      <h3 className="text-5xl font-semibold text-primary">
        {currentArchetype.name}
      </h3>
    )}

    <div className="flex flex-col lg:flex-row items-center gap-5">
      <Card className='w-full h-full gap-5 flex flex-col'>
        <div className="p-6 flex flex-col gap-5 w-full h-full">

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
                  innerRadius={60}
                  outerRadius={120}
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
                               <div>Bonds: {data.count}</div>
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
        </div>
      </Card>

      <Card className="p-6 w-fit gap-5 flex flex-col">
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
          data={chartData.summaryStats?.perRating} 
          columns={summaryStatsColumns} 
          />
      </Card>
    </div>

    {showPortfolioOverview && (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Detailed Bond Analysis</h2>
        {GROUPS.map((group) => {
          const bonds = investmentProposal ? (investmentProposal[group.key as keyof typeof investmentProposal] as any[]) : []
          return (
            <Card key={group.key} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h3 className="text-2xl font-semibold text-foreground">
                    {group.label} Rated Bonds
                  </h3>
                </div>
                <Badge variant="secondary">
                  {bonds.length} bonds
                </Badge>
              </div>
              <Separator />
              <DataTable
                data={bonds}
                columns={bondColumns as unknown as ColumnDefinition<any>[]}
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
    The investment proposal is based on the risk profile of the account. If you want to see more details, please contact us and set up a meeting.
    </p>
    
  </div>
  ) 
}

export default InvestmentProposal