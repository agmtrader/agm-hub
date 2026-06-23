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

export interface InvestmentProposalAssets {
    treasury: Bond[]
    aaa_a: Bond[]
    bbb: Bond[]
    bb: Bond[]
    etfs: Bond[]
}

export type InvestmentProposalSourceType = 'hub_original' | 'planner' | 'custom'

export interface InvestmentProposalPayload {
    risk_profile_id: string
    source_type: InvestmentProposalSourceType
    assets: InvestmentProposalAssets
    derived_distribution?: InvestmentProposalDistribution | null
}

export interface InvestmentProposalAssetInput {
    symbol: string
    percentage: number
}


export type InvestmentProposal = InvestmentProposalPayload & Base
