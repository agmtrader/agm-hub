import { accessAPI } from "../api"

export async function FetchInvestmentProposals() {
    let investment_proposals = await accessAPI('/investment_proposals/read', 'GET')
    return investment_proposals
}