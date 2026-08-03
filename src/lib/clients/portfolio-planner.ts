import type {
  AssetKey,
  BondBucketProfiles,
  BondRatingAllocation,
  BondRatingKey,
  PlannerAssetProfile,
  PortfolioAllocation,
  RiskTolerance,
} from './portfolio-plans'
import type { RiskArchetype } from './risk-profile'
import { ReadBondsReport, ReadEtfsReport, ReadStocksReport, ReadUSTBondsReport } from '@/utils/tools/reporting'

const assetKeys: AssetKey[] = ['cash', 'treasuries', 'bonds', 'stocks']
const bondRatingKeys: BondRatingKey[] = ['aaa', 'bbb', 'bb']

export const allocationCaps: Record<AssetKey, number> = {
  cash: 10,
  treasuries: 100,
  bonds: 100,
  stocks: 100,
}

const riskCaps: Record<RiskTolerance, number> = {
  conservative: 0.08,
  moderate: 0.16,
  aggressive: 0.28,
}

const correlation: Record<AssetKey, Record<AssetKey, number>> = {
  cash: { cash: 1, treasuries: 0.08, bonds: 0.1, stocks: 0.05 },
  treasuries: { cash: 0.08, treasuries: 1, bonds: 0.72, stocks: 0.12 },
  bonds: { cash: 0.1, treasuries: 0.72, bonds: 1, stocks: 0.2 },
  stocks: { cash: 0.05, treasuries: 0.12, bonds: 0.2, stocks: 1 },
}

export type PortfolioCalculationResult = {
  expectedReturn: number
  volatility: number
  allocationTotal: number
  returnDelta: number
  oneYearGain: number
  oneYearRangeLow: number
  oneYearRangeHigh: number
  riskTier: RiskTolerance
  guidance: string[]
}

const fallbackAssets: PlannerAssetProfile[] = [
  {
    key: 'cash',
    label: 'Cash',
    benchmark: 'AGM short-rate proxy',
    color: '#227C9D',
    expectedReturn: 0.035,
    volatility: 0.01,
    source: 'fallback',
    note: 'Cash-like assumption used when live market data is unavailable.',
  },
  {
    key: 'treasuries',
    label: 'Treasuries',
    benchmark: 'AGM U.S. Treasury proxy',
    color: '#3A86FF',
    expectedReturn: 0.042,
    volatility: 0.035,
    source: 'fallback',
    note: 'Treasury assumption used when live treasury data is unavailable.',
  },
  {
    key: 'bonds',
    label: 'Corporate Bonds',
    benchmark: 'AGM corporate bond proxy',
    color: '#FB5607',
    expectedReturn: 0.045,
    volatility: 0.06,
    source: 'fallback',
    note: 'Corporate bond assumption used when live bond data is unavailable.',
  },
  {
    key: 'stocks',
    label: 'Stocks/ETF',
    benchmark: 'AGM stock and ETF proxy',
    color: '#D00000',
    expectedReturn: 0.085,
    volatility: 0.19,
    source: 'fallback',
    note: 'Broad stock and ETF assumption, not a recommendation to buy a specific security.',
  },
]

const fallbackBondBucketProfiles: BondBucketProfiles = {
  aaa: {
    expectedReturn: 0.053,
    volatility: 0.04,
    benchmark: 'AGM A-AAA proxy',
    note: 'Fallback estimate for higher-quality corporate bonds.',
    source: 'fallback',
  },
  bbb: {
    expectedReturn: 0.074,
    volatility: 0.07,
    benchmark: 'AGM BBB proxy',
    note: 'Fallback estimate for medium-quality corporate bonds.',
    source: 'fallback',
  },
  bb: {
    expectedReturn: 0.087,
    volatility: 0.11,
    benchmark: 'AGM BB proxy',
    note: 'Fallback estimate for higher-yield corporate bonds.',
    source: 'fallback',
  },
}

export function getFallbackPlannerAssets(): PlannerAssetProfile[] {
  return fallbackAssets.map((asset) => ({ ...asset }))
}

export function getFallbackBondBucketProfiles(): BondBucketProfiles {
  return {
    aaa: { ...fallbackBondBucketProfiles.aaa },
    bbb: { ...fallbackBondBucketProfiles.bbb },
    bb: { ...fallbackBondBucketProfiles.bb },
  }
}

export function getRiskToleranceFromScore(score: number): RiskTolerance {
  if (score < 1.25) return 'conservative'
  if (score < 2.5) return 'moderate'
  return 'aggressive'
}

