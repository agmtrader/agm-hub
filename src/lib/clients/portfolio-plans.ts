import { Base } from './base'

export type AssetKey = 'cash' | 'treasuries' | 'bonds' | 'stocks'
export type BondRatingKey = 'aaa' | 'bbb' | 'bb'
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive'
export type PlannerDataSource = 'live' | 'fallback'

export type PortfolioAllocation = Record<AssetKey, number>
export type BondRatingAllocation = Record<BondRatingKey, number>
export type AssetLocks = Record<AssetKey, boolean>
export type BondRatingLocks = Record<BondRatingKey, boolean>

export type PlannerAssetProfile = {
  key: AssetKey
  label: string
  benchmark: string
  color: string
  expectedReturn: number
  volatility: number
  source: PlannerDataSource
  updatedAt?: string
  note: string
}

export type PortfolioPlanPayload = {
  risk_profile_id: string
  account_id?: string | null
  name?: string | null
  target_return: number
  starting_amount: number
  risk_tolerance: RiskTolerance
  selected_risk_archetype?: string | null
  allocation: PortfolioAllocation
  bond_rating_allocation: BondRatingAllocation
  locked_assets?: AssetLocks | null
  locked_bond_ratings?: BondRatingLocks | null
  expected_return?: number | null
  volatility?: number | null
  one_year_gain?: number | null
  one_year_range_low?: number | null
  one_year_range_high?: number | null
  risk_tier?: RiskTolerance | null
  guidance?: string[] | null
  data_source?: PlannerDataSource | null
  assumptions?: PlannerAssetProfile[] | null
}

export type PortfolioPlan = PortfolioPlanPayload & Base
