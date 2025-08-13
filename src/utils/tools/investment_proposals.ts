import { accessAPI } from "../api"

export async function CreateInvestmentProposal(risk_profile_id: string) {
  const report = await accessAPI('/investment_proposals/create?risk_profile_id=' + risk_profile_id, 'GET')
  return report
}