export function getAllocationFromRiskArchetype(archetype: RiskArchetype): PortfolioAllocation {
  const bonds = Math.round((Number(archetype.bonds_aaa_a) + Number(archetype.bonds_bbb) + Number(archetype.bonds_bb)) * 100)
  const stocks = Math.round(Number(archetype.etfs) * 100)
  const treasuries = Math.round(Number(archetype.treasuries) * 100)
  return {
    cash: 0,
    treasuries,
    bonds,
    stocks,
  }
}

export function getBondRatingAllocationFromRiskArchetype(archetype: RiskArchetype): BondRatingAllocation {
  const totalBondShare = Number(archetype.bonds_aaa_a) + Number(archetype.bonds_bbb) + Number(archetype.bonds_bb)
  if (totalBondShare <= 0) {
    return { aaa: 0, bbb: 50, bb: 50 }
  }

  const aaa = Math.round((Number(archetype.bonds_aaa_a) / totalBondShare) * 100)
  const bbb = Math.round((Number(archetype.bonds_bbb) / totalBondShare) * 100)
  const bb = Math.max(0, 100 - aaa - bbb)
  return { aaa, bbb, bb }
}

export function calculatePortfolio(
  allocation: PortfolioAllocation,
  assets: PlannerAssetProfile[],
  targetReturn: number,
  startingAmount: number,
  riskTolerance: RiskTolerance,
): PortfolioCalculationResult {
  const byKey = Object.fromEntries(assets.map((asset) => [asset.key, asset])) as Record<AssetKey, PlannerAssetProfile>
  const allocationTotal = assetKeys.reduce((sum, key) => sum + Number(allocation[key] || 0), 0)
  const weights = assetKeys.map((key) => Number(allocation[key] || 0) / 100)

  const expectedReturn = assetKeys.reduce((sum, key, index) => sum + weights[index] * byKey[key].expectedReturn, 0)

  let variance = 0
  for (const rowKey of assetKeys) {
    for (const columnKey of assetKeys) {
      variance +=
        (Number(allocation[rowKey] || 0) / 100) *
        (Number(allocation[columnKey] || 0) / 100) *
        byKey[rowKey].volatility *
        byKey[columnKey].volatility *
        correlation[rowKey][columnKey]
    }
  }

  const volatility = Math.sqrt(Math.max(variance, 0))
  const returnDelta = expectedReturn - targetReturn / 100

  return {
    expectedReturn,
    volatility,
    allocationTotal,
    returnDelta,
    oneYearGain: startingAmount * expectedReturn,
    oneYearRangeLow: startingAmount * (expectedReturn - volatility),
    oneYearRangeHigh: startingAmount * (expectedReturn + volatility),
    riskTier: getRiskTier(volatility),
    guidance: buildGuidance(expectedReturn, targetReturn / 100, volatility, riskTolerance, allocationTotal),
  }
}

export function buildPlannerAssetsForAllocation(
  assets: PlannerAssetProfile[],
  bondRatingAllocation: BondRatingAllocation,
  bondBucketProfiles: BondBucketProfiles,
): PlannerAssetProfile[] {
  const nextAssets = assets.map((asset) => ({ ...asset }))
  const bondAsset = nextAssets.find((asset) => asset.key === 'bonds')
  if (!bondAsset) return nextAssets

  const weights = {
    aaa: Number(bondRatingAllocation.aaa || 0) / 100,
    bbb: Number(bondRatingAllocation.bbb || 0) / 100,
    bb: Number(bondRatingAllocation.bb || 0) / 100,
  }

  bondAsset.expectedReturn =
    bondBucketProfiles.aaa.expectedReturn * weights.aaa +
    bondBucketProfiles.bbb.expectedReturn * weights.bbb +
    bondBucketProfiles.bb.expectedReturn * weights.bb

  bondAsset.volatility =
    bondBucketProfiles.aaa.volatility * weights.aaa +
    bondBucketProfiles.bbb.volatility * weights.bbb +
    bondBucketProfiles.bb.volatility * weights.bb

  bondAsset.benchmark = `AGM blended bond sleeve (${bondRatingAllocation.aaa}% A-AAA / ${bondRatingAllocation.bbb}% BBB / ${bondRatingAllocation.bb}% BB)`
  bondAsset.note = 'Derived from the live AGM bond universe using the current bond rating sliders.'
  bondAsset.source =
    bondBucketProfiles.aaa.source === 'live' || bondBucketProfiles.bbb.source === 'live' || bondBucketProfiles.bb.source === 'live'
      ? 'live'
      : 'fallback'

  return nextAssets
}

