import type { AssetKey, PlannerAssetProfile, PortfolioAllocation, RiskTolerance } from './portfolio-plans'
import { proposalAllocationKeys } from './portfolio-plans'
import type { RiskArchetype } from './risk-profile'
import { ReadBondsReport, ReadEtfsReport, ReadUSTBondsReport } from '@/utils/tools/reporting'

export const allocationCaps: Record<AssetKey, number> = {
  treasuries: 100, investment_grade: 100, high_yield: 100, equity: 100, gold: 100,
}
export const proposalAllocationLabels: Record<AssetKey, string> = {
  treasuries: 'Treasuries', investment_grade: 'Investment grade (AAA–BBB)',
  high_yield: 'High yield (BB)', equity: 'Equity (ETFs)', gold: 'Gold (GLD)',
}
export const proposalAllocationColors: Record<AssetKey, string> = {
  treasuries: '#1E3A8A', investment_grade: '#2571A5', high_yield: '#E8590C', equity: '#C92A2A', gold: '#B8860B',
}

// Same classified equity universe as the proposal API. Bond/commodity ETFs are excluded.
const equityEtfSymbols = new Set([
  'EEM', 'DIA', 'XLP', 'VEA', 'VT', 'XLY', 'XLE', 'ARKK', 'QQQ', 'XLRE',
  'IEMG', 'IYR', 'EWJ', 'VOO', 'IBB', 'XLB', 'VTI', 'XLV', 'QQQM', 'RSP',
  'VNQ', 'IWM', 'VXUS', 'IVV', 'XLK', 'SOXX', 'XLU', 'EFA', 'SPY', 'VWO',
  'IEFA', 'XLF', 'XLI', 'ACWI', 'SMH', 'SCHB',
])
const moodysToSp: Record<string, string> = {
  AAA: 'AAA', AA1: 'AA+', AA2: 'AA', AA3: 'AA-', A1: 'A+', A2: 'A', A3: 'A-',
  BAA1: 'BBB+', BAA2: 'BBB', BAA3: 'BBB-', BA1: 'BB+', BA2: 'BB', BA3: 'BB-',
  B1: 'B+', B2: 'B', B3: 'B-', CAA1: 'CCC+', CAA2: 'CCC', CAA3: 'CCC-', CA: 'CC', C: 'C',
}
const ratings = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B', 'B-', 'CCC+', 'CCC', 'CCC-', 'CC', 'C', 'SD', 'D']

export function proposalAssetSymbol(row: Record<string, unknown>): string {
  for (const key of ['symbol', 'Symbol', 'Ticker', 'ticker', 'sheet_name', 'Financial Instrument']) {
    const value = String(row[key] ?? '').trim()
    if (value) return value
  }
  return ''
}
export function proposalEtfCategory(row: Record<string, unknown>): 'equity' | 'gold' | null {
  const symbol = String(row['Financial Instrument'] || proposalAssetSymbol(row)).trim().toUpperCase()
  return symbol === 'GLD' ? 'gold' : equityEtfSymbols.has(symbol) ? 'equity' : null
}
export function proposalBondCategory(row: Record<string, unknown>): 'investment_grade' | 'high_yield' | null {
  const token = (value: unknown) => String(value ?? '').trim().toUpperCase().replace(/\s+/g, '').replace(/[−–]/g, '-')
  const canonical = [row['S&P Equivalent_x'], row['S&P Equivalent']].map(token).find(value => ratings.includes(value))
  const structured = [token(row.SP), moodysToSp[token(row.Moodys ?? row["Moody's"])]].filter(value => ratings.includes(value))
  const tokens = [...new Set([...ratings, ...Object.keys(moodysToSp)])].sort((a, b) => b.length - a.length)
  const expression = new RegExp(`(?<![A-Z0-9+\\-])(${tokens.map(value => value.replace(/[+]/g, '\\+')).join('|')})(?![A-Z0-9+\\-])`, 'g')
  const text = String(row.Ratings ?? '').toUpperCase().replace(/[−–]/g, '-').replace(/\bN\s*\/\s*A\b/g, '')
  const freeText = (text.match(expression) ?? []).map(value => moodysToSp[value] || value)
  const resolved = canonical || (structured.length ? structured : freeText).sort((a, b) => ratings.indexOf(b) - ratings.indexOf(a))[0]
  const base = resolved?.replace(/[+-]/g, '') ?? ''
  return base === 'BB' ? 'high_yield' : ['AAA', 'AA', 'A', 'BBB'].includes(base) ? 'investment_grade' : null
}

