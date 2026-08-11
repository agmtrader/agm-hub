import { Base } from "./base"

export interface Bond {
    symbol: string
    current_yield: number
    equivalent: string
}

export const investmentProposalDistributionKeys = [
    'treasuries',
    'bonds_aaa_a',
    'bonds_bbb',
    'bonds_bb',
    'etfs',
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
    source_bucket?: 'BONDS' | 'UST' | 'STOCKS' | 'ETFS'
}

export interface InvestmentProposalPreview extends InvestmentProposalPayload {
    total_assets: number
    bucket_summaries: InvestmentProposalPreviewBucketSummary[]
    expected_average_yield: number
    expected_return_decimal: number
}

export type InvestmentProposal = InvestmentProposalPayload & Base
