import { Base } from './base';

export interface RiskProfilePayload {
  name: string;
  email: string;
  contact_id?: string | null;
  score: number;
  estimated_deposit?: number | null;
  answers: {
    gain: string | undefined;
    loss: string | undefined;
    period: string | undefined;
    diversification: string | undefined;
    goals: string | undefined;
    type: string | undefined;
  }
  raw_answers?: Record<string, number> | null;
}

export type RiskProfile = RiskProfilePayload & Base & {
  assigned_risk_archetype?: string | null;
}

export interface RiskArchetype {
  id: number;
  name: string;
  treasuries: number;
  investment_grade: number;
  high_yield: number;
  equity: number;
  positions: number;
  largest_position: number | null;
  risk_assessment: string;
  horizon_fit: string;
  min_score: number;
  max_score: number;
}
