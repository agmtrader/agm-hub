import { accessAPI } from "../api"
import { RiskProfilePayload } from "@/lib/tools/risk-profile"
import { InvestmentProposal } from "@/lib/tools/investment-proposals"

export async function CreateInvestmentProposal(risk_profile: RiskProfilePayload) {
  const report = await accessAPI('/investment_proposals/create', 'POST', {'risk_profile': risk_profile})
  return report
}

export async function ReadInvestmentProposals(): Promise<InvestmentProposal[] | null> {
  const proposals: InvestmentProposal[] = await accessAPI('/investment_proposals/read', 'GET')
  return proposals || null
}

export async function ReadInvestmentProposalsByRiskProfile(risk_profile_id: string): Promise<InvestmentProposal[] | null> {
  const proposals: InvestmentProposal[] = await accessAPI(`/investment_proposals/read?risk_profile_id=${risk_profile_id}`, 'GET')
  return proposals || null
}

export async function ReadInvestmentProposalsByAccount(account_id: string): Promise<InvestmentProposal[] | null> {
  const proposals: InvestmentProposal[] = await accessAPI(`/investment_proposals/read?account_id=${account_id}`, 'GET')
  return proposals || null
}