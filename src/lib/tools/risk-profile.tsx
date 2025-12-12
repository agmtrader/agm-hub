import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Base } from '../entities/base';

export interface RiskProfilePayload {
  name: string;
  risk_profile_id: number;
  score: number;
  answers: {
    gain: string | undefined;
    loss: string | undefined;
    period: string | undefined;
    diversification: string | undefined;
    goals: string | undefined;
    type: string | undefined;
  }
}

export type RiskProfile = RiskProfilePayload & Base

export interface RiskArchetype {
  id: number;
  name: string;
  bonds_aaa_a: number;
  bonds_bbb: number;
  bonds_bb: number;
  etfs: number;
  min_score: number;
  max_score: number;
}