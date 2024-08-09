import { z } from "zod"

// Dictionaries
export const countries = [
    { label: "Afghanistan", value: "af" },
    { label: "Albania", value: "al" },
    { label: "Algeria", value: "dz" },
    { label: "Andorra", value: "ad" },
    { label: "Angola", value: "ao" },
    { label: "Antigua and Barbuda", value: "ag" },
    { label: "Argentina", value: "ar" },
    { label: "Armenia", value: "am" },
    { label: "Australia", value: "au" },
    { label: "Austria", value: "at" },
    { label: "Azerbaijan", value: "az" },
    { label: "Bahamas", value: "bs" },
    { label: "Bahrain", value: "bh" },
    { label: "Bangladesh", value: "bd" },
    { label: "Barbados", value: "bb" },
    { label: "Belarus", value: "by" },
    { label: "Belgium", value: "be" },
    { label: "Belize", value: "bz" },
    { label: "Benin", value: "bj" },
    { label: "Bhutan", value: "bt" },
    { label: "Bolivia", value: "bo" },
    { label: "Bosnia and Herzegovina", value: "ba" },
    { label: "Botswana", value: "bw" },
    { label: "Brazil", value: "br" },
    { label: "Brunei", value: "bn" },
    { label: "Bulgaria", value: "bg" },
    { label: "Burkina Faso", value: "bf" },
    { label: "Burundi", value: "bi" },
    { label: "Cabo Verde", value: "cv" },
    { label: "Cambodia", value: "kh" },
    { label: "Cameroon", value: "cm" },
    { label: "Canada", value: "ca" },
    { label: "Central African Republic", value: "cf" },
    { label: "Chad", value: "td" },
    { label: "Chile", value: "cl" },
    { label: "China", value: "cn" },
    { label: "Colombia", value: "co" },
    { label: "Comoros", value: "km" },
    { label: "Congo, Democratic Republic of the", value: "cd" },
    { label: "Congo, Republic of the", value: "cg" },
    { label: "Costa Rica", value: "cr" },
    { label: "Croatia", value: "hr" },
    { label: "Cuba", value: "cu" },
    { label: "Cyprus", value: "cy" },
    { label: "Czech Republic", value: "cz" },
    { label: "Denmark", value: "dk" },
    { label: "Djibouti", value: "dj" },
    { label: "Dominica", value: "dm" },
    { label: "Dominican Republic", value: "do" },
    { label: "Ecuador", value: "ec" },
    { label: "Egypt", value: "eg" },
    { label: "El Salvador", value: "sv" },
    { label: "Equatorial Guinea", value: "gq" },
    { label: "Eritrea", value: "er" },
    { label: "Estonia", value: "ee" },
    { label: "Eswatini", value: "sz" },
    { label: "Ethiopia", value: "et" },
    { label: "Fiji", value: "fj" },
    { label: "Finland", value: "fi" },
    { label: "France", value: "fr" },
    { label: "Gabon", value: "ga" },
    { label: "Gambia", value: "gm" },
    { label: "Georgia", value: "ge" },
    { label: "Germany", value: "de" },
    { label: "Ghana", value: "gh" },
    { label: "Greece", value: "gr" },
    { label: "Grenada", value: "gd" },
    { label: "Guatemala", value: "gt" },
    { label: "Guinea", value: "gn" },
    { label: "Guinea-Bissau", value: "gw" },
    { label: "Guyana", value: "gy" },
    { label: "Haiti", value: "ht" },
    { label: "Honduras", value: "hn" },
    { label: "Hungary", value: "hu" },
    { label: "Iceland", value: "is" },
    { label: "India", value: "in" },
    { label: "Indonesia", value: "id" },
    { label: "Iran", value: "ir" },
    { label: "Iraq", value: "iq" },
    { label: "Ireland", value: "ie" },
    { label: "Israel", value: "il" },
    { label: "Italy", value: "it" },
    { label: "Jamaica", value: "jm" },
    { label: "Japan", value: "jp" },
    { label: "Jordan", value: "jo" },
    { label: "Kazakhstan", value: "kz" },
    { label: "Kenya", value: "ke" },
    { label: "Kiribati", value: "ki" },
    { label: "Korea, North", value: "kp" },
    { label: "Korea, South", value: "kr" },
    { label: "Kosovo", value: "xk" },
    { label: "Kuwait", value: "kw" },
    { label: "Kyrgyzstan", value: "kg" },
    { label: "Laos", value: "la" },
    { label: "Latvia", value: "lv" },
    { label: "Lebanon", value: "lb" },
    { label: "Lesotho", value: "ls" },
    { label: "Liberia", value: "lr" },
    { label: "Libya", value: "ly" },
    { label: "Liechtenstein", value: "li" },
    { label: "Lithuania", value: "lt" },
    { label: "Luxembourg", value: "lu" },
    { label: "Madagascar", value: "mg" },
    { label: "Malawi", value: "mw" },
    { label: "Malaysia", value: "my" },
    { label: "Maldives", value: "mv" },
    { label: "Mali", value: "ml" },
    { label: "Malta", value: "mt" },
    { label: "Marshall Islands", value: "mh" },
    { label: "Mauritania", value: "mr" },
    { label: "Mauritius", value: "mu" },
    { label: "Mexico", value: "mx" },
    { label: "Micronesia", value: "fm" },
    { label: "Moldova", value: "md" },
    { label: "Monaco", value: "mc" },
    { label: "Mongolia", value: "mn" },
    { label: "Montenegro", value: "me" },
    { label: "Morocco", value: "ma" },
    { label: "Mozambique", value: "mz" },
    { label: "Myanmar", value: "mm" },
    { label: "Namibia", value: "na" },
    { label: "Nauru", value: "nr" },
    { label: "Nepal", value: "np" },
    { label: "Netherlands", value: "nl" },
    { label: "New Zealand", value: "nz" },
    { label: "Nicaragua", value: "ni" },
    { label: "Niger", value: "ne" },
    { label: "Nigeria", value: "ng" },
    { label: "North Macedonia", value: "mk" },
    { label: "Norway", value: "no" },
    { label: "Oman", value: "om" },
    { label: "Pakistan", value: "pk" },
    { label: "Palau", value: "pw" },
    { label: "Panama", value: "pa" },
    { label: "Papua New Guinea", value: "pg" },
    { label: "Paraguay", value: "py" },
    { label: "Peru", value: "pe" },
    { label: "Philippines", value: "ph" },
    { label: "Poland", value: "pl" },
    { label: "Portugal", value: "pt" },
    { label: "Qatar", value: "qa" },
    { label: "Romania", value: "ro" },
    { label: "Russia", value: "ru" },
    { label: "Rwanda", value: "rw" },
    { label: "Saint Kitts and Nevis", value: "kn" },
    { label: "Saint Lucia", value: "lc" },
    { label: "Saint Vincent and the Grenadines", value: "vc" },
    { label: "Samoa", value: "ws" },
    { label: "San Marino", value: "sm" },
    { label: "Sao Tome and Principe", value: "st" },
    { label: "Saudi Arabia", value: "sa" },
    { label: "Senegal", value: "sn" },
    { label: "Serbia", value: "rs" },
    { label: "Seychelles", value: "sc" },
    { label: "Sierra Leone", value: "sl" },
    { label: "Singapore", value: "sg" },
    { label: "Slovakia", value: "sk" },
    { label: "Slovenia", value: "si" },
    { label: "Solomon Islands", value: "sb" },
    { label: "Somalia", value: "so" },
    { label: "South Africa", value: "za" },
    { label: "South Sudan", value: "ss" },
    { label: "Spain", value: "es" },
    { label: "Sri Lanka", value: "lk" },
    { label: "Sudan", value: "sd" },
    { label: "Suriname", value: "sr" },
    { label: "Sweden", value: "se" },
    { label: "Switzerland", value: "ch" },
    { label: "Syria", value: "sy" },
    { label: "Taiwan", value: "tw" },
    { label: "Tajikistan", value: "tj" },
    { label: "Tanzania", value: "tz" },
    { label: "Thailand", value: "th" },
    { label: "Timor-Leste", value: "tl" },
    { label: "Togo", value: "tg" },
    { label: "Tonga", value: "to" },
    { label: "Trinidad and Tobago", value: "tt" },
    { label: "Tunisia", value: "tn" },
    { label: "Turkey", value: "tr" },
    { label: "Turkmenistan", value: "tm" },
    { label: "Tuvalu", value: "tv" },
    { label: "Uganda", value: "ug" },
    { label: "Ukraine", value: "ua" },
    { label: "United Arab Emirates", value: "ae" },
    { label: "United Kingdom", value: "gb" },
    { label: "United States", value: "us" },
    { label: "Uruguay", value: "uy" },
    { label: "Uzbekistan", value: "uz" },
    { label: "Vanuatu", value: "vu" },
    { label: "Vatican City", value: "va" },
    { label: "Venezuela", value: "ve" },
    { label: "Vietnam", value: "vn" },
    { label: "Yemen", value: "ye" },
    { label: "Zambia", value: "zm" },
    { label: "Zimbabwe", value: "zw" },
] as const;
  
