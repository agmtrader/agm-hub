import { accessAPI } from '../api'
import { PortfolioPlan, PortfolioPlanPayload } from '@/lib/clients/portfolio-plans'

export async function CreatePortfolioPlan(portfolio_plan: PortfolioPlanPayload) {
  return await accessAPI('/portfolio_plans/create', 'POST', { portfolio_plan })
}

export async function UpdatePortfolioPlan(query: Record<string, string>, portfolio_plan: Partial<PortfolioPlanPayload>) {
  return await accessAPI('/portfolio_plans/update', 'POST', { query, portfolio_plan })
}

export async function ReadPortfolioPlansByRiskProfile(risk_profile_id: string): Promise<PortfolioPlan[] | null> {
  const plans: PortfolioPlan[] = await accessAPI(`/portfolio_plans/read?risk_profile_id=${risk_profile_id}`, 'GET')
  return plans || null
}

export async function ReadPortfolioPlanById(portfolio_plan_id: string): Promise<PortfolioPlan | null> {
  const plans: PortfolioPlan[] = await accessAPI(`/portfolio_plans/read?id=${portfolio_plan_id}`, 'GET')
  return plans?.[0] ?? null
}