export function normalizeAllocation(
  allocation: PortfolioAllocation,
  changedKey: AssetKey,
  nextValue: number,
  lockedKeys: AssetKey[] = [],
): PortfolioAllocation {
  const clamped = Math.max(0, Math.min(allocationCaps[changedKey], Math.round(nextValue)))
  const nextAllocation = { ...allocation, [changedKey]: clamped }
  const total = assetKeys.reduce((sum, key) => sum + nextAllocation[key], 0)
  let remainingAdjustment = total - 100
  const locked = new Set(lockedKeys.filter((key) => key !== changedKey))
  const adjustableKeys = assetKeys.filter((key) => key !== changedKey && !locked.has(key))

  if (remainingAdjustment === 0) return nextAllocation

  if (remainingAdjustment > 0) {
    for (const key of adjustableKeys) {
      const reduction = Math.min(nextAllocation[key], remainingAdjustment)
      nextAllocation[key] -= reduction
      remainingAdjustment -= reduction
      if (remainingAdjustment === 0) break
    }
    if (remainingAdjustment > 0) {
      nextAllocation[changedKey] = Math.max(0, nextAllocation[changedKey] - remainingAdjustment)
    }
  } else {
    remainingAdjustment = Math.abs(remainingAdjustment)
    for (const key of adjustableKeys) {
      const increase = Math.min(allocationCaps[key] - nextAllocation[key], remainingAdjustment)
      nextAllocation[key] += increase
      remainingAdjustment -= increase
      if (remainingAdjustment === 0) break
    }
  }

  return nextAllocation
}

