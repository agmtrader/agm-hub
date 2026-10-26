import { Base } from "./base"

export interface Bond {
    symbol: string
    percentage?: number
    current_yield: number
    equivalent: string
}

export const investmentProposalGroups = [
    { key: 'treasuries', assetKey: 'treasury', distributionKey: 'treasuries', label: 'Treasuries', color: '#1E3A8A' },
    { key: 'investment_grade', assetKey: 'investment_grade', distributionKey: 'investment_grade', label: 'Investment grade (AAA–BBB)', color: '#2571A5' },
    { key: 'bb', assetKey: 'bb', distributionKey: 'bonds_bb', label: 'High yield (BB)', color: '#E8590C' },
    { key: 'etfs', assetKey: 'etfs', distributionKey: 'etfs', label: 'Equity (ETFs)', color: '#C92A2A' },
    { key: 'gold', assetKey: 'gold', distributionKey: 'gold', label: 'Gold (GLD)', color: '#B8860B' },
] as const

export const investmentProposalDistributionKeys = [
    'treasuries', 'investment_grade', 'bonds_bb', 'etfs', 'gold', 'cash', 'stocks',
] as const

export type InvestmentProposalDistributionKey = (typeof investmentProposalDistributionKeys)[number]

export type InvestmentProposalDistribution = Record<InvestmentProposalDistributionKey, number>

export type InvestmentProposalPreviewBucketSummary = {
    key: InvestmentProposalDistributionKey
    weight: number
    asset_count: number
    average_yield: number
}

export interface InvestmentProposalAssets {
    treasury: Bond[]
    aaa_a: Bond[]
    bbb: Bond[]
    bb: Bond[]
    etfs: Bond[]
    investment_grade?: Bond[]
    gold?: Bond[]
}

export type InvestmentProposalSourceType = 'risk_profile' | 'portfolio_plan' | 'custom'

export interface InvestmentProposalPayload {
  risk_profile_id?: string | null
  contact_id?: string | null
    source_type: InvestmentProposalSourceType
    assets: InvestmentProposalAssets
    derived_distribution?: InvestmentProposalDistribution | null
}

export interface InvestmentProposalAssetInput {
    symbol: string
    percentage: number
    source_bucket: 'treasuries' | 'investment_grade' | 'high_yield' | 'equity' | 'gold'
}

export interface InvestmentProposalPreview extends InvestmentProposalPayload {
    total_assets: number
    bucket_summaries: InvestmentProposalPreviewBucketSummary[]
    expected_average_yield: number
    expected_return_decimal: number
}

export type InvestmentProposal = InvestmentProposalPayload & Base
