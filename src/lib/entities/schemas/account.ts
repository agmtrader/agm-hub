import { z } from "zod"

export const account_schema = z.object({
    ibkr_account_number: z.string().nullable(),
    ibkr_username: z.string().nullable(),
    ibkr_password: z.string().nullable(),
    temporal_email: z.string().nullable(),
    temporal_password: z.string().nullable(),
})

export const deposit_request_schema = z.object({
    amount: z.number(),
    currency: z.string(),
    bank_instruction_method: z.enum(['ACH', 'WIRE']),
    is_ira: z.boolean(),
    sending_institution: z.string(),
    identifier: z.string(),
    special_instruction: z.string(),
    bank_instruction_name: z.string(),
    sender_institution_name: z.string(),
})