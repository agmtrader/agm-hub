'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { GenerateInvestmentProposal } from '@/utils/tools/investment_proposals'
import { ReadAccountRiskProfiles, ListRiskProfiles } from '@/utils/tools/risk-profile'
import { AccountRiskProfile, RiskProfile } from '@/lib/tools/risk-profile'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, DollarSign, Calendar, Star } from 'lucide-react'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DashboardPage from '@/components/misc/DashboardPage'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { PieChart, Pie, Cell } from 'recharts'
import { toast } from '@/hooks/use-toast'

interface Bond {
  [key: string]: any
}

interface InvestmentProposal {
  name: string
  equivalents: string[]
  bonds: Bond[]
}

const InvestmentProposals = () => {

  const [accountRiskProfiles, setAccountRiskProfiles] = useState<AccountRiskProfile[] | null>(null)
  const [riskProfilesList, setRiskProfilesList] = useState<RiskProfile[] | null>(null)
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<string>('')

  const [investmentProposal, setInvestmentProposal] = useState<InvestmentProposal[] | null>(null)

  const RATING_COLORS = {
    'AAA/AA/A': '#22c55e',
    'BBB': '#f59e0b',
    'BB': '#ef4444',
    'B': '#dc2626',
    'Other': '#6b7280'
  }

  const chartData = useMemo(() => {
    if (!investmentProposal) return { pieData: [], summaryStats: null }

    const pieData = investmentProposal.map(group => {
      const totalValue = group.bonds.reduce((sum, bond) => sum + (bond.PositionValue || 0), 0)
      const ratingLabel = group.name === 'bonds_aaa_a' ? 'AAA/AA/A' : 
                         group.name === 'bonds_bbb' ? 'BBB' :
                         group.name === 'bonds_bb' ? 'BB' : 'Other'
      
      return {
        name: ratingLabel,
        value: totalValue,
        count: group.bonds.length,
        color: RATING_COLORS[ratingLabel as keyof typeof RATING_COLORS] || RATING_COLORS.Other,
        bonds: group.bonds
      }
    })

    const totalPortfolioValue = pieData.reduce((sum, item) => sum + item.value, 0)
    const totalBonds = pieData.reduce((sum, item) => sum + item.count, 0)
    const averageYield = investmentProposal.reduce((sum, group) => {
      const groupAvgYield = group.bonds.reduce((bondSum, bond) => bondSum + (bond.YTM || 0), 0) / group.bonds.length
      return sum + groupAvgYield
    }, 0) / investmentProposal.length

    const summaryStats = {
      totalValue: totalPortfolioValue,
      totalBonds: totalBonds,
      averageYield: averageYield,
      ratingDistribution: pieData.map(item => ({
        ...item,
        percentage: (item.value / totalPortfolioValue) * 100
      }))
    }

    return { pieData, summaryStats }
  }, [investmentProposal])

  // Initial fetch for risk profiles only
  useEffect(() => {
    async function fetchRiskProfiles() {
      try {
        // Fetch both account risk profiles and the master risk profiles list
        const [accountProfiles, riskProfiles] = await Promise.all([
          ReadAccountRiskProfiles(),
          ListRiskProfiles()
        ])

        setAccountRiskProfiles(accountProfiles)
        setRiskProfilesList(riskProfiles)

        // Match and log the profiles
        if (accountProfiles && riskProfiles) {
          accountProfiles.forEach(accountProfile => {
            const matchedRiskProfile = riskProfiles.find(
              riskProfile => riskProfile.id.toString() === accountProfile.risk_profile_id.toString()
            )
        })
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch risk profiles',
          variant: 'destructive',
        })
      }
    }

    fetchRiskProfiles()
  }, [])

  // Fetch investment proposals when a risk profile is selected
  useEffect(() => {
    if (!selectedRiskProfile) return

    async function fetchProposal() {
      try {

        // Check if account risk profiles are loaded
        if (!accountRiskProfiles) throw new Error('Account risk profiles not found')

        // Find the selected account risk profile
        const selectedAccountProfile = accountRiskProfiles.find(
          profile => profile.id.toString() === selectedRiskProfile
        )

        // Check if the selected account risk profile is found
        if (!selectedAccountProfile) throw new Error('Selected account risk profile not found')

        // Find the matched risk profile
        const matchedRiskProfile = riskProfilesList?.find(
          riskProfile => riskProfile.id.toString() === selectedAccountProfile.risk_profile_id.toString()
        )

        if (!matchedRiskProfile) throw new Error('Matched risk profile not found')

        // Generate the investment proposal
        const data = await GenerateInvestmentProposal(matchedRiskProfile.id.toString())

        // Set the proposal groups
        setInvestmentProposal(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch investment proposal',
          variant: 'destructive',
        })
      }
    }

    fetchProposal()
  }, [selectedRiskProfile, accountRiskProfiles, riskProfilesList])

  if (!riskProfilesList || !accountRiskProfiles) {
    return (
      <LoadingComponent />
    )
  }

  return (
    <DashboardPage title="Investment Proposals" description="Generate tailored investment proposals based on your risk profile">
      {/* Risk Profile Selection */}
      <div className="space-y-4">
          
          <div className="w-full max-w-md">
            <Label htmlFor="risk-profile-select" className="text-sm font-medium text-foreground">
              Select Risk Profile
            </Label>
            <Select 
              value={selectedRiskProfile} 
              onValueChange={setSelectedRiskProfile}
              disabled={!accountRiskProfiles || !riskProfilesList}
            >
              <SelectTrigger id="risk-profile-select" className="w-full mt-2">
                <SelectValue placeholder={
                  !accountRiskProfiles || !riskProfilesList 
                    ? "Loading risk profiles..." 
                    : "Select a risk profile"
                } />
              </SelectTrigger>
              <SelectContent>
                {accountRiskProfiles?.map((accountProfile) => {
                  const matchedRiskProfile = riskProfilesList?.find(
                    riskProfile => riskProfile.id === accountProfile.risk_profile_id
                  )
                  
                  return (
                    <SelectItem key={accountProfile.id} value={accountProfile.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{accountProfile.name}</span>
                        <span className="text-xs text-subtitle">
                          Score: {accountProfile.score}
                        </span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
      </div>

      {/* Investment Proposals */}
      {!selectedRiskProfile ? (
        <LoadingComponent />
      ) : !investmentProposal || investmentProposal.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-lg">No investment proposals available for the selected risk profile.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Portfolio Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pie Chart */}
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
                        dataKey="value"
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
                                    <div>Value: ${data.value.toLocaleString()}</div>
                                    <div>Bonds: {data.count}</div>
                                    <div>Percentage: {((data.value / chartData.summaryStats?.totalValue!) * 100).toFixed(1)}%</div>
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
                        {((item.value / chartData.summaryStats?.totalValue!) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Summary Statistics */}
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Portfolio Summary</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <DollarSign className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm text-subtitle">Total Value</p>
                      <p className="text-xl font-bold text-foreground">
                        ${chartData.summaryStats?.totalValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-subtitle">Total Bonds</p>
                      <p className="text-xl font-bold text-foreground">
                        {chartData.summaryStats?.totalBonds}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm text-subtitle">Average Yield</p>
                      <p className="text-xl font-bold text-foreground">
                        {(chartData.summaryStats?.averageYield! * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Rating Distribution */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Rating Breakdown</h4>
                  {chartData.summaryStats?.ratingDistribution.map((item) => (
                    <div key={item.name} className="flex justify-between items-center text-sm">
                      <span className="text-subtitle">{item.name}</span>
                      <Badge variant="outline" style={{ color: item.color }}>
                        {item.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/*
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Detailed Bond Analysis</h2>
              {proposalGroups.map((group) => (
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
                    columns={bondColumns}
                    enablePagination
                    pageSize={10}
                    enableFiltering
                  />
                </Card>
              ))}
            </div>
          */}
        </div>
      )}
    </DashboardPage>
  )
}

export default InvestmentProposals