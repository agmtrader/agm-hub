import { z } from "zod"

// Form schema
export const risk_assesment_schema = (t: (key: string) => string) => z.object({
    account_number: z.string().optional(),
    client_name: z.string({
        required_error: t('forms.errors.input_required')
    }),
    type: z.enum(["1", "2.5", "4"], {
        errorMap: (issue, ctx) => {
        return {message: t('forms.errors.select_required')};
        },
    }),
    loss: z.enum(["1", "2", "3", "4"], {
        errorMap: (issue, ctx) => {
        return {message: t('forms.errors.select_required')};
        },
    }),
    gain: z.enum(["1", "2", "3", "4"], {
        errorMap: (issue, ctx) => {
        return {message: t('forms.errors.select_required')};
        },
    }),
    period: z.enum(["1", "2", "3", "4"], {
        errorMap: (issue, ctx) => {
        return {message: t('forms.errors.select_required')};
        },
    }),
    diversification: z.enum(["1", "2", "3"], {
        errorMap: (issue, ctx) => {
        return {message: t('forms.errors.select_required')};
        },
    }),
    goals: z.enum(["1", "2", "3"], {
        errorMap: (issue, ctx) => {
        return {message: t('forms.errors.select_required')};
        },
    }),
  })