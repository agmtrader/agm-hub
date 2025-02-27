import { accessAPI } from "../api"

export async function FetchInvestmentProposals() {
    let response = await accessAPI('/investment_proposals/read', 'GET')
    return response['content']
}