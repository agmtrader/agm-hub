'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import type { GaugeComponentProps } from 'react-gauge-component'
import {
  AlertCircle,
  ChevronDown,
  DollarSign,
  Gauge,
  Info,
  Lock,
  ShieldAlert,
  Target,
  TrendingUp,
  Unlock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { RiskArchetype } from '@/lib/clients/risk-profile'
import {
  AssetKey,
  BondRatingAllocation,
  BondRatingKey,
  PortfolioAllocation,
  PortfolioPlan,
  PortfolioPlanPayload,
  RiskTolerance,
} from '@/lib/clients/portfolio-plans'
import {
  allocationCaps,
  calculatePortfolio,
  formatCurrency,
  formatPercent,
  getAllocationFromRiskArchetype,
  getBondRatingAllocationFromRiskArchetype,
  getFallbackPlannerAssets,
  getRiskToleranceFromScore,
  loadPlannerAssetProfiles,
  normalizeAllocation,
  normalizeBondRatingAllocation,
} from '@/lib/clients/portfolio-planner'
import { CreatePortfolioPlan, ReadPortfolioPlanById, UpdatePortfolioPlan } from '@/utils/clients/portfolio-plans'
import { CreateInvestmentProposalFromPlan } from '@/utils/clients/investment_proposals'
import { InvestmentProposal } from '@/lib/clients/investment-proposals'

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false }) as React.ComponentType<GaugeComponentProps>

type Props = {
  customerName: string
  riskProfileId: string
  riskScore: number
  riskArchetypes: RiskArchetype[]
  initialPlan?: PortfolioPlan | null
  onProposalGenerated?: (proposal: InvestmentProposal, plan: PortfolioPlan) => void
}

const assetLabels: Record<AssetKey, string> = {
  cash: 'Cash',
  treasuries: 'Treasuries',
  bonds: 'Corporate Bonds',
  stocks: 'Stocks/ETF',
}

const assetDescriptions: Record<AssetKey, string> = {
  cash: 'Short-rate cash proxy',
  treasuries: 'U.S. Treasury exposure',
  bonds: 'Corporate bond sleeve',
  stocks: 'Broad equity and ETF sleeve',
}

const assetHoverDescriptions: Record<AssetKey, string> = {
  cash: 'Cash is the most stable sleeve. It lowers portfolio swings, but it usually contributes the least to long-term return.',
  treasuries: 'Treasuries represent U.S. government bond exposure. They can help reduce risk and provide income with lower credit risk.',
  bonds: 'Corporate bonds add income from company debt. They usually carry more credit risk than Treasuries and less growth risk than stocks.',
  stocks: 'Stocks and ETFs provide growth exposure. They can raise expected return, but they usually add the most short-term volatility.',
}

const assetColors: Record<AssetKey, { accent: string; soft: string; strong: string }> = {
  cash: { accent: '#2F9E44', soft: 'rgba(47,158,68,0.12)', strong: '#2B8A3E' },
  treasuries: { accent: '#C0B72F', soft: 'rgba(192,183,47,0.16)', strong: '#9C8F0F' },
  bonds: { accent: '#E8590C', soft: 'rgba(232,89,12,0.14)', strong: '#D9480F' },
  stocks: { accent: '#C92A2A', soft: 'rgba(201,42,42,0.14)', strong: '#A51111' },
}

const bondRatingLabels: Record<BondRatingKey, string> = {
  aaa: 'A-AAA',
  bbb: 'BBB',
  bb: 'BB',
}

const bondRatingColors: Record<BondRatingKey, string> = {
  aaa: '#B64225',
  bbb: '#DF5730',
  bb: '#F08A52',
}

const riskLabels: Record<RiskTolerance, string> = {
  conservative: 'Conservative',
  moderate: 'Moderate',
  aggressive: 'Aggressive',
}

const riskToleranceDescriptions: Record<RiskTolerance, string> = {
  conservative: 'Prioritizes capital preservation and lower volatility, accepting a lower expected return in exchange for a steadier path.',
  moderate: 'Balances growth and stability with a diversified mix of defensive assets and growth-oriented exposure.',
  aggressive: 'Prioritizes higher expected growth and accepts larger portfolio swings and deeper possible drawdowns.',
}

