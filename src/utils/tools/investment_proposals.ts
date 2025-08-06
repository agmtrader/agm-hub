import { accessAPI } from "../api"

export async function GenerateInvestmentProposal() {
  const report = await accessAPI('/investment_proposals/generate', 'GET')
  return report
}