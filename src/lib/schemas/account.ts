import { z } from "zod"

// Account accesses
export const account_access_schema = z.object({
    temp_email: z.string().email({
        message: "Please enter a valid email address.",
    }).min(1, {
        message: 'You must enter an email.'
    }),
    temp_password: z.string().min(1, {
        message: 'You must enter a password.'
    }),
    account_number: z.string().regex(/^[a-zA-Z]/, {
        message: 'Account number must start with a letter.'
    }).min(6, {
        message: 'Account number must be at least 2 characters long.'
    }),
    ibkr_username: z.string().min(1, {
        message: 'You must enter an IBKR username.'
    }),
    ibkr_password: z.string().min(1, {
        message: 'You must enter an IBKR password.'
    })
})