export const account_types = [
    { label: "Individual", value: "individual" },
    { label: "Joint", value: "joint" },
    { label: "Trust", value: "trust" },
    { label: "Institutional", value: "institutional" },
] as const

export const salutations = [
    { label: "Mr.", value: "mr" },
    { label: "Ms.", value: "ms" },
    { label: "Mrs.", value: "mrs" },
    { label: "Dr.", value: "dr" },
] as const
    
export const marital_status = [
    { label: "Single", value: "sngl" },
    { label: "Married", value: "mrd" },
    { label: "Widowed", value: "wdw" },
] as const

export const id_type = [
    { label: "Passport", value: "passport" },
    { label: "National ID", value: "id" },
    { label: "Driver's License", value: "driver" },
] as const

export const employment_status = [
    { label: "Employed", value: "employed" },
    { label: "Retired", value: "retired" },
] as const

export const currencies = [
    { label: "USD", value: "usd" },
    { label: "Euro", value: "eur" },
] as const

export const source_of_wealth = [
  {
    id: "disability",
    label: "Disability",
  },
  {
    id: "income",
    label: "Income",
  },
  {
    id: "pension",
    label: "Pension",
  },
] as const

export const investment_objectives = [
  {
    id: "capital",
    label: "Preservation of Capital and Income Generation",
  },
  {
    id: "growth",
    label: "Growth",
  },
  {
    id: "hedging",
    label: "Hedging",
  },
  {
    id: "profits",
    label:"Profits from Active Trading and Speculation"
  }
  
] as const