export function getAllocationFromRiskArchetype(archetype: RiskArchetype): PortfolioAllocation {
  return Object.fromEntries(proposalAllocationKeys.map(key => [key, Math.round(Number(archetype[key]) * 100)])) as PortfolioAllocation
}
export function getRiskToleranceFromScore(score: number): RiskTolerance {
  return score < 1.25 ? 'conservative' : score < 2.5 ? 'moderate' : 'aggressive'
}
export function getFallbackPlannerAssets(): PlannerAssetProfile[] {
  const assumptions: Record<AssetKey, [number, number]> = {
    treasuries: [0.042, 0.035], investment_grade: [0.06, 0.06], high_yield: [0.087, 0.11], equity: [0.085, 0.19], gold: [0, 0.19],
  }
  return proposalAllocationKeys.map(key => ({
    key, label: proposalAllocationLabels[key], benchmark: key === 'gold' ? 'GLD' : proposalAllocationLabels[key],
    color: proposalAllocationColors[key], expectedReturn: assumptions[key][0], volatility: assumptions[key][1],
    source: 'fallback', note: 'Planning assumption until the corresponding market feed loads; API preview determines proposal return.',
  }))
}
export function normalizeAllocation(allocation: PortfolioAllocation, changedKey: AssetKey, value: number, lockedKeys: AssetKey[] = []): PortfolioAllocation {
  const next = { ...allocation, [changedKey]: Math.max(0, Math.min(100, Math.round(value))) }
  let difference = 100 - proposalAllocationKeys.reduce((sum, key) => sum + next[key], 0)
  for (const key of proposalAllocationKeys.filter(key => key !== changedKey && !lockedKeys.includes(key))) {
    const delta = Math.max(-next[key], Math.min(100 - next[key], difference))
    next[key] += delta
    difference -= delta
  }
  next[changedKey] += difference
  return next
}

export type PortfolioCalculationResult = {
  expectedReturn: number; volatility: number; allocationTotal: number; returnDelta: number
  oneYearGain: number; oneYearRangeLow: number; oneYearRangeHigh: number; riskTier: RiskTolerance; guidance: string[]
}
export function calculatePortfolio(allocation: PortfolioAllocation, assets: PlannerAssetProfile[], targetReturn: number, startingAmount: number, tolerance: RiskTolerance): PortfolioCalculationResult {
  const byKey = Object.fromEntries(assets.map(asset => [asset.key, asset])) as Record<AssetKey, PlannerAssetProfile>
  const allocationTotal = proposalAllocationKeys.reduce((sum, key) => sum + allocation[key], 0)
  const expectedReturn = proposalAllocationKeys.reduce((sum, key) => sum + allocation[key] / 100 * byKey[key].expectedReturn, 0)
  let variance = 0
  for (const left of proposalAllocationKeys) for (const right of proposalAllocationKeys) {
    // GLD correlation is an explicit zero planning assumption; credit sleeves share bond risk.
    const correlation = left === right ? 1 : left === 'gold' || right === 'gold' ? 0
      : left === 'equity' || right === 'equity' ? (left === 'treasuries' || right === 'treasuries' ? 0.12 : 0.2)
      : left === 'treasuries' || right === 'treasuries' ? 0.72 : 1
    variance += allocation[left] / 100 * allocation[right] / 100 * byKey[left].volatility * byKey[right].volatility * correlation
  }
  const volatility = Math.sqrt(Math.max(variance, 0))
  const riskTier = volatility <= 0.08 ? 'conservative' : volatility <= 0.16 ? 'moderate' : 'aggressive'
  const returnDelta = expectedReturn - targetReturn / 100
  const guidance = [returnDelta < -0.015 ? 'The mix is below the target return. Review the allocation and target together.'
    : returnDelta > 0.015 ? 'The mix exceeds the target return. Review whether a more defensive allocation meets your goal.' : 'This mix is close to the target return. Compare the expected return with its modeled risk.']
  if (volatility > { conservative: 0.08, moderate: 0.16, aggressive: 0.28 }[tolerance]) guidance.push('Modeled risk exceeds the selected tolerance. Consider more Treasuries or investment-grade bonds.')
  return { expectedReturn, volatility, allocationTotal, returnDelta, oneYearGain: startingAmount * expectedReturn,
    oneYearRangeLow: startingAmount * (expectedReturn - volatility), oneYearRangeHigh: startingAmount * (expectedReturn + volatility), riskTier, guidance }
}
export function formatPercent(value: number): string { return `${(value * 100).toFixed(1)}%` }
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}
export function readPlannerMarketData() { return [ReadBondsReport(), ReadUSTBondsReport(), ReadEtfsReport()] as const }
function numberField(row: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const raw = row[key]
    if (raw == null || String(raw).trim() === '') continue
    const value = Number(String(raw).replace(/[% ,]/g, ''))
    if (Number.isFinite(value)) return value
  }
  return null
}
function median(values: number[]): number | null {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
export async function loadPlannerAssetProfiles(market = readPlannerMarketData()): Promise<PlannerAssetProfile[]> {
  const profiles = getFallbackPlannerAssets()
  const settled = await Promise.allSettled(market)
  const rows = settled.map(result => result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : [])
  for (const profile of profiles) {
    const candidates: Record<string, unknown>[] = profile.key === 'treasuries' ? rows[1]
      : profile.key === 'investment_grade' || profile.key === 'high_yield' ? rows[0].filter(row => proposalBondCategory(row) === profile.key)
      : rows[2].filter(row => proposalEtfCategory(row) === profile.key)
    const isEtf = profile.key === 'equity' || profile.key === 'gold'
    const values = candidates.map(row => numberField(row, isEtf ? ['Current Yield'] : ['Current Yield', 'YTM', 'CY', 'Ask Yield', 'Bid Yield']))
      .filter((value): value is number => value !== null && (isEtf || value > 0))
      .map(value => isEtf || Math.abs(value) > 1 ? value / 100 : value)
    const expectedReturn = median(values)
    if (expectedReturn !== null) Object.assign(profile, { expectedReturn, source: 'live', benchmark: profile.key === 'gold' ? 'GLD' : `AGM ${profile.label} feed`,
      note: 'Return from the corresponding eligible market universe. Volatility and correlations are planning assumptions.' })
  }
  return profiles
}
