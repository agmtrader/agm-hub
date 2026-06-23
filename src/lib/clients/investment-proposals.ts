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

export type PlannerInputs = {
    risk_profile_id: string
    name?: string | null
    target_return: number
    starting_amount: number
    risk_tolerance: 'conservative' | 'moderate' | 'aggressive'
    selected_risk_archetype?: string | null
    allocation: Record<'cash' | 'treasuries' | 'bonds' | 'stocks', number>
    bond_rating_allocation: Record<'aaa' | 'bbb' | 'bb', number>
    locked_assets?: Record<'cash' | 'treasuries' | 'bonds' | 'stocks', boolean> | null
    locked_bond_ratings?: Record<'aaa' | 'bbb' | 'bb', boolean> | null
}

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
    planner_inputs?: PlannerInputs | null
    derived_distribution?: InvestmentProposalDistribution | null
}

export interface InvestmentProposalAssetInput {
    symbol: string
    percentage: number
}


export type InvestmentProposal = InvestmentProposalPayload & Base
