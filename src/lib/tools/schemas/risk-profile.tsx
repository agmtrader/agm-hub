import { z } from "zod";
import { riskQuestions, QuestionKey } from "../risk-questions";

/*
 * Dynamically build the Zod schema from the shared question definition.
 * This guarantees that the schema is always in-sync with the questionnaire.
 */
export const risk_assesment_schema = (t: (key: string) => string) => {
  const dynamicShape = Object.fromEntries(
    riskQuestions.map((q) => [
      q.key,
      // Accept the exact set of numeric values present in the question choices
      z.coerce
        .number({ invalid_type_error: t("forms.errors.select_required") })
        .refine((v) => q.choices.some((c) => c.value === v), {
          message: t("forms.errors.select_required"),
        }),
    ]) as [QuestionKey, z.ZodTypeAny][]
  );

  return z.object({
    name: z.string({ required_error: t("forms.errors.input_required") }),
    ...dynamicShape,
  });
};
