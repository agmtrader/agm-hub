import { useTranslationProvider } from "@/utils/providers/TranslationProvider";

export interface QuestionChoice {
  value: number;
  labelKey: string;
}

const questionKeys = [
  "objective",
  "time_horizon",
  "withdrawal_need",
  "emergency_reserves",
  "loss_impact",
  "drawdown_limit",
  "drawdown_response",
  "volatility_preference",
  "investment_experience",
] as const;

export type QuestionKey = (typeof questionKeys)[number];

export interface Question {
  key: QuestionKey;
  labelKey: string;
  choices: QuestionChoice[];
}

export const riskQuestionnaireVersion = 2;

export const riskQuestions: Question[] = questionKeys.map((key) => {
  const labelPrefix = `risk.form.${key}`;
  return {
    key,
    labelKey: `${labelPrefix}.title`,
    choices: [1, 2, 3, 4, 5].map((value) => ({
      value,
      labelKey: `${labelPrefix}.option_${value}`,
    })),
  };
});

export type RiskFormValues = {
  name: string;
  email: string;
  starting_amount: number;
} & {
  [K in QuestionKey]: number;
};

export const useRiskTranslations = () => {
  const { t } = useTranslationProvider();

  const translateChoice = (c: QuestionChoice) => ({
    ...c,
    label: t(c.labelKey),
  });

  const questionsWithLabels = riskQuestions.map((q) => ({
    ...q,
    label: t(q.labelKey),
    choices: q.choices.map(translateChoice),
  }));

  return questionsWithLabels;
};

// One representative score inside each of the API's five existing score bands.
const scoresByTier = [0.5, 1.05, 1.375, 1.75, 2.5] as const;

export const calcRiskScore = (values: Pick<RiskFormValues, QuestionKey>) => {
  const capacity = Math.min(
    values.time_horizon,
    values.withdrawal_need,
    values.emergency_reserves,
    values.loss_impact,
  );
  const willingness = Math.min(
    values.drawdown_limit,
    Math.round((values.drawdown_response + values.volatility_preference) / 2),
  );
  // Experience is recorded for advisor review. It cannot raise the tier.
  const tier = Math.min(capacity, willingness, values.objective);
  return scoresByTier[tier - 1];
};
