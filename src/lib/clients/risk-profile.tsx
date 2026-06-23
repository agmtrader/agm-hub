import { Base } from './base';

export interface RiskProfilePayload {
  name: string;
  score: number;
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
  bonds_aaa_a: number;
  bonds_bbb: number;
  bonds_bb: number;
  etfs: number;
  min_score: number;
  max_score: number;
}
