'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell } from 'recharts'
import { useMemo, useState } from 'react'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { InvestmentProposal as InvestmentProposalType } from '@/lib/tools/investment-proposals'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/misc/DataTable'

type Props = {
  investmentProposal: InvestmentProposalType[]
}

const InvestmentProposal = ({investmentProposal}: Props) => {
    // Rating color map must be defined before usage
    const RATING_COLORS = {
        // Vivid blue shades aligned with updated secondary palette
        'AAA/AA/A': '#1D4ED8',   // secondary.dark
        'BBB': '#3B82F6',        // secondary.DEFAULT
        'BB': '#60A5FA',         // secondary.light
        'ETFs': '#93C5FD',       // blue-300 for differentiation
        'Other': '#2563EB',      // blue-600 as fallback
    } as const

    const [showPortfolioOverview, setShowPortfolioOverview] = useState(false)

    const chartData = useMemo(() => {
        if (!investmentProposal) return { pieData: [], summaryStats: null as any }
    
        const pieData = investmentProposal.map(group => {
          const ratingLabel = group.name === 'bonds_aaa_a' ? 'AAA/AA/A' : 
                            group.name === 'bonds_bbb' ? 'BBB' :
                            group.name === 'bonds_bb' ? 'BB' : 'ETFs'
          
          return {
            name: ratingLabel,
            count: group.bonds.length,
            color: RATING_COLORS[ratingLabel as keyof typeof RATING_COLORS] || RATING_COLORS.Other,
            bonds: group.bonds
          }
        })
    
        const totalBonds = pieData.reduce((sum, item) => sum + item.count, 0)
    
        // Weighted overall average yield across all bonds
        const allBonds = investmentProposal.flatMap(group => group.bonds)
        const averageYield = allBonds.length
          ? allBonds.reduce((sum, bond) => sum + (bond['Current Yield'] || 0), 0) / allBonds.length
          : 0
    
        // Per-rating breakdown
        const perRating = pieData.map(item => {
          const avgYield = item.bonds.length
            ? item.bonds.reduce((s, b) => s + (b['Current Yield'] || 0), 0) / item.bonds.length
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
        {investmentProposal.map((group) => (
          <Card key={group.name} className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ 
                    backgroundColor: RATING_COLORS[
                      group.name === 'bonds_aaa_a' ? 'AAA/AA/A' : 
                      group.name === 'bonds_bbb' ? 'BBB' :
                      group.name === 'bonds_bb' ? 'BB' : 'Other'
                    ]
                  }}
                />
                <h3 className="text-xl font-semibold text-foreground">
                  {group.name === 'bonds_aaa_a' ? 'AAA/AA/A Rated Bonds' : 
                  group.name === 'bonds_bbb' ? 'BBB Rated Bonds' :
                  group.name === 'bonds_bb' ? 'BB Rated Bonds' : 
                  group.equivalents.join(', ') + ' Rated Bonds'}
                </h3>
              </div>
              <Badge variant="secondary">
                {group.bonds.length} bonds
              </Badge>
            </div>

            <Separator />

            <DataTable
              data={group.bonds}
              enablePagination
              pageSize={10}
              enableFiltering
            />
          </Card>
        ))}
      </div>   
    )}

    <p className="text-sm text-error">
    The investment proposal is based on the risk profile of the account. If you want to see more details, please contact us and set up a meeting.
    </p>
    
  </div>
  )
}

export default InvestmentProposal