import { useTranslationProvider } from '@/utils/providers/TranslationProvider';

export interface UserRiskProfile {
  AccountNumber: string;
  ClientName: string;
  Score: number;
  RiskProfileID: string;
  RiskProfile: any;
  UserID: string;
}

export interface RiskProfile {
  name: string;
  bonds_aaa_a: number;
  bonds_bbb: number;
  bonds_bb: number;
  etfs: number;
  average_yield: number;
  min_score: number;
  max_score: number;
}

// This array is used to assign a risk profile to a client given their risk score
// It is also used to display the risk profile in the dashboard
export const risk_profiles = [
  {
    name: 'Conservative A',
    bonds_aaa_a: 0.3,
    bonds_bbb: 0.7,
    bonds_bb: 0,
    etfs: 0,
    average_yield: .06103,
    min_score: 0,
    max_score: 0.9
  },
  {
    name: 'Conservative B',
    bonds_aaa_a: 0.18,
    bonds_bbb: 0.54,
    bonds_bb: .18,
    etfs: .1,
    average_yield: .0723,
    min_score: 0.9,
    max_score: 1.25
  },
  {
    name: 'Moderate A',
    bonds_aaa_a: 0.16,
    bonds_bbb: 0.48,
    bonds_bb: 0.16,
    etfs: 0.2,
    average_yield: .0764,
    min_score: 1.25,
    max_score: 1.5
  },
  {
    name: 'Moderate B',
    bonds_aaa_a: 0.15,
    bonds_bbb: 0.375,
    bonds_bb: 0.15,
    etfs: 0.25,
    average_yield: .0736,
    min_score: 1.5,
    max_score: 2
  },
  {
    name: 'Moderate C',
    bonds_aaa_a: 0.14,
    bonds_bbb: 0.35,
    bonds_bb: 0.21,
    etfs: 0.3,
    average_yield: .06103,
    min_score: 2,
    max_score: 2.5
  },
  {
    name: 'Aggressive A',
    bonds_aaa_a: 0.13,
    bonds_bbb: 0.325,
    bonds_bb: .195,
    etfs: .35,
    average_yield: .0845,
    min_score: 2.5,
    max_score: 2.75
  },
  {
    name: 'Aggressive B',
    bonds_aaa_a: 0.12,
    bonds_bbb: 0.30,
    bonds_bb: 0.18,
    etfs: 0.4,
    average_yield: .0865,
    min_score: 2.75,
    max_score: 3
  },
  {
    name: 'Aggressive C',
    bonds_aaa_a: 0.05,
    bonds_bbb: 0.25,
    bonds_bb: 0.20,
    etfs: 0.5,
    average_yield: .0925,
    min_score: 3,
    max_score: 10
  }
] as RiskProfile[]

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