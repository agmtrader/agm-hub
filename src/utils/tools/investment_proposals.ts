import { accessAPI } from "../api"
import { RiskProfilePayload } from "@/lib/tools/risk-profile"

export async function CreateInvestmentProposal(risk_profile: RiskProfilePayload) {
  const report = await accessAPI('/investment_proposals/create', 'POST', {'risk_profile': risk_profile})
  return report
}