export const products = [
  {
    id: "bonds",
    label: "Bonds",
  },
  {
    id: "stocks",
    label: "Stocks",
  },
  {
    id: "options",
    label: "Options",
  },
  {
    id: "futures",
    label: "Futures",
  },
  {
    id: "etfs",
    label: "ETFs",
  }
] as const

export const worths = [
  {
    value: "< 5000",
    label: "< 5000",
  },
  {
    value: "5000-25000",
    label: "5000-25000",
  },
  {
    value: "25000-50000",
    label: "25000-50000",
  },
  {
    value: "50000-150000",
    label: "50000-150000",
  },
  {
    value: "150000-500000",
    label: "150000-500000",
  },
  {
    value: "500000-1000000",
    label: "500000-1000000",
  },
  {
    value: "1000000-2000000",
    label: "1000000-2000000",
  },
] as const

export const phone_types = [
  { label: "Mobile", value: "mobile" },
  { label: "Home", value: "home" },
] as const


// Schemas
// Account Application
export const general_info_schema = z.object({

  email: z.string().min(1, {
    message: "Email cannot be empty.",
  }),

  country: z.string().min(2, {
    message: "Country cannot be empty.",
  }),

  account_type: z.string().min(2, {
    message: "You must select an account type.",
  }),

})
export const about_you_primary_schema = z.object({

  salutation: z.string().min(1, {
    message: "You must select a salutation.",
  }),

  FirstName: z.string().min(1, {
    message: "First name cannot be empty.",
  }),

  MiddleName: z.string().optional(),

  last_name: z.string().min(1, {
    message: "Last name cannot be empty.",
  }),

  address: z.string().min(1, {
    message: 'Address cannot be empty.'
  }),

  city: z.string().min(1, {
    message: 'City cannot be empty.'
  }),

  state: z.string().min(1, {
    message: 'State/Province cannot be empty.'
  }),

  zip:  z.string().min(1, {
    message: 'Zip code cannot be empty.'
  }),

  phone_type: z.string().min(1, {
    message: 'Phone type cannot be empty.'
  }),

  phone_country: z.string().min(1, {
    message: 'You must select a phone country.'
  }),
  
  phone_number: z.string().min(1, {
    message: 'Phone number cannot be empty.'
  }),

  citizenship: z.string().min(1, {
    message: 'You must select a citizenship.'
  }),

  country_of_birth: z.string().min(1, {
    message: 'You must select a country of birth.'
  }),


  dob_year: z.string().min(4, {
    message: "Year must be 4 digits.",
  }).max(4, {
    message: "Year must be 4 digits."
  }),
    
  dob_month: z.string().min(2, {
    message: "Month must be 2 digits.",
  }),

  dob_day: z.string().min(2, {
    message: "Day must be 2 digits.",
  }),

  marital_status: z.string().min(1, {
    message: 'You must select a marital status'
  }),

  number_of_dependents: z.string().min(1, {
    message: 'Number of dependents cannot be empty.'
  }),

  country_of_residence: z.string().min(1, {
    message: 'You must select a Country of Residence.'
  }),

  tax_id: z.string().min(1, {
    message: 'Tax ID cannot be empty.'
  }),

  id_country: z.string().min(1, {
    message: 'You must select an ID Country.'
  }),

  id_type: z.string().min(1, {
    message: 'You must select an ID type.'
  }),

  id_number: z.string().min(1, {
    message: 'ID number cannot be empty.'
  }),

  id_expiration_year: z.string().min(4, {
    message: "Year must be 4 digits.",
  }).max(4, {
    message: "Year must be 4 digits."
  }),
    
  id_expiration_month: z.string().min(2, {
    message: "Month must be 2 digits.",
  }),

  employment_status: z.string().min(1, {
    message: 'Employment status cannot be empty.'
  }),

  employer_name: z.string().min(1, {
    message: 'Employer name cannot be empty.'
  }),

  employer_address: z.string().min(1, {
    message: 'Employer address cannot be empty.'
  }),

  employer_city: z.string().min(1, {
    message: 'Employer city cannot be empty.'
  }),

  employer_state: z.string().min(1, {
    message: 'Employer state cannot be empty.'
  }),

  employer_country: z.string().min(1, {
    message: 'Employer name cannot be empty.'
  }),

  employer_zip: z.string().min(1, {
    message: 'Employer zip cannot be empty.'
  }),

  nature_of_business: z.string().min(1, {
    message: 'Nature of business cannot be empty.'
  }),

  occupation: z.string().min(1, {
    message: 'Occupation cannot be empty.'
  }),


  source_of_wealth: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }).default([]),

  currency: z.string().min(1, {
    message: 'You must select a currency.'
  }),


  security_q_1: z.string().min(1, {
    message: 'You must select a security question.'
  }),

  security_a_1: z.string().min(1, {
    message: 'You must select a security answer.'
  }),

  security_q_2: z.string().min(1, {
    message: 'You must select a security question.'
  }),

  security_a_2: z.string().min(1, {
    message: 'You must select a security answer.'
  }),

  security_q_3: z.string().min(1, {
    message: 'You must select a security question.'
  }),

  security_a_3: z.string().min(1, {
    message: 'You must select a security answer.'
  }),

})
export const about_you_secondary_schema = z.object({

  salutation: z.string().min(1, {
    message: "You must select a salutation.",
  }),

  first_name: z.string().min(1, {
    message: "First name cannot be empty.",
  }),

  middle_name: z.string().optional(),

  last_name: z.string().min(1, {
    message: "Last name cannot be empty.",
  }),

  address: z.string().min(1, {
    message: 'Address cannot be empty.'
  }),

  city: z.string().min(1, {
    message: 'City cannot be empty.'
  }),

  state: z.string().min(1, {
    message: 'State/Province cannot be empty.'
  }),

  zip:  z.string().min(1, {
    message: 'Zip code cannot be empty.'
  }),

  phone_type: z.string().min(1, {
    message: 'Phone type cannot be empty.'
  }),

  phone_country: z.string().min(1, {
    message: 'You must select a phone country.'
  }),
  
  phone_number: z.string().min(1, {
    message: 'Phone number cannot be empty.'
  }),

  citizenship: z.string().min(1, {
    message: 'You must select a citizenship.'
  }),

  country_of_birth: z.string().min(1, {
    message: 'You must select a country of birth.'
  }),


  dob_year: z.string().min(4, {
    message: "Year must be 4 digits.",
  }).max(4, {
    message: "Year must be 4 digits."
  }),
    
  dob_month: z.string().min(2, {
    message: "Month must be 2 digits.",
  }),

  dob_day: z.string().min(2, {
    message: "Day must be 2 digits.",
  }),

  marital_status: z.string().min(1, {
    message: 'You must select a marital status'
  }),

  number_of_dependents: z.string().min(1, {
    message: 'Number of dependents cannot be empty.'
  }),

  country_of_residence: z.string().min(1, {
    message: 'You must select a Country of Residence.'
  }),

  tax_id: z.string().min(1, {
    message: 'Tax ID cannot be empty.'
  }),

  id_country: z.string().min(1, {
    message: 'You must select an ID Country.'
  }),

  id_type: z.string().min(1, {
    message: 'You must select an ID type.'
  }),

  id_number: z.string().min(1, {
    message: 'ID number cannot be empty.'
  }),

  id_expiration_year: z.string().min(4, {
    message: "Year must be 4 digits.",
  }).max(4, {
    message: "Year must be 4 digits."
  }),
    
  id_expiration_month: z.string().min(2, {
    message: "Month must be 2 digits.",
  }),

  employment_status: z.string().min(1, {
    message: 'Employment status cannot be empty.'
  }),

  employer_name: z.string().min(1, {
    message: 'Employer name cannot be empty.'
  }),

  employer_address: z.string().min(1, {
    message: 'Employer address cannot be empty.'
  }),

  employer_city: z.string().min(1, {
    message: 'Employer city cannot be empty.'
  }),

  employer_state: z.string().min(1, {
    message: 'Employer state cannot be empty.'
  }),

  employer_zip: z.string().min(1, {
    message: 'Employer zip cannot be empty.'
  }),

  nature_of_business: z.string().min(1, {
    message: 'Nature of business cannot be empty.'
  }),

  occupation: z.string().min(1, {
    message: 'Occupation cannot be empty.'
  }),


  source_of_wealth: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }).default([]),

  currency: z.string().min(1, {
    message: 'You must select a currency.'
  }),

  email: z.string().min(1, {
    message: 'You must enter an email.'
  }),

  username: z.string().min(1, {
    message: 'You must enter a username.'
  }),

  password: z.string().min(1, {
    message: 'You must enter a password.'
  }),

})

