import { accessAPI } from "../api"
import { RiskProfile } from "@/lib/clients/risk-profile"
import {
  InvestmentProposal,
  InvestmentProposalAssetInput,
} from "@/lib/clients/investment-proposals"
import { PortfolioPlan } from "@/lib/clients/portfolio-plans"

export async function CreateInvestmentProposal(risk_profile: RiskProfile) {
  const report = await accessAPI('/investment_proposals/create/risk', 'POST', {'risk_profile': risk_profile})
  return report
}

export async function CreateInvestmentProposalFromPlan(portfolio_plan: PortfolioPlan) {
  const report = await accessAPI('/investment_proposals/create/plan', 'POST', { portfolio_plan })
  return report
}

export async function ReadInvestmentProposals(): Promise<InvestmentProposal[] | null> {
  const proposals: InvestmentProposal[] = await accessAPI('/investment_proposals/read', 'GET')
  return proposals || null
}

export async function ReadInvestmentProposalByID(proposal_id: string): Promise<InvestmentProposal | null> {
  const proposals: InvestmentProposal[] = await accessAPI(`/investment_proposals/read?id=${proposal_id}`, 'GET')
  const proposal = proposals[0] || null
  return proposal
}

export async function ReadInvestmentProposalsByRiskProfile(risk_profile_id: string): Promise<InvestmentProposal[] | null> {
  const proposals: InvestmentProposal[] = await accessAPI(`/investment_proposals/read?risk_profile_id=${risk_profile_id}`, 'GET')
  return proposals || null
}

export async function ReadInvestmentProposalsByPortfolioPlan(portfolio_plan_id: string): Promise<InvestmentProposal[] | null> {
  const proposals: InvestmentProposal[] = await accessAPI(`/investment_proposals/read?portfolio_plan_id=${portfolio_plan_id}`, 'GET')
  return proposals || null
}

export async function ReadInvestmentProposalsByAccount(account_id: string): Promise<InvestmentProposal[] | null> {
  const proposals: InvestmentProposal[] = await accessAPI(`/investment_proposals/read?account_id=${account_id}`, 'GET')
  return proposals || null
}

export async function CreateInvestmentProposalFromAssets(assets: InvestmentProposalAssetInput[]): Promise<InvestmentProposal> {
  const proposal: InvestmentProposal = await accessAPI('/investment_proposals/create/assets', 'POST', { assets: assets })
  return proposal
}
