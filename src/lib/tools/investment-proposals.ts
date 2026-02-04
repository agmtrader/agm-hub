import { Base } from "../entities/base"

export interface Bond {
    symbol: string
    current_yield: number
    equivalent: string
}

export const investmentProposalDistributionKeys = [
    'bonds_aaa_a',
    'bonds_bbb',
    'bonds_bb',
    'etfs',
] as const

export type InvestmentProposalDistributionKey = (typeof investmentProposalDistributionKeys)[number]

export type InvestmentProposalDistribution = Record<InvestmentProposalDistributionKey, number>

export interface InvestmentProposalPayload {
    risk_profile_id: string
    aaa_a: Bond[]
    bbb: Bond[]
    bb: Bond[]
    etfs: Bond[]
    distribution?: InvestmentProposalDistribution | null
}

export interface InvestmentProposalAssetInput {
    symbol: string
    percentage: number
}


export type InvestmentProposal = InvestmentProposalPayload & Base