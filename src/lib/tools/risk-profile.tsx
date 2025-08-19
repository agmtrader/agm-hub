import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Base } from '../entities/base';

export interface RiskProfilePayload {
  name: string;
  account_id: string | null;
  risk_profile_id: number;
  score: number;
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

// Question weights out of 100%
// This array is used to give relative importance to each question
export const weights = [
  {
    name: 'type',
    weight: 0.2
  }, 
  {
    name: 'loss',
    weight: 0.15
  },
  {
    name: 'gain',
    weight: 0.15
  }, 
  {
    name: 'period',
    weight: 0.15
  },
  {
    name: 'diversification',
    weight: 0.15
  },
  {
    name: 'goals',
    weight: 0.2
  }
]

// This function returns the questions for the risk form
// Each question has choices and each choice has a value
// The value is used to calculate the risk score, the higher the score the higher the risk of the answer
// The risk score is calculated by multiplying the weight of the question by the value of the answer
export const getRiskFormQuestions = () => {

  const { t } = useTranslationProvider()

  const types = [
    {
      value: '1',
      label: t('apply.risk.form.type.conservative'),
      id: 1
    },
    {
      value: '2.5',
      label: t('apply.risk.form.type.moderate'),
      id: 2
    },
    {
      value: '4',
      label: t('apply.risk.form.type.aggressive'),
      id: 3
    }
  ]

  const losses = [
    {
      value: '1',
      label: t('apply.risk.form.loss.sell_everything'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.loss.sell_some'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.loss.do_nothing'),
      id: 3
    },
    {
      value: '4',
      label: t('apply.risk.form.loss.invest_more'),
      id: 4
    },
  ]

  const gains = [
    {
      value: '1',
      label: t('apply.risk.form.gain.sell_everything'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.gain.sell_some'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.gain.do_nothing'),
      id: 3
    },
    {
      value: '4',
      label: t('apply.risk.form.gain.invest_more'),
      id: 4
    }
  ] 

  const periods = [
    {
      value: '1',
      label: t('apply.risk.form.period.more_than_21_years'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.period.11_to_20_years'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.period.5_to_10_years'),
      id: 3
    }
  ]

  const diversifications = [
    {
      value: '1',
      label: t('apply.risk.form.diversification.portfolio_a'),
      bonds_percentage: 100,
      stocks_percentage: 0,
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.diversification.portfolio_b'),
      bonds_percentage: 80,
      stocks_percentage: 20,
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.diversification.portfolio_c'),
      bonds_percentage: 60,
      stocks_percentage: 40,
      id: 3
    }
  ]

  const goals = [
    {
      value: '1',
      label: t('apply.risk.form.goals.portfolio_a'),
      id: 1
    },
    {
      value: '2',
      label: t('apply.risk.form.goals.portfolio_b'),
      id: 2
    },
    {
      value: '3',
      label: t('apply.risk.form.goals.portfolio_c'),
      id: 3
    }
  ]

  return { types, losses, gains, periods, diversifications, goals }
}