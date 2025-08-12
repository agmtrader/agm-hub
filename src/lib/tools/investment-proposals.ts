export interface Bond {
    'Symbol': string
    'Current Yield': number
    'S&P Equivalent': string
}

export interface InvestmentProposal {
    name: string
    equivalents: string[]
    bonds: Bond[]
}
