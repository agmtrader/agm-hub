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
    { label: "Individual", value: "Individual" },
    { label: "Joint", value: "Joint" },
    { label: "Trust", value: "Trust" },
    { label: "Institutional", value: "Institutional" },
] as const
export const salutations = [
    { label: "Mr.", value: "Mr" },
    { label: "Ms.", value: "Ms" },
    { label: "Mrs.", value: "Mrs" },
    { label: "Dr.", value: "Dr" },
] as const
export const marital_status = [
    { label: "Single", value: "Single" },
    { label: "Married", value: "Married" },
    { label: "Divorced", value: "Divorced" },
    { label: "Widowed", value: "Widowed" },
] as const
export const id_type = [
    { label: "Passport", value: "Passport" },
    { label: "National ID", value: "ID" },
    { label: "Driver's License", value: "License" },
    { label: "Alien ID Card", value: "Alien" },
] as const
export const employment_status = [
    { label: "Employed", value: "Employed" },
    { label: "Retired", value: "Retired" },
    { label: "Self-employed", value: "Self-employed" },
    { label: "At-Home Trader", value: "Trader" },
    { label: "Student / Intern", value: "Employed" },
    { label: "Homemaker", value: "Homemaker" },
    { label: "Unemployed", value: "Unemployed" },
] as const
export const currencies = [
  { label: "USD", value: "USD" },
  { label: "AED", value: "AED" },
  { label: "AUD", value: "AUD" },
  { label: "CAD", value: "CAD" },
  { label: "CHF", value: "CHF" },
  { label: "CNH", value: "CNH" },
  { label: "CZK", value: "CZK" },
  { label: "DKK", value: "DKK" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "HKD", value: "HKD" },
  { label: "HUF", value: "HUF" },
  { label: "ILS", value: "ILS" },
  { label: "JPY", value: "JPY" },
  { label: "MXN", value: "MXN" },
  { label: "NOK", value: "NOK" },
  { label: "NZD", value: "NZD" },
  { label: "PLN", value: "PLN" },
  { label: "SAR", value: "SAR" },
  { label: "SEK", value: "SEK" },
  { label: "SGD", value: "SGD" },
  { label: "TRY", value: "TRY" },
  { label: "ZAR", value: "ZAR" },
  { label: "KRW", value: "KRW" },
] as const
export const source_of_wealth = [
  {
    id: "Allowance",
    label: "Allowance / Spousal Income",
  },
  {
    id: "Disability",
    label: "Disability / Severance / Unemployment",
  },
  {
    id: "Income",
    label: "Income from Employment",
  },
  {
    id: "Inheritance",
    label: "Inheritance / Gift",
  },
  {
    id: "Interest",
    label: "Interest / Divident Income",
  },
  {
    id: "Profits",
    label: "Market Trading Profits",
  },
  {
    id: "Pension",
    label: "Pension / Government Retirement benefit",
  },
  {
    id: "Property",
    label: "Property",
  },
  {
    id: "Other",
    label: "Other",
  },
] as const
export const investment_objectives = [
  {
    id: "Capital",
    label: "Preservation of Capital and Income Generation",
  },
  {
    id: "Growth",
    label: "Growth",
  },
  {
    id: "Hedging",
    label: "Hedging",
  },
  {
    id: "Profits",
    label:"Profits from Active Trading and Speculation"
  }
  
] as const
export const products = [
  {
    id: "Bonds",
    label: "Bonds",
  },
  {
    id: "Stocks",
    label: "Stocks",
  },
  {
    id: "Options",
    label: "Options",
  },
  {
    id: "Futures",
    label: "Futures",
  },
  {
    id: "ETFs",
    label: "ETFs",
  }
] as const
export const worths = [
  {
    value: "< 5,000",
    label: "< 5,000",
  },
  {
    value: "5,000 - 24,999",
    label: "5,000 - 24,999",
  },
  {
    value: "25,000 - 49,999",
    label: "25,000 - 49,999",
  },
  {
    value: "50,000 - 99,999",
    label: "50,000 - 99,999",
  },
  {
    value: "100,000 - 149,999",
    label: "100,000 - 149,999",
  },
  {
    value: "150,000 - 499,999",
    label: "150,000 - 499,999",
  },
  {
    value: "500,000 - 1,000,000",
    label: "500,000 - 1,000,000",
  },
  {
    value: "1,000,000+",
    label: "1,000,000+",
  },
] as const
export const phone_types = [
  { label: "Mobile", value: "Mobile" },
  { label: "Home", value: "Home" },
] as const
export const security_questions = [
  { label: "In what city were you married?", value: "In what city were you married?" },
  { label: "What is the name of first boyfriend/girlfriend?", value: "What is name of first boyfriend/girlfriend?" },
  { label: "What is the last name of your favorite politician?", value: "What is the last name of your favorite politician?" },
  { label: "What is the middle name of your eldest child?", value: "What is the middle name of your eldest child?" },
  { label: "What is the name of a school you attended?", value: "What is the name of a school you attended?" },
  { label: "What is the name of your favorite sports team?", value: "What is the name of your favorite sports team?" },
  { label: "What is your favorite cartoon character?", value: "What is your favorite cartoon character?" },
  { label: "What is your favorite place to shop?", value: "What is your favorite place to shop?" },
  { label: "What is your grandmother's first name?", value: "What is your grandmother's first name?" },
  { label: "What was the first concert you attended?", value: "What was the first concert you attended?" },
  { label: "What was the name of a best friend during childhood?", value: "What was the name of a best friend during childhood?" },
  { label: "What was your High School mascot?", value: "What was your High School mascot?" },
  { label: "What was the name of your first pet?", value: "What was the name of your first pet?" },
  { label: "What was your childhood nickname?", value: "What was your childhood nickname?" },
  { label: "What was your father's occupation?", value: "What was your father's occupation?" },
  { label: "Where did you go on your honeymoon?", value: "Where did you go on your honeymoon?" },
  { label: "Where is your favorite vacation spot?", value: "Where is your favorite vacation spot?" },
  { label: "Who was your childhood hero?", value: "Who was your childhood hero?" },
  { label: "What was the first stock you ever bought?", value: "What was the first stock you ever bought?" },
  { label: "Where were you when you had your first kiss?", value: "Where were you when you had your first kiss?" },
  { label: "Name a city you've never visited but would like to?", value: "Name a city you've never visited but would like to?" },
  { label: "Name a college you applied to but did not attend?", value: "Name a college you applied to but did not attend?" },
  { label: "What is the name of the teacher who gave you your first A grade?", value: "What is the name of the teacher who gave you your first A grade?" },
  { label: "What was the name of your first boss?", value: "What was the name of your first boss?" },
  { label: "Name a favorite teacher?", value: "Name a favorite teacher?" },
  { label: "What is the title of your favorite book?", value: "What is the title of your favorite book?" },
  { label: "Who is your favorite musician?", value: "Who is your favorite musician?" },
  { label: "What is your favorite restaurant?", value: "What is your favorite restaurant?" },
  { label: "In what city or town did your mother and father meet?", value: "In what city or town did your mother and father meet?" },
  { label: "Which Olympic athlete do you admire most?", value: "Which Olympic athlete do you admire most?" },
  { label: "Who was your favorite Nobel Prize winner?", value: "Who was your favorite Nobel Prize winner?" },
  { label: "What is your favorite candy?", value: "What is your favorite candy?" },
  { label: "Which museum did you first visit?", value: "Which museum did you first visit?" },
  { label: "Which is your favorite movie?", value: "Which is your favorite movie?" },
  { label: "What meal did you first cook?", value: "What meal did you first cook?" },
  { label: "What age were you when you first traveled internationally?", value: "What age were you when you first traveled internationally?" },
  { label: "What is the favorite account that you follow on Twitter?", value: "What is the favorite account that you follow on Twitter?" },
  { label: "Who is your favorite artist?", value: "Who is your favorite artist?" },
  { label: "Who is your favorite architect?", value: "Who is your favorite architect?" },
  { label: "Where did you celebrate New Year's Eve In The Year 2000?", value: "Where did you celebrate New Year's Eve In The Year 2000?" },
  { label: "What is your spouse's middle name?", value: "What is your spouse's middle name?" },
] as const

  
// Schemas
// Account Application
export const general_info_schema = z.object({
  
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).min(1, {
    message: "Email cannot be empty.",
  }),

  country: z.string().min(1, {
    message: "Country cannot be empty.",
  }),

  account_type: z.string().min(1, {
    message: "You must select an account type.",
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
export const about_you_primary_schema = base_about_you_schema.extend({
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
export const about_you_secondary_schema = base_about_you_schema.extend({
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }).min(1, {
    message: 'You must enter an email.'
  }),
  username: z.string().min(4, {
    message: 'Username must be at least 4 characters long.'
  }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
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

  amount_to_invest: z.string().min(1, {
    message: "You must enter an amount to invest.",
  }),
})


// TODO
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
  type: z.enum(["???"]),
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
export const risk_assesment_schema = z.object({
  account_number: z.string().min(1, {
    message: 'Account number cannot be empty.'
  }),
  client_name: z.string().optional(),
  type: z.enum(["1", "2.5", "4"], {
    errorMap: (issue, ctx) => {
      return {message: 'You must select a type.'};
    },
  }),
  loss: z.enum(["1", "2", "3", "4"], {
    errorMap: (issue, ctx) => {
      return {message: 'You must select your reaction to loss.'};
    },
  }),
  gain: z.enum(["1", "2", "3", "4"], {
    errorMap: (issue, ctx) => {
      return {message: 'You must select your reaction to gain.'};
    },
  }),
  period: z.enum(["1", "2", "3", "4"], {
    errorMap: (issue, ctx) => {
      return {message: 'You must select a period.'};
    },
  }),
  diversification: z.enum(["1", "2", "3"], {
    errorMap: (issue, ctx) => {
      return {message: 'You must select a portfolio.'};
    },
  }),
  goals: z.enum(["1", "2", "3"], {
    errorMap: (issue, ctx) => {
      return {message: 'You must select a term.'};
    },
  }),
})

// Functions
export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
          if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
          return [key, undefined]
      })
  )
}