const metricDescriptions = {
  expectedReturn: 'Weighted average annual return estimate from the current allocation and market assumptions.',
  portfolioRisk: 'Estimated annual volatility for the current portfolio mix. Higher volatility means wider potential swings.',
  annualGain: 'Estimated one-year dollar gain from the starting amount and expected return, with a modeled low-to-high range.',
  instrumentRisk: 'Shows each instrument contribution to total estimated portfolio risk based on its allocation and volatility.',
}

const archetypeTone: Record<RiskTolerance, { accent: string; soft: string; border: string }> = {
  conservative: { accent: '#2F9E44', soft: 'rgba(47,158,68,0.1)', border: 'rgba(47,158,68,0.28)' },
  moderate: { accent: '#F08C00', soft: 'rgba(240,140,0,0.1)', border: 'rgba(240,140,0,0.3)' },
  aggressive: { accent: '#E03131', soft: 'rgba(224,49,49,0.1)', border: 'rgba(224,49,49,0.3)' },
}

const defaultLocks = {
  cash: false,
  treasuries: false,
  bonds: false,
  stocks: false,
}

const defaultBondLocks = {
  aaa: false,
  bbb: false,
  bb: false,
}

function getRiskToleranceFromArchetypeName(name: string): RiskTolerance {
  const normalized = name.toLowerCase()
  if (normalized.startsWith('conservative')) return 'conservative'
  if (normalized.startsWith('aggressive')) return 'aggressive'
  return 'moderate'
}

function getArchetypeTierLabel(name: string) {
  const match = name.match(/\b([ABC])\b/i)
  return match?.[1]?.toUpperCase() ?? name.trim().slice(-1).toUpperCase()
}

