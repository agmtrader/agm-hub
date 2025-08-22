import { z } from "zod"

export const email_change_schema = z.object({
  ibkr_account_number: z.string().min(1, { message: "IBKR Account Number is required" }),
  email: z.string().nullable().optional(),
  temporal_email: z.string().nullable().optional(),
  Title: z.string().nullable().optional(),
  sheet_name: z.string().nullable().optional(),
  ibkr_username: z.string().nullable().optional(),
})
