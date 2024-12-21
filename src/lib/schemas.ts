import { z } from "zod"

// Risk assessment
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

// Account Application
// Individual
export const general_info_schema = (t: (key: string) => string) => z.object({
    email: z.string({
      required_error: t('forms.errors.email'),
    }).email({
      message: t('forms.errors.email'),
    }),
  
    country: z.string({
      required_error: t('forms.errors.select_required'),
    }),
  
    account_type: z.string({
      required_error: t('forms.errors.select_required'),
    }),
})
const base_about_you_schema = z.object({
    salutation: z.string().min(1, {
        message: "You must select a salutation.",
    }),
    first_name: z.string().min(1, {
        message: "You must enter a first name.",
    }),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, {
        message: "You must enter a last name.",
    }),
    address: z.string().min(1, {
        message: 'You must enter an address.',
    }),
    city: z.string().min(1, {
        message: 'You must enter a city.',
    }),
    state: z.string().min(1, {
        message: 'You must enter a state/province.',
    }),
    zip:  z.string().min(1, {
        message: 'You must enter a zip code.',
    }),
    phone_type: z.string().min(1, {
        message: 'You must select a phone type.',
    }),
    phone_country: z.string().min(1, {
        message: 'You must select a phone country.'
    }),
    phone_number: z.string().min(1, {
        message: 'You must enter a phone number.',
    }),
    citizenship: z.string().min(1, {
        message: 'You must select a citizenship.'
    }),
    country_of_birth: z.string().min(1, {
        message: 'You must select a country of birth.'
    }),
    date_of_birth: z.string().min(1, {
        message: 'You must enter a date of birth.',
    }),
    marital_status: z.string().min(1, {
        message: 'You must select a marital status'
    }),
    number_of_dependents: z.string().min(1, {
        message: 'You must enter a number of dependents.',
    }),
    country_of_residence: z.string().min(1, {
        message: 'You must select a Country of Residence.'
    }),
    tax_id: z.string().min(1, {
        message: 'You must enter a tax ID.',
    }),
    id_country: z.string().min(1, {
        message: 'You must select an ID Country.'
    }),
    id_type: z.string().min(1, {
        message: 'You must select an ID type.'
    }),
    id_number: z.string().min(1, {
        message: 'You must enter an ID number.',
    }),
    id_expiration_date: z.string().min(1, {
        message: 'You must enter an ID expiration date.',
    }),
    employment_status: z.string().min(1, {
        message: 'You must select an employment status.',
    }),
    employer_name: z.string().min(1, {
        message: 'You must enter an employer name.',
    }),
    employer_address: z.string().min(1, {
        message: 'You must enter an employer address.',
    }),
    employer_city: z.string().min(1, {
        message: 'You must enter an employer city.',
    }),
    employer_state: z.string().min(1, {
        message: 'You must enter an employer state.',
    }),
    employer_country: z.string().min(1, {
        message: 'You must select an employer country.',
    }),
    employer_zip: z.string().min(1, {
        message: 'You must enter an employer zip.',
    }),
    nature_of_business: z.string().min(1, {
        message: 'You must enter a nature of business.',
    }),
    occupation: z.string().min(1, {
        message: 'You must enter an occupation.',
    }),
    source_of_wealth: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You must select at least one source of wealth.",
    }).default([]),
    currency: z.string().min(1, {
        message: 'You must select a currency.'
    }),
})
export const about_you_primary_schema = (t: (key: string) => string) => base_about_you_schema.extend({
    security_q_1: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    security_a_1: z.string({
        required_error: t('forms.errors.security_answer'),
    }),
    security_q_2: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    security_a_2: z.string({
        required_error: t('forms.errors.security_answer'),
    }),
    security_q_3: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    security_a_3: z.string({
        required_error: t('forms.errors.security_answer'),
    }),
})
export const about_you_secondary_schema = (t: (key: string) => string) => base_about_you_schema.extend({
email: z.string({
    required_error: t('forms.errors.email'),
}).email({
    message: t('forms.errors.email'),
}),
username: z.string({
    required_error: t('forms.errors.username_length')
}).min(4, {
    message: t('forms.errors.username_length')
}),
password: z.string({
    required_error: t('forms.errors.password_format')
})
    .min(4, { message: t('forms.errors.password_format') })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: t('forms.errors.password_format')
    }),
})

// Institutional
export const about_organization_schema = (t: (key: string) => string) => z.object({
    
    name: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    type: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    description: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    website: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    legal_entity_id: z.string({
        required_error: t('forms.errors.select_required'),
    }),

    purpose: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: t('forms.errors.select_required'),
    }).default([]),
    proprietary_assets: z.boolean().refine((val) => val === true, {
        message: t('forms.errors.true_required'),
    }).default(false),

    phone_type: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    phone_country: z.string({
        required_error: t('forms.errors.select_required')
    }),
    phone_number: z.string({
        required_error: t('forms.errors.select_required'),
    }),

    address: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    city: z.string({
        message: t('forms.errors.select_required'),
    }),
    state: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    zip:  z.string({
        required_error: t('forms.errors.select_required'),
    }),

    tax_country: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    tax_id: z.string({
        required_error: t('forms.errors.select_required'),
    }),

    source_of_wealth: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: t('forms.errors.select_required'),
    }).default([]),
    currency: z.string({
        required_error: t('forms.errors.select_required'),
    })

})
export const authorized_person_schema = (t: (key: string) => string) => z.object({

    salutation: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    first_name: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    suffix: z.string().optional(),
    date_of_birth: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    position: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: t('forms.errors.select_required'),
    }).default([]),
    third_party: z.boolean().refine((val) => val === true, {
        message: t('forms.errors.true_required'),
    }).default(false),

    email: z.string().email({
        message: t('forms.errors.email'),
    }),
    phone_type: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    phone_country: z.string().min(1, {
        message: t('forms.errors.select_required')
    }),
    phone_number: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    address: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    city: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    state: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    zip:  z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    id_country: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    id_type: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    id_number: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    id_expiration_date: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    tax_country: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    tax_id: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    employment_status: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    employer_name: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    employer_address: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    employer_city: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    employer_state: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    employer_country: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    employer_zip: z.string().min(1, {
        message: t('forms.errors.select_required'),
    }),
    security_q_1: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    security_a_1: z.string({
        required_error: t('forms.errors.security_answer'),
    }),
    security_q_2: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    security_a_2: z.string({
        required_error: t('forms.errors.security_answer'),
    }),
    security_q_3: z.string({
        required_error: t('forms.errors.select_required'),
    }),
    security_a_3: z.string({
        required_error: t('forms.errors.security_answer'),
    }),
})

// Shared
export const regulatory_schema = (t: (key: string) => string) => z.object({

    annual_net_income: z.string({
        required_error: t('forms.errors.select_required'),
    }),

    net_worth: z.string({
        required_error: t('forms.errors.select_required'),
    }),

    liquid_net_worth: z.string({
        required_error: t('forms.errors.select_required'),
    }),

    investment_objectives: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: t('forms.errors.select_required'),
    }).default([]),

    products: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: t('forms.errors.select_required'),
    }).default([]),

    amount_to_invest: z.string({
        required_error: t('forms.errors.select_required'),
    })
})

// Internal Schemas
// Document Center
export const poa_schema = z.object({
    account_number: z.string(),
    type: z.enum(["Utility bill", "Bank Statement", "Tax Return"]),
    issued_date: z.date(),
})
export const poi_schema = z.object({
    account_number: z.string(),
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
    account_number: z.string(),
})

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
