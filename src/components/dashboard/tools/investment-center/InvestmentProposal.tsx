'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell } from 'recharts'
import { useMemo, useState } from 'react'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Bond, InvestmentProposal as InvestmentProposalType } from '@/lib/tools/investment-proposals'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/misc/DataTable'
import type { ColumnDefinition } from '@/components/misc/DataTable'

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

  const [showPortfolioOverview, setShowPortfolioOverview] = useState(false)

    const GROUPS = [
      { key: 'aaa_a', label: 'AAA/AA/A', color: RATING_COLORS['AAA/AA/A'] },
      { key: 'bbb', label: 'BBB', color: RATING_COLORS['BBB'] },
      { key: 'bb', label: 'BB', color: RATING_COLORS['BB'] },
      { key: 'etfs', label: 'ETFs', color: RATING_COLORS['ETFs'] },
    ]

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

  return (
    <div className="flex flex-col gap-6">

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Portfolio Distribution by Rating</h3>
          </div>
          
          <div className="h-80">
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
                <span className="text-xs text-subtitle ml-auto">
                  {((item.count / chartData.summaryStats?.totalBonds!) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Side stats card */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Portfolio Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-subtitle text-xs">Average Yield</p>
              <p className="text-2xl font-bold text-foreground">{chartData.summaryStats?.averageYield?.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-subtitle text-xs">Total Assets</p>
              <p className="text-lg font-semibold text-foreground">{chartData.summaryStats?.totalBonds}</p>
            </div>
          </div>
          <Separator />
           <div className="space-y-2">
            {chartData.summaryStats?.perRating?.map((item: any) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-foreground w-16">{item.name}</span>
                <span className="text-xs text-subtitle ml-auto">
                  {item.count} • {item.percentage.toFixed(1)}% • {item.avgYield.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>

    {showPortfolioOverview && (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Detailed Bond Analysis</h2>
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
                  <h3 className="text-xl font-semibold text-foreground">
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

    <p className="text-sm text-error">
    The investment proposal is based on the risk profile of the account. If you want to see more details, please contact us and set up a meeting.
    </p>
    
  </div>
  ) 
}

export default InvestmentProposal