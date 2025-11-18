import { z } from "zod"

export const account_schema = z.object({
    ibkr_account_number: z.string().nullable(),
    ibkr_username: z.string().nullable(),
    ibkr_password: z.string().nullable(),
    temporal_email: z.string().nullable(),
    temporal_password: z.string().nullable(),
})

export const deposit_instruction_schema = z.object({
    amount: z.number(),
    currency: z.string().default('USD'),
    bankInstructionMethod: z.string().default('WIRE'),
})

export const withdrawal_instruction_schema = z.object({
    amount: z.number(),
    currency: z.string().default('USD'),
    bankInstructionMethod: z.string().default('WIRE'),
    dateTimeToOccur: z.string().optional(),
    recurringInstructionDetail: z.object({
        instructionName: z.string(),
        frequency: z.string(),
        startDate: z.string(),
    }).optional(),
})