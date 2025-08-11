import { accessAPI } from "../api"

export async function GenerateInvestmentProposal(risk_profile_id: string) {
  const report = await accessAPI('/investment_proposals/generate?risk_profile_id=' + risk_profile_id, 'GET')
  return report
}