export function normalizeBondRatingAllocation(
  allocation: BondRatingAllocation,
  changedKey: BondRatingKey,
  nextValue: number,
  lockedKeys: BondRatingKey[] = [],
): BondRatingAllocation {
  const clamped = Math.max(0, Math.min(100, Math.round(nextValue)))
  const nextAllocation = { ...allocation, [changedKey]: clamped }
  let total = bondRatingKeys.reduce((sum, key) => sum + nextAllocation[key], 0)
  const locked = new Set(lockedKeys.filter((key) => key !== changedKey))
  const adjustableKeys = bondRatingKeys.filter((key) => key !== changedKey && !locked.has(key))

  if (adjustableKeys.length === 0) return nextAllocation

  while (total > 100) {
    const target = adjustableKeys.find((key) => nextAllocation[key] > 0)
    if (!target) break
    nextAllocation[target] -= 1
    total -= 1
  }

  while (total < 100) {
    const target = adjustableKeys[0]
    if (!target) break
    nextAllocation[target] += 1
    total += 1
  }

  return nextAllocation
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export async function loadPlannerAssetProfiles(): Promise<PlannerAssetProfile[]> {
  const assets = getFallbackPlannerAssets()

  try {
    const [corporateBonds, treasuries, stocks, etfs] = await Promise.all([
      ReadBondsReport(),
      ReadUSTBondsReport(),
      ReadStocksReport(),
      ReadEtfsReport(),
    ])

    const treasuryYield = medianYield(Array.isArray(treasuries) ? treasuries : [])
    const corporateYield = medianYield(Array.isArray(corporateBonds) ? corporateBonds : [])
    const spyReturn = averageSpyYearOverYearReturn([...(Array.isArray(stocks) ? stocks : []), ...(Array.isArray(etfs) ? etfs : [])])
    const spyVolatility = estimateSpyVolatility([...(Array.isArray(stocks) ? stocks : []), ...(Array.isArray(etfs) ? etfs : [])])

    if (treasuryYield !== null) {
      applyAsset(assets, 'treasuries', {
        expectedReturn: clamp(treasuryYield, 0, 0.15),
        volatility: clamp(estimateBondVolatility(Array.isArray(treasuries) ? treasuries : []), 0.025, 0.09),
        benchmark: 'AGM U.S. Treasury feed',
        note: 'Derived from AGM treasury snapshots.',
      })
      applyAsset(assets, 'cash', {
        expectedReturn: clamp(treasuryYield * 0.85, 0.001, 0.12),
        volatility: 0.01,
        benchmark: 'AGM short treasury cash proxy',
        note: 'Cash estimate derived from the AGM treasury feed.',
      })
    }

    if (corporateYield !== null) {
      applyAsset(assets, 'bonds', {
        expectedReturn: clamp(corporateYield, 0, 0.18),
        volatility: clamp(estimateBondVolatility(Array.isArray(corporateBonds) ? corporateBonds : []), 0.035, 0.14),
        benchmark: 'AGM corporate bond feed',
        note: 'Derived from AGM corporate bond snapshots.',
      })
    }

    if (spyReturn !== null) {
      applyAsset(assets, 'stocks', {
        expectedReturn: clamp(spyReturn, 0, 0.3),
        volatility: clamp(spyVolatility ?? 0.19, 0.08, 0.45),
        benchmark: 'AGM SPY proposal-equity feed',
        note: 'Derived from the same SPY-style live proposal equity feed used by proposal generation.',
      })
    }

    return assets
  } catch {
    return assets
  }
}

export async function loadPlannerBondBucketProfiles(): Promise<BondBucketProfiles> {
  const bondBucketProfiles = getFallbackBondBucketProfiles()

  try {
    const corporateBonds = await ReadBondsReport()
    const corporateRows = Array.isArray(corporateBonds) ? corporateBonds : []

    applyBondBucketProfile(bondBucketProfiles, 'aaa', filterBondRowsByBucket(corporateRows, 'aaa'), {
      benchmark: 'AGM A-AAA bond feed',
      note: 'Derived from higher-quality corporate bonds in the AGM live universe.',
    })
    applyBondBucketProfile(bondBucketProfiles, 'bbb', filterBondRowsByBucket(corporateRows, 'bbb'), {
      benchmark: 'AGM BBB bond feed',
      note: 'Derived from BBB corporate bonds in the AGM live universe.',
    })
    applyBondBucketProfile(bondBucketProfiles, 'bb', filterBondRowsByBucket(corporateRows, 'bb'), {
      benchmark: 'AGM BB bond feed',
      note: 'Derived from BB corporate bonds in the AGM live universe.',
    })

    return bondBucketProfiles
  } catch {
    return bondBucketProfiles
  }
}

function getRiskTier(volatility: number): RiskTolerance {
  if (volatility <= 0.08) return 'conservative'
  if (volatility <= 0.16) return 'moderate'
  return 'aggressive'
}

function buildGuidance(
  expectedReturn: number,
  targetReturn: number,
  volatility: number,
  riskTolerance: RiskTolerance,
  allocationTotal: number,
): string[] {
  const messages: string[] = []
  const riskCap = riskCaps[riskTolerance]
  const returnGap = targetReturn - expectedReturn

  if (allocationTotal !== 100) {
    messages.push('Bring the allocation total to 100% before treating the result as a complete portfolio.')
  }

  if (returnGap > 0.015) {
    messages.push(
      volatility >= riskCap
        ? 'The target return is above this mix while risk is already near the selected tolerance. Lower the target or accept a higher risk profile.'
        : 'To move closer to the target return, shift weight from cash, treasuries, or corporate bonds toward stocks/ETFs.',
    )
  } else if (returnGap < -0.015) {
    messages.push('The mix is above the target return. You may be able to reduce risk by shifting some exposure toward cash, treasuries, or bonds.')
  } else {
    messages.push('This mix is close to the target return. The main tradeoff is whether the added risk feels worth the expected return.')
  }

  if (volatility > riskCap) {
    messages.push('Portfolio risk is above the selected tolerance. Move toward cash, treasuries, or higher-quality bonds to reduce volatility.')
  }

  return messages
}

function applyAsset(
  assets: PlannerAssetProfile[],
  key: AssetKey,
  updates: Pick<PlannerAssetProfile, 'expectedReturn' | 'volatility' | 'benchmark' | 'note'>,
) {
  const asset = assets.find((item) => item.key === key)
  if (!asset) return
  asset.expectedReturn = updates.expectedReturn
  asset.volatility = updates.volatility
  asset.benchmark = updates.benchmark
  asset.note = updates.note
  asset.source = 'live'
}

function applyBondBucketProfile(
  bucketProfiles: BondBucketProfiles,
  key: BondRatingKey,
  rows: Record<string, unknown>[],
  details: Pick<PlannerAssetProfile, 'benchmark' | 'note'>,
) {
  const expectedReturn = medianYield(rows)
  if (expectedReturn === null) return

  bucketProfiles[key] = {
    expectedReturn: clamp(expectedReturn, 0, 0.2),
    volatility: clamp(estimateBondVolatility(rows), 0.03, 0.16),
    benchmark: details.benchmark,
    note: details.note,
    source: 'live',
  }
}

function firstNumber(row: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = row[key]
    const parsed = Number(String(value ?? '').replace('%', '').trim())
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function normalizePercent(value: number): number {
  return value > 1 ? value / 100 : value
}

function normalizeRatingToken(value: unknown): string {
  return String(value ?? '').trim().toUpperCase().replace(/\s+/g, '')
}

function extractSpLikeRating(value: unknown): string {
  const text = String(value ?? '').toUpperCase()
  const candidates = [
    'AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-',
    'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-',
  ]
  return candidates.find((candidate) => text.includes(candidate)) ?? ''
}

function resolveBondBucket(row: Record<string, unknown>): BondRatingKey | null {
  const rating = normalizeRatingToken(
    row['S&P Equivalent'] ??
    row['SP'] ??
    extractSpLikeRating(row['Ratings']) ??
    '',
  )

  const normalized = rating.replace('+', '').replace('-', '')
  if (normalized === 'AAA' || normalized === 'AA' || normalized === 'A') return 'aaa'
  if (normalized === 'BBB') return 'bbb'
  if (normalized === 'BB') return 'bb'
  return null
}

function filterBondRowsByBucket(rows: Record<string, unknown>[], bucket: BondRatingKey): Record<string, unknown>[] {
  return rows.filter((row) => resolveBondBucket(row) === bucket)
}

function medianYield(rows: Record<string, unknown>[]): number | null {
  const yields = rows
    .map((row) => firstNumber(row, ['YTM', 'Current Yield', 'CY', 'Ask Yield', 'Bid Yield']))
    .filter((value): value is number => value !== null && value > 0)
    .map(normalizePercent)

  return median(yields)
}

function estimateBondVolatility(rows: Record<string, unknown>[]): number {
  const yields = rows
    .map((row) => firstNumber(row, ['YTM', 'Current Yield', 'CY', 'Ask Yield', 'Bid Yield']))
    .filter((value): value is number => value !== null)
    .map(normalizePercent)

  const durations = rows
    .map((row) => firstNumber(row, ['Duration', 'Years to Maturity']))
    .filter((value): value is number => value !== null && value > 0)

  const yieldDispersion = standardDeviation(yields) * 3
  const durationRisk = (median(durations) ?? 4) * 0.008
  return Math.max(yieldDispersion, durationRisk)
}

function averageSpyYearOverYearReturn(rows: Record<string, unknown>[]): number | null {
  const spyRows = rows
    .filter((row) => String(row.sheet_name ?? '').trim().toUpperCase() === 'SPY')
    .map((row) => ({
      date: new Date(String(row.Date ?? '')),
      close: Number(row.Close),
    }))
    .filter((row) => !Number.isNaN(row.date.getTime()) && Number.isFinite(row.close) && row.close > 0)
    .sort((left, right) => left.date.getTime() - right.date.getTime())

  if (spyRows.length < 2) return null

  const points = [
    0,
    365.25,
    365.25 * 2,
    365.25 * 3,
    365.25 * 4,
    365.25 * 5,
  ]

  const latest = spyRows[spyRows.length - 1].date
  const prices = points
    .map((days) => priceAsOf(spyRows, new Date(latest.getTime() - days * 24 * 60 * 60 * 1000)))
    .filter((value): value is number => value !== null)

  if (prices.length < 6) return null

  const yields = [
    prices[0] / prices[1] - 1,
    prices[1] / prices[2] - 1,
    prices[2] / prices[3] - 1,
    prices[3] / prices[4] - 1,
    prices[4] / prices[5] - 1,
  ]

  const average = yields.reduce((sum, value) => sum + value, 0) / yields.length
  return average
}

function estimateSpyVolatility(rows: Record<string, unknown>[]): number | null {
  const spyRows = rows
    .filter((row) => String(row.sheet_name ?? '').trim().toUpperCase() === 'SPY')
    .map((row) => ({
      date: new Date(String(row.Date ?? '')),
      close: Number(row.Close),
    }))
    .filter((row) => !Number.isNaN(row.date.getTime()) && Number.isFinite(row.close) && row.close > 0)
    .sort((left, right) => left.date.getTime() - right.date.getTime())

  if (spyRows.length < 2) return null

  const returns: number[] = []
  for (let index = 1; index < spyRows.length; index += 1) {
    const previous = spyRows[index - 1].close
    const current = spyRows[index].close
    if (previous > 0 && current > 0) {
      returns.push(current / previous - 1)
    }
  }

  if (returns.length < 2) return null
  return standardDeviation(returns) * Math.sqrt(252)
}

function priceAsOf(rows: Array<{ date: Date; close: number }>, targetDate: Date): number | null {
  let match: number | null = null
  for (const row of rows) {
    if (row.date.getTime() <= targetDate.getTime()) {
      match = row.close
      continue
    }
    break
  }
  return match
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }
  return sorted[middle]
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
