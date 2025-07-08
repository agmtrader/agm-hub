import { z } from "zod"

export const account_schema = z.object({
    ibkr_account_number: z.string().nullable(),
    ibkr_username: z.string().nullable(),
    ibkr_password: z.string().nullable(),
    temporal_email: z.string().nullable(),
    temporal_password: z.string().nullable(),
})