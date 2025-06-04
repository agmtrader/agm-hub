import { z } from "zod"

export const poa_schema = z.object({
    type: z.enum(["Utility bill", "Bank Statement", "Tax Return"]),
    issued_date: z.date(),
})

export const poi_schema = z.object({
    gender: z.string(),
    country_of_issue: z.string(),
    type: z.enum(["ID", "Passport", "License"]),
    full_name: z.string(),
    id_number: z.string(),
    issued_date: z.date(),
    date_of_birth: z.date(),
    expiration_date: z.date(),
    country_of_birth: z.string(),
})

export const sow_schema = z.object({
    issued_date: z.date(),
})