const PortfolioPlanner = ({
  customerName,
  riskProfileId,
  riskScore,
  riskArchetypes,
  initialPlan = null,
  onProposalGenerated,
}: Props) => {
  const { toast } = useToast()
  const matchedArchetype =
    riskArchetypes.find((archetype) => {
      const minScore = Number(archetype.min_score)
      const maxScore = Number(archetype.max_score)
      return riskScore >= minScore && (riskScore < maxScore || (riskScore === maxScore && maxScore === 10))
    }) ?? riskArchetypes[0]

  const [assets, setAssets] = useState(getFallbackPlannerAssets())
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [selectedArchetypeName, setSelectedArchetypeName] = useState(initialPlan?.selected_risk_archetype ?? matchedArchetype?.name ?? '')
  const [targetReturn, setTargetReturn] = useState(Number(initialPlan?.target_return ?? 7))
  const [startingAmount, setStartingAmount] = useState(Number(initialPlan?.starting_amount ?? 50000))
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(initialPlan?.risk_tolerance ?? getRiskToleranceFromScore(riskScore))
  const [allocation, setAllocation] = useState<PortfolioAllocation>(initialPlan?.allocation ?? getAllocationFromRiskArchetype(matchedArchetype))
  const [bondRatingAllocation, setBondRatingAllocation] = useState<BondRatingAllocation>(
    initialPlan?.bond_rating_allocation ?? getBondRatingAllocationFromRiskArchetype(matchedArchetype),
  )
  const [lockedAssets, setLockedAssets] = useState(initialPlan?.locked_assets ?? defaultLocks)
  const [lockedBondRatings, setLockedBondRatings] = useState(initialPlan?.locked_bond_ratings ?? defaultBondLocks)
  const [showBondLevels, setShowBondLevels] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [savedPlan, setSavedPlan] = useState<PortfolioPlan | null>(initialPlan)

  useEffect(() => {
    let mounted = true

    const fetchAssets = async () => {
      try {
        const nextAssets = await loadPlannerAssetProfiles()
        if (!mounted) return
        setAssets(nextAssets)
      } catch {
        if (!mounted) return
        setAssets(getFallbackPlannerAssets())
      } finally {
        if (mounted) setLoadingAssets(false)
      }
    }

    fetchAssets()

    return () => {
      mounted = false
    }
  }, [])

  const calculation = useMemo(
    () => calculatePortfolio(allocation, assets, targetReturn, startingAmount, riskTolerance),
    [allocation, assets, riskTolerance, startingAmount, targetReturn],
  )

  const dataSource = assets.some((asset) => asset.source === 'live') ? 'live' : 'fallback'
  const archetypeGroups = useMemo(() => {
    const grouped: Record<RiskTolerance, RiskArchetype[]> = {
      conservative: [],
      moderate: [],
      aggressive: [],
    }

    riskArchetypes.forEach((archetype) => {
      grouped[getRiskToleranceFromArchetypeName(archetype.name)].push(archetype)
    })

    ;(Object.keys(grouped) as RiskTolerance[]).forEach((tier) => {
      grouped[tier].sort((left, right) => {
        const order = ['A', 'B', 'C']
        return order.indexOf(getArchetypeTierLabel(left.name)) - order.indexOf(getArchetypeTierLabel(right.name))
      })
    })

    return grouped
  }, [riskArchetypes])

  const strongestReturnAsset = useMemo(() => {
    return (Object.keys(allocation) as AssetKey[]).reduce((best, key) => {
      const asset = assets.find((item) => item.key === key)
      const currentContribution = ((asset?.expectedReturn ?? 0) * allocation[key]) / 100
      const bestAsset = assets.find((item) => item.key === best)
      const bestContribution = ((bestAsset?.expectedReturn ?? 0) * allocation[best]) / 100
      return currentContribution > bestContribution ? key : best
    }, 'stocks' as AssetKey)
  }, [allocation, assets])

  const strongestRiskAsset = useMemo(() => {
    return (Object.keys(allocation) as AssetKey[]).reduce((best, key) => {
      const asset = assets.find((item) => item.key === key)
      const currentContribution = ((asset?.volatility ?? 0) * allocation[key]) / 100
      const bestAsset = assets.find((item) => item.key === best)
      const bestContribution = ((bestAsset?.volatility ?? 0) * allocation[best]) / 100
      return currentContribution > bestContribution ? key : best
    }, 'stocks' as AssetKey)
  }, [allocation, assets])

  const riskContribution = useMemo(() => {
    const total = (Object.keys(allocation) as AssetKey[]).reduce((sum, key) => {
      const asset = assets.find((item) => item.key === key)
      return sum + ((asset?.volatility ?? 0) * allocation[key]) / 100
    }, 0)

    return (Object.keys(allocation) as AssetKey[]).map((key) => {
      const asset = assets.find((item) => item.key === key)
      const value = ((asset?.volatility ?? 0) * allocation[key]) / 100
      return {
        key,
        label: assetLabels[key],
        percent: total > 0 ? (value / total) * 100 : 0,
      }
    })
  }, [allocation, assets])

  function buildPayload(): PortfolioPlanPayload {
    return {
      risk_profile_id: riskProfileId,
      name: customerName || null,
      target_return: targetReturn,
      starting_amount: startingAmount,
      risk_tolerance: riskTolerance,
      selected_risk_archetype: selectedArchetypeName || null,
      allocation,
      bond_rating_allocation: bondRatingAllocation,
      locked_assets: lockedAssets,
      locked_bond_ratings: lockedBondRatings,
      expected_return: calculation.expectedReturn,
      volatility: calculation.volatility,
      one_year_gain: calculation.oneYearGain,
      one_year_range_low: calculation.oneYearRangeLow,
      one_year_range_high: calculation.oneYearRangeHigh,
      risk_tier: calculation.riskTier,
      guidance: calculation.guidance,
      data_source: dataSource,
      assumptions: assets,
    }
  }

  async function persistPlan() {
    const payload = buildPayload()

    if (savedPlan?.id) {
      await UpdatePortfolioPlan({ id: savedPlan.id }, payload)
      const fullPlan = await ReadPortfolioPlanById(savedPlan.id)
      if (!fullPlan) throw new Error('Failed to reload saved portfolio plan')
      setSavedPlan(fullPlan)
      return fullPlan
    }

    const response = await CreatePortfolioPlan(payload)
    const fullPlan = await ReadPortfolioPlanById(response.id)
    if (!fullPlan) throw new Error('Failed to load created portfolio plan')
    setSavedPlan(fullPlan)
    return fullPlan
  }

  async function handleSavePlan() {
    setSaving(true)
    try {
      await persistPlan()
      toast({
        title: 'Success',
        description: 'Portfolio plan saved successfully',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save portfolio plan',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleGenerateProposal() {
    setGenerating(true)
    try {
      const plan = await persistPlan()
      const proposal = await CreateInvestmentProposalFromPlan(plan)
      toast({
        title: 'Success',
        description: 'Investment proposal generated successfully',
        variant: 'success',
      })
      onProposalGenerated?.(proposal, plan)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate investment proposal',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  function applyArchetype(name: string) {
    const archetype = riskArchetypes.find((item) => item.name === name)
    if (!archetype) return
    setSelectedArchetypeName(archetype.name)
    setRiskTolerance(getRiskToleranceFromArchetypeName(archetype.name))
    setAllocation(getAllocationFromRiskArchetype(archetype))
    setBondRatingAllocation(getBondRatingAllocationFromRiskArchetype(archetype))
  }

  function updateAsset(key: AssetKey, value: number) {
    if (lockedAssets[key]) return
    const lockedKeys = Object.entries(lockedAssets)
      .filter(([, locked]) => locked)
      .map(([assetKey]) => assetKey) as AssetKey[]
    setAllocation((current) => normalizeAllocation(current, key, value, lockedKeys))
  }

  function updateBondRating(key: BondRatingKey, value: number) {
    if (lockedBondRatings[key]) return
    const lockedKeys = Object.entries(lockedBondRatings)
      .filter(([, locked]) => locked)
      .map(([ratingKey]) => ratingKey) as BondRatingKey[]
    setBondRatingAllocation((current) => normalizeBondRatingAllocation(current, key, value, lockedKeys))
  }

  function toggleAssetLock(key: AssetKey) {
    setLockedAssets((current) => ({ ...current, [key]: !current[key] }))
  }

  function toggleBondLock(key: BondRatingKey) {
    setLockedBondRatings((current) => ({ ...current, [key]: !current[key] }))
  }

  function statCard(
    title: string,
    value: string,
    subtitle: string,
    tone: 'green' | 'amber' | 'orange' | 'neutral',
    icon: React.ReactNode,
    description?: string,
  ) {
    const toneClasses = {
      green: 'from-emerald-50 to-white border-emerald-200',
      amber: 'from-amber-50 to-white border-amber-200',
      orange: 'from-orange-50 to-white border-orange-200',
      neutral: 'from-slate-50 to-white border-slate-200',
    }

    return (
      <Card className={`bg-gradient-to-br ${toneClasses[tone]} p-4 shadow-sm`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <TooltipLabel label={title} description={description} className="text-sm font-medium text-foreground" />
            <p className="mt-1 text-2xl font-semibold leading-none text-foreground">{value}</p>
            <p className="text-sm text-subtitle mt-1">{subtitle}</p>
          </div>
          <div className="rounded-xl bg-white/80 p-1.5 text-foreground shadow-sm">{icon}</div>
        </div>
      </Card>
    )
  }

  return (
    <TooltipProvider delayDuration={120}>
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
        <div className="grid items-start gap-6 px-6 py-5 xl:grid-cols-[1.12fr_0.88fr]">
          <Card className="border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-foreground">Goal Inputs</p>
                <p className="text-sm text-subtitle">Minimal profile used for this first version.</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                <Target className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Customer name</p>
                <Input value={customerName} readOnly />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Target annual return</p>
                <div className="relative">
                  <Input type="number" value={targetReturn} onChange={(event) => setTargetReturn(Number(event.target.value || 0))} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-subtitle">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Starting amount</p>
                <Input type="number" value={startingAmount} onChange={(event) => setStartingAmount(Number(event.target.value || 0))} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Risk tolerance</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['conservative', 'moderate', 'aggressive'] as RiskTolerance[]).map((tier) => {
                    const tone = archetypeTone[tier]
                    const isActiveTier = riskTolerance === tier

                    return (
                      <div
                        key={tier}
                        className="rounded-2xl border bg-white p-3 transition"
                        style={{
                          borderColor: isActiveTier ? tone.border : 'rgb(226 232 240)',
                          boxShadow: isActiveTier ? `0 0 0 1px ${tone.border} inset` : undefined,
                        }}
                      >
                        <TooltipLabel
                          label={riskLabels[tier]}
                          description={riskToleranceDescriptions[tier]}
                          className="text-sm font-semibold"
                          style={{ color: tone.accent }}
                        />
                        <div className="mt-3 flex gap-2">
                          {archetypeGroups[tier].map((archetype) => {
                            const selected = selectedArchetypeName === archetype.name
                            return (
                              <button
                                key={archetype.id}
                                type="button"
                                onClick={() => applyArchetype(archetype.name)}
                                className="flex h-8 min-w-8 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition"
                                style={{
                                  borderColor: selected ? tone.accent : 'rgb(203 213 225)',
                                  backgroundColor: selected ? tone.accent : '#ffffff',
                                  color: selected ? '#ffffff' : '#1f2937',
                                }}
                              >
                                {getArchetypeTierLabel(archetype.name)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">Allocation</p>
                  <p className="text-sm text-subtitle">Total must equal 100%.</p>
                </div>
                <p className="text-2xl font-semibold text-orange-600">{calculation.allocationTotal}%</p>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="flex h-full" style={{ width: `${Math.min(100, calculation.allocationTotal)}%` }}>
                  {(['cash', 'treasuries', 'bonds', 'stocks'] as AssetKey[]).map((key) => (
                    <div
                      key={key}
                      className="h-full"
                      title={`${assetLabels[key]} ${allocation[key]}%`}
                      style={{
                        width: `${allocation[key]}%`,
                        backgroundColor: assetColors[key].accent,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                {(['cash', 'treasuries', 'bonds', 'stocks'] as AssetKey[]).map((key) => {
                  if (key === 'bonds') {
                    return (
                      <div key={key} className="grid gap-3">
                        <AssetSliderRow
                          label={assetLabels[key]}
                          description={assets.find((asset) => asset.key === key)?.benchmark ?? assetDescriptions[key]}
                          tooltipDescription={assetHoverDescriptions[key]}
                          color={assetColors[key].accent}
                          value={allocation[key]}
                          locked={lockedAssets[key]}
                          onToggleLock={() => toggleAssetLock(key)}
                          onChange={(value) => updateAsset(key, value)}
                          max={allocationCaps[key]}
                        />
                        <button
                          type="button"
                          onClick={() => setShowBondLevels((current) => !current)}
                          className="ml-4 inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-subtitle transition hover:bg-slate-100 hover:text-foreground"
                        >
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showBondLevels ? 'rotate-180' : ''}`} />
                          Bond levels
                        </button>
                        {showBondLevels && (
                        <div className="ml-4 border-l border-slate-200 pl-4">
                          <div className="grid gap-3">
                            {(['aaa', 'bbb', 'bb'] as BondRatingKey[]).map((ratingKey) => (
                              <AssetSliderRow
                                key={ratingKey}
                                label={bondRatingLabels[ratingKey]}
                                tooltipDescription="A corporate bond quality bucket. Higher ratings generally mean lower credit risk; lower ratings generally offer more yield with more credit risk."
                                color={bondRatingColors[ratingKey]}
                                value={bondRatingAllocation[ratingKey]}
                                locked={lockedBondRatings[ratingKey]}
                                onToggleLock={() => toggleBondLock(ratingKey)}
                                onChange={(value) => updateBondRating(ratingKey, value)}
                                suffix="%"
                                max={100}
                                nested
                              />
                            ))}
                          </div>
                        </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <AssetSliderRow
                      key={key}
                      label={assetLabels[key]}
                      description={assets.find((asset) => asset.key === key)?.benchmark ?? assetDescriptions[key]}
                      tooltipDescription={assetHoverDescriptions[key]}
                      color={assetColors[key].accent}
                      value={allocation[key]}
                      locked={lockedAssets[key]}
                      onToggleLock={() => toggleAssetLock(key)}
                      onChange={(value) => updateAsset(key, value)}
                      max={key === 'cash' ? 100 : allocationCaps[key]}
                      limit={key === 'cash' ? allocationCaps[key] : undefined}
                      limitMarkerPercent={key === 'cash' ? allocationCaps[key] : undefined}
                      dimAfterPercent={key === 'cash' ? allocationCaps[key] : undefined}
                      compact={key === 'cash'}
                    />
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <TooltipLabel
                label="How much of your risk comes from each instrument?"
                description={metricDescriptions.instrumentRisk}
                className="text-lg font-semibold text-foreground"
              />
              <p className="text-sm text-subtitle">Percent of risk from each instrument.</p>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 grid grid-cols-[100px_1fr] items-center gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>Instrument</span>
                  <div className="grid grid-cols-5 text-center">
                    <span>0%</span>
                    <span>20%</span>
                    <span>40%</span>
                    <span>60%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="grid gap-4">
                  {riskContribution.map((item) => (
                    <div key={item.key} className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <TooltipLabel
                        label={item.label}
                        description={assetHoverDescriptions[item.key]}
                        className="text-sm font-semibold text-foreground"
                      />
                      <div className="relative h-10 rounded-xl border border-slate-200 bg-white">
                        <div className="absolute inset-x-0 top-0 grid h-full grid-cols-5">
                          {[0, 1, 2, 3, 4].map((index) => (
                            <div key={index} className="border-r border-slate-100 last:border-r-0" />
                          ))}
                        </div>
                        <div
                          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow"
                          style={{
                            left: `calc(${Math.min(100, item.percent)}% - 7px)`,
                            backgroundColor: assetColors[item.key].accent,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid content-start self-start gap-3">
            <div className="grid items-start gap-3 md:grid-cols-3">
              {statCard(
                'Expected return',
                formatPercent(calculation.expectedReturn),
                `${calculation.returnDelta >= 0 ? '+' : ''}${formatPercent(calculation.returnDelta)} vs target`,
                'green',
                <TrendingUp className="h-4 w-4" />,
                metricDescriptions.expectedReturn,
              )}
              <RiskGaugeCard volatility={calculation.volatility} riskTier={calculation.riskTier} />
              {statCard(
                'Estimated annual gain',
                formatCurrency(calculation.oneYearGain),
                `${formatCurrency(calculation.oneYearRangeLow)} to ${formatCurrency(calculation.oneYearRangeHigh)}`,
                'orange',
                <DollarSign className="h-4 w-4" />,
                metricDescriptions.annualGain,
              )}
            </div>

            <Card className="border-slate-200 p-2.5 text-sm text-subtitle shadow-sm">
              Calculated from current mix: {Object.keys(allocation)
                .map((key) => `${assetLabels[key as AssetKey]} ${allocation[key as AssetKey]}%`)
                .join(' / ')}
            </Card>

            <Card className="border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">Direction To Target</p>
                  <p className="text-sm text-subtitle">Updates as allocation changes.</p>
                </div>
                <div className="rounded-xl bg-cyan-50 p-2 text-cyan-700">
                  <Gauge className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <MiniStat label="Target gap" value={`${Math.abs(calculation.returnDelta * 100).toFixed(1)}% ${calculation.returnDelta >= 0 ? 'above' : 'below'} target`} />
                <MiniStat label="Base rating" value={selectedArchetypeName || matchedArchetype.name} />
                <MiniStat label="Return driver" value={assetLabels[strongestReturnAsset]} />
                <MiniStat label="Risk driver" value={assetLabels[strongestRiskAsset]} />
              </div>

              <ul className="mt-4 list-disc pl-5 text-sm text-foreground">
                {calculation.guidance.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                <InsightCard
                  title="What to try next"
                  body={`Move ${assetLabels[strongestReturnAsset]} up when you need more expected return. Move Cash, Treasuries, and Corporate Bonds up when you want to reduce volatility.`}
                  tone="teal"
                />
                <InsightCard
                  title="Why it moved"
                  body={`${assetLabels[strongestReturnAsset]} currently does the most work for return, while ${assetLabels[strongestRiskAsset]} contributes the most to risk in this model.`}
                  tone="slate"
                />
                <InsightCard
                  title="Risk direction"
                  body={`${allocation.cash + allocation.treasuries}% in cash and treasuries keeps risk in check, while ${allocation.stocks}% in Stocks/ETF pushes growth higher.`}
                  tone="slate"
                />
                <InsightCard
                  title="Target check"
                  body="Use the target gap to see how close this mix is to the expected return goal before comparing tradeoffs."
                  tone="slate"
                />
              </div>
            </Card>

          </div>
        </div>
      </Card>

      {calculation.allocationTotal !== 100 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Allocation not balanced</AlertTitle>
          <AlertDescription>
            The allocation totals {calculation.allocationTotal}%. Bring it back to 100% before treating this as the final plan.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-foreground" />
          <p className="text-sm text-foreground">
            Educational planning aid only. This planner is not a registered investment adviser or broker, does not place trades, and does not recommend buying a specific security before acting.
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" onClick={handleGenerateProposal} disabled={saving || generating}>
          {generating ? 'Generating...' : 'Generate Investment Proposal'}
        </Button>
      </div>
    </div>
    </TooltipProvider>
  )
}

function TooltipLabel({
  label,
  description,
  className,
  style,
}: {
  label: string
  description?: string
  className?: string
  style?: React.CSSProperties
}) {
  if (!description) return <p className={className} style={style}>{label}</p>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex cursor-help items-center gap-1.5 ${className ?? ''}`} style={style}>
          {label}
          <Info className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs leading-snug">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
    </div>
  )
}

function InsightCard({ title, body, tone }: { title: string; body: string; tone: 'teal' | 'slate' }) {
  const toneClass = 'border-slate-200 bg-white'
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-subtitle">{body}</p>
    </div>
  )
}

function AssetRowHeader({
  label,
  description,
  tooltipDescription,
  accent,
  value,
  valueLabel = '',
}: {
  label: string
  description?: string
  tooltipDescription?: string
  accent: string
  value: number
  valueLabel?: string
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
        <div>
          <TooltipLabel label={label} description={tooltipDescription} className="font-semibold text-foreground" />
          <p className="text-xs text-subtitle">{description}</p>
        </div>
      </div>
      <p className="text-base font-semibold text-foreground">
        {valueLabel ? `${valueLabel} ${value}%` : `${value}%`}
      </p>
    </div>
  )
}

function AssetSliderRow({
  label,
  description,
  tooltipDescription,
  color,
  value,
  locked,
  onToggleLock,
  onChange,
  suffix = '%',
  max = 100,
  limit,
  limitMarkerPercent,
  dimAfterPercent,
  compact = false,
  nested = false,
}: {
  label: string
  description?: string
  tooltipDescription?: string
  color: string
  value: number
  locked: boolean
  onToggleLock: () => void
  onChange: (value: number) => void
  suffix?: string
  max?: number
  limit?: number
  limitMarkerPercent?: number
  dimAfterPercent?: number
  compact?: boolean
  nested?: boolean
}) {
  const displayValue = Math.min(value, limit ?? max)
  const markerPercent = limitMarkerPercent === undefined ? null : Math.min(100, Math.max(0, limitMarkerPercent))
  const disabledStartPercent = dimAfterPercent === undefined ? null : Math.min(100, Math.max(0, dimAfterPercent))
  const thumbSizePx = 20
  const displayPercent = Math.min(100, Math.max(0, (displayValue / max) * 100))
  const displayOffsetPx = thumbSizePx / 2 - (displayPercent / 100) * thumbSizePx
  const markerOffsetPx = markerPercent === null ? 0 : thumbSizePx / 2 - (markerPercent / 100) * thumbSizePx

  function clampChange(nextValue: number) {
    onChange(Math.min(nextValue, limit ?? max))
  }

  if (compact) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid items-center gap-4 sm:grid-cols-[170px_1fr_80px]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            <div className="min-w-0">
              <TooltipLabel label={label} description={tooltipDescription} className="font-semibold leading-tight text-foreground" />
              {description && <p className="truncate text-xs text-subtitle">{description}</p>}
            </div>
          </div>
          <div className="relative min-w-[160px]">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-3 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200/50" />
            {markerPercent !== null && (
              <div
                className="pointer-events-none absolute left-0 top-1/2 z-0 h-3 -translate-y-1/2 overflow-hidden rounded-l-full bg-slate-200"
                style={{ width: `calc(${markerPercent}% + ${markerOffsetPx}px)` }}
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-3 -translate-y-1/2 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full"
                style={{
                  width: `calc(${displayPercent}% + ${displayOffsetPx}px)`,
                  backgroundColor: color,
                }}
              />
            </div>
            {markerPercent !== null && (
              <span
                className="pointer-events-none absolute top-1/2 z-10 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
                style={{ left: `calc(${markerPercent}% + ${markerOffsetPx}px)` }}
              />
            )}
            <Slider
              value={[displayValue]}
              max={max}
              step={1}
              onValueChange={(nextValue) => clampChange(nextValue[0])}
              className="relative z-20"
              trackClassName="h-3 bg-transparent"
              rangeClassName="bg-transparent"
              thumbClassName="relative z-30 border-[var(--planner-slider-color)] bg-white"
              style={
                {
                  '--planner-slider-color': color,
                } as React.CSSProperties
              }
            />
          </div>
          <div className="relative">
            <Input
              className="h-10 pr-7 text-sm"
              type="number"
              value={displayValue}
              onChange={(event) => clampChange(Number(event.target.value || 0))}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-subtitle">{suffix}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={nested ? 'rounded-xl bg-white py-2' : 'rounded-2xl border border-slate-200 bg-white p-4'}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
          <div>
            <TooltipLabel label={label} description={tooltipDescription} className="font-semibold leading-tight text-foreground" />
            {description && <p className="text-xs text-subtitle">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="icon" variant="outline" onClick={onToggleLock}>
            {locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
          <div className="relative w-20">
            <Input type="number" value={displayValue} onChange={(event) => clampChange(Number(event.target.value || 0))} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-subtitle">{suffix}</span>
          </div>
        </div>
      </div>
      <div className="relative mt-4">
        <Slider
          value={[displayValue]}
          max={max}
          step={1}
          onValueChange={(nextValue) => clampChange(nextValue[0])}
          className="relative"
          trackClassName="bg-slate-200"
          rangeClassName="bg-[var(--planner-slider-color)]"
          thumbClassName="relative z-30 border-[var(--planner-slider-color)] bg-white"
          style={
            {
              '--planner-slider-color': color,
            } as React.CSSProperties
          }
        />
        {disabledStartPercent !== null && disabledStartPercent < 100 && (
          <div
            className="pointer-events-none absolute right-0 top-1/2 z-10 h-2 -translate-y-1/2 rounded-r-full bg-white/50"
            style={{ left: `${disabledStartPercent}%` }}
          />
        )}
        {markerPercent !== null && (
          <span
            className="pointer-events-none absolute top-1/2 z-20 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
            style={{ left: `${markerPercent}%` }}
          />
        )}
      </div>
    </div>
  )
}

function RiskGaugeCard({ volatility, riskTier }: { volatility: number; riskTier: RiskTolerance }) {
  const riskValue = Math.min(19, Math.max(0, volatility * 100))

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <TooltipLabel label="Portfolio risk" description={metricDescriptions.portfolioRisk} className="text-sm font-medium text-foreground" />
          <p className="mt-1 text-sm text-subtitle capitalize">{riskLabels[riskTier]}</p>
        </div>
        <div className="rounded-xl bg-white/80 p-2 text-foreground shadow-sm">
          <Gauge className="h-4 w-4" />
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mx-auto mt-3 h-36 w-full max-w-[240px] cursor-help">
            <GaugeComponent
              type="semicircle"
              value={riskValue}
              minValue={0}
              maxValue={19}
              marginInPercent={{ top: 0.02, bottom: 0, left: 0.03, right: 0.03 }}
              arc={{
                width: 0.24,
                padding: 0.01,
                cornerRadius: 2,
                subArcs: [
                  { limit: 3.8, color: '#2f9e44' },
                  { limit: 7.6, color: '#82c91e' },
                  { limit: 11.4, color: '#fcc419' },
                  { limit: 15.2, color: '#f76707' },
                  { limit: 19, color: '#e03131' },
                ],
              }}
              pointer={{
                type: 'needle',
                color: '#111827',
                baseColor: '#111827',
                length: 0.74,
                width: 14,
                animate: true,
                animationDuration: 500,
              }}
              labels={{
                valueLabel: {
                  hide: true,
                },
                tickLabels: {
                  hideMinMax: true,
                  ticks: [
                    { value: 0, valueConfig: { formatTextValue: () => 'Low' }, lineConfig: { hide: true } },
                    { value: 9.5, valueConfig: { formatTextValue: () => 'Med' }, lineConfig: { hide: true } },
                    { value: 19, valueConfig: { formatTextValue: () => 'High' }, lineConfig: { hide: true } },
                  ],
                  defaultTickValueConfig: {
                    style: { fill: '#64748b', fontSize: '11px', fontWeight: 600, textShadow: 'none' },
                  },
                },
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Portfolio risk: {formatPercent(volatility)}</p>
        </TooltipContent>
      </Tooltip>
    </Card>
  )
}

export default PortfolioPlanner
