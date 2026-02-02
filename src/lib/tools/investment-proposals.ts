import { Base } from "../entities/base"

export interface Bond {
    symbol: string
    current_yield: number
    equivalent: string
}

export interface InvestmentProposalPayload {
    risk_profile_id: string
    aaa_a: Bond[]
    bbb: Bond[]
    bb: Bond[]
    etfs: Bond[]
}

export type InvestmentProposal = InvestmentProposalPayload & Base