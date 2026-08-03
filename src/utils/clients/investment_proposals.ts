import { accessAPI } from "../api"
import { RiskProfile, RiskProfilePayload } from "@/lib/clients/risk-profile"
import {
  InvestmentProposal,
  InvestmentProposalAssetInput,
  InvestmentProposalPreview,
} from "@/lib/clients/investment-proposals"
import { PortfolioPlanPayload } from "@/lib/clients/portfolio-plans"

export async function CreateInvestmentProposal(risk_profile: RiskProfilePayload & Pick<RiskProfile, 'id'>) {
  const report = await accessAPI('/investment_proposals/create/risk', 'POST', {'risk_profile': risk_profile})
  return report
}

export async function CreateInvestmentProposalFromPlan(portfolio_plan: PortfolioPlanPayload) {
  const report = await accessAPI('/investment_proposals/create/plan', 'POST', { portfolio_plan })
  return report
}

export async function PreviewInvestmentProposalFromPlan(portfolio_plan: Partial<PortfolioPlanPayload>): Promise<InvestmentProposalPreview> {
  const report: InvestmentProposalPreview = await accessAPI('/investment_proposals/preview/plan', 'POST', { portfolio_plan })
  return report
}

export async function ReadInvestmentProposalsByRiskProfile(risk_profile_id: string): Promise<InvestmentProposal[] | null> {
  const proposals: InvestmentProposal[] = await accessAPI(`/investment_proposals/read?risk_profile_id=${risk_profile_id}`, 'GET')
  return proposals || null
}

export async function CreateInvestmentProposalFromAssets(
  assets: InvestmentProposalAssetInput[],
  risk_profile_id?: string | null,
): Promise<InvestmentProposal> {
  const proposal: InvestmentProposal = await accessAPI('/investment_proposals/create/assets', 'POST', {
    assets,
    risk_profile_id,
  })
  return proposal
}
