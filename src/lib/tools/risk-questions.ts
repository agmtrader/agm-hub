import { useTranslationProvider } from "@/utils/providers/TranslationProvider";

/*
 * Single source-of-truth for the risk questionnaire.
 *
 *  – Updating / adding a question requires changing ONLY this file.
 *  – The schema, UI rendering and score calculation are all derived from here.
 */

export interface QuestionChoice {
  /** Numeric score associated with the choice */
  value: number;
  /** i18n key that resolves to the choice label */
  labelKey: string;
  /** Optional extra metadata (e.g. bonds/stock % for diversification) */
  bonds_percentage?: number;
  stocks_percentage?: number;
}

export type QuestionKey =
  | "type"
  | "loss"
  | "gain"
  | "period"
  | "diversification"
  | "goals";

export interface Question {
  key: QuestionKey;
  labelKey: string; // i18n key for the question title
  weight: number; // relative weight (0 – 1)
  choices: QuestionChoice[];
}

export const riskQuestions: Question[] = [
  {
    key: "type",
    labelKey: "apply.risk.form.type.title",
    weight: 0.2,
    choices: [
      { value: 1, labelKey: "apply.risk.form.type.conservative" },
      { value: 2.5, labelKey: "apply.risk.form.type.moderate" },
      { value: 4, labelKey: "apply.risk.form.type.aggressive" },
    ],
  },
  {
    key: "loss",
    labelKey: "apply.risk.form.loss.title",
    weight: 0.15,
    choices: [
      { value: 1, labelKey: "apply.risk.form.loss.sell_everything" },
      { value: 2, labelKey: "apply.risk.form.loss.sell_some" },
      { value: 3, labelKey: "apply.risk.form.loss.do_nothing" },
      { value: 4, labelKey: "apply.risk.form.loss.invest_more" },
    ],
  },
  {
    key: "gain",
    labelKey: "apply.risk.form.gain.title",
    weight: 0.15,
    choices: [
      { value: 1, labelKey: "apply.risk.form.gain.sell_everything" },
      { value: 2, labelKey: "apply.risk.form.gain.sell_some" },
      { value: 3, labelKey: "apply.risk.form.gain.do_nothing" },
      { value: 4, labelKey: "apply.risk.form.gain.invest_more" },
    ],
  },
  {
    key: "period",
    labelKey: "apply.risk.form.period.title",
    weight: 0.15,
    choices: [
      { value: 1, labelKey: "apply.risk.form.period.more_than_21_years" },
      { value: 2, labelKey: "apply.risk.form.period.11_to_20_years" },
      { value: 3, labelKey: "apply.risk.form.period.5_to_10_years" },
    ],
  },
  {
    key: "diversification",
    labelKey: "apply.risk.form.diversification.title",
    weight: 0.15,
    choices: [
      {
        value: 1,
        labelKey: "apply.risk.form.diversification.portfolio_a",
        bonds_percentage: 100,
        stocks_percentage: 0,
      },
      {
        value: 2,
        labelKey: "apply.risk.form.diversification.portfolio_b",
        bonds_percentage: 80,
        stocks_percentage: 20,
      },
      {
        value: 3,
        labelKey: "apply.risk.form.diversification.portfolio_c",
        bonds_percentage: 60,
        stocks_percentage: 40,
      },
    ],
  },
  {
    key: "goals",
    labelKey: "apply.risk.form.goals.title",
    weight: 0.2,
    choices: [
      { value: 1, labelKey: "apply.risk.form.goals.portfolio_a" },
      { value: 2, labelKey: "apply.risk.form.goals.portfolio_b" },
      { value: 3, labelKey: "apply.risk.form.goals.portfolio_c" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export type RiskFormValues = {
  name: string;
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

export const calcRiskScore = (values: RiskFormValues) =>
  riskQuestions.reduce((sum, q) => sum + q.weight * Number(values[q.key]), 0);