export const regulatory_schema = z.object({
  annual_net_income: z.string().min(1, {
    message: "You must select a annual net income.",
  }),
  net_worth: z.string().min(1, {
    message: "You must select a net worth.",
  }),
  liquid_net_worth: z.string().min(1, {
    message: "You must select a liquid net worth.",
  }),

  investment_objectives: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You must select at least one investment objective.",
  }).default([]),

  products: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You must select at least one product.",
  }).default([]),
})

// Document Center
export const poa_schema = z.object({
  issued_date: z.string().min(1, {
    message: "You must select at least one investment objectives.",
  }),
})
export const new_poa_schema = z.object({
  account_number: z.ostring(),
  issued_date: z.string().min(1, {
    message: "You must select at least one investment objectives.",
  })
})

// Account accesses
export const temp_email_schema = z.object({

  temp_email: z.string(),

  temp_password: z.string(),

  account_number: z.string()

})
export const account_number_schema = z.object({

  account_number: z.string(),

})
export const account_access_schema = z.object({

  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(50),

  lastname: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).max(50),

  username: z.string(), 

  password: z.string(),

  account_number: z.string(),

})
export const risk_assesment_schema = z.object({
  account_number: z.string().optional(),
  type: z.enum(["1", "2.5", "4"], {
    required_error: "You must select a investor type.",
  }),
  loss: z.enum(["1", "2", "3", "4"], {
    required_error: "You must select a reaction to loss.",
  }),
  gain: z.enum(["1", "2", "3", "4"], {
    required_error: "You must select a reaction to gain.",
  }),
  period: z.enum(["1", "2", "3", "4"], {
    required_error: "You must select a term.",
  }),
  diversification: z.enum(["1", "2", "3"], {
    required_error: "You must select a portfolio.",
  }),
  goals: z.enum(["1", "2", "3"], {
    required_error: "You must select a term.",
  }),
})
export const risk_assesment_schema_spanish = z.object({
  numero_cuenta: z.string().optional(),
  tipo: z.enum(["1", "2.5", "4"], {
    required_error: "Debes seleccionar un tipo de inversor.",
  }),
  perdida: z.enum(["1", "2", "3", "4"], {
    required_error: "Debes seleccionar una reacción ante la pérdida.",
  }),
  ganancia: z.enum(["1", "2", "3", "4"], {
    required_error: "Debes seleccionar una reacción ante la ganancia.",
  }),
  periodo: z.enum(["1", "2", "3", "4"], {
    required_error: "Debes seleccionar un plazo.",
  }),
  diversificacion: z.enum(["1", "2", "3"], {
    required_error: "Debes seleccionar una cartera.",
  }),
  objetivos: z.enum(["1", "2", "3"], {
    required_error: "Debes seleccionar un plazo.",
  }),
})

// Functions
export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
          if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
          return [key, '']
      })
  )
}