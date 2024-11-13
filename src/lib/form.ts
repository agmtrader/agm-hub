import { z } from "zod"

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
] as const

export const account_types = (t: (key: string) => string) => [
  {
    value: "Individual",
    label: t('apply.account.general_info.account_types.individual')
  },
  {
    value: "Joint",
    label: t('apply.account.general_info.account_types.joint')
  },
  {
    value: "Trust",
    label: t('apply.account.general_info.account_types.trust')
  },
  {
    value: "Institutional",
    label: t('apply.account.general_info.account_types.institutional')
  }
]

export const salutations = [
    { label: "Mr.", value: "Mr" },
    { label: "Ms.", value: "Ms" },
    { label: "Mrs.", value: "Mrs" },
    { label: "Dr.", value: "Dr" },
] as const

export const marital_status = (t: (key: string) => string) => [
    { label: t('apply.account.about_you.marital_status_list.single'), value: "Single" },
    { label: t('apply.account.about_you.marital_status_list.married'), value: "Married" },
    { label: t('apply.account.about_you.marital_status_list.divorced'), value: "Divorced" },
    { label: t('apply.account.about_you.marital_status_list.widowed'), value: "Widowed" },
] as const

export const phone_types = (t: (key: string) => string) => [
  { label: t('apply.account.about_you.phone_types.mobile'), value: "Mobile" },
  { label: t('apply.account.about_you.phone_types.home'), value: "Home" },
] as const

export const id_type = (t: (key: string) => string) => [
    { label: t('apply.account.about_you.id_type_list.passport'), value: "Passport" },
    { label: t('apply.account.about_you.id_type_list.national_id'), value: "ID" },
    { label: t('apply.account.about_you.id_type_list.license'), value: "License" },
    { label: t('apply.account.about_you.id_type_list.alien'), value: "Alien" },
] as const

export const employment_status = (t: (key: string) => string) => [
    { label: t('apply.account.about_you.employment_status_list.employed'), value: "Employed" },
    { label: t('apply.account.about_you.employment_status_list.retired'), value: "Retired" },
    { label: t('apply.account.about_you.employment_status_list.self_employed'), value: "Self-employed" },
    { label: t('apply.account.about_you.employment_status_list.trader'), value: "Trader" },
    { label: t('apply.account.about_you.employment_status_list.student'), value: "Student" },
    { label: t('apply.account.about_you.employment_status_list.homemaker'), value: "Homemaker" },
    { label: t('apply.account.about_you.employment_status_list.unemployed'), value: "Unemployed" },
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

export const worths = [
  {
    value: "< $5,000",
    label: "< $5,000",
  },
  {
    value: "$5,000 - $24,999",
    label: "$5,000 - $24,999",
  },
  {
    value: "$25,000 - $49,999",
    label: "$25,000 - $49,999",
  },
  {
    value: "$50,000 - $99,999",
    label: "$50,000 - $99,999",
  },
  {
    value: "$100,000 - $149,999",
    label: "$100,000 - $149,999",
  },
  {
    value: "$150,000 - $499,999",
    label: "$150,000 - $499,999",
  },
  {
    value: "$500,000 - $1,000,000",
    label: "$500,000 - $1,000,000",
  },
  {
    value: "$1,000,000+",
    label: "$1,000,000+",
  },
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

// Dictionaries for Checklists
export const source_of_wealth = (t: (key: string) => string) => [
  {
    id: "Allowance",
    label: t('apply.account.regulatory.source_of_wealth.allowance')
  },
  {
    id: "Disability",
    label: t('apply.account.regulatory.source_of_wealth.disability')
  },
  {
    id: "Income",
    label: t('apply.account.regulatory.source_of_wealth.income')
  },
  {
    id: "Inheritance",
    label: t('apply.account.regulatory.source_of_wealth.inheritance')
  },
  {
    id: "Interest",
    label: t('apply.account.regulatory.source_of_wealth.interest')
  },
  {
    id: "Profits",
    label: t('apply.account.regulatory.source_of_wealth.profits')
  },
  {
    id: "Pension",
    label: t('apply.account.regulatory.source_of_wealth.pension')
  },
  {
    id: "Property",
    label: t('apply.account.regulatory.source_of_wealth.property')
  },
  {
    id: "Other",
    label: t('apply.account.regulatory.source_of_wealth.other')
  },
] as const

export const investment_objectives = (t: (key: string) => string) => [
  {
    id: "Capital",
    label: t('apply.account.regulatory.investment_objectives_list.capital')
  },
  {
    id: "Growth",
    label: t('apply.account.regulatory.investment_objectives_list.growth')
  },
  {
    id: "Hedging",
    label: t('apply.account.regulatory.investment_objectives_list.hedging')
  },
  {
    id: "Profits",
    label: t('apply.account.regulatory.investment_objectives_list.profits')
  }
] as const

export const products = (t: (key: string) => string) => [
  {
    id: "Bonds",
    label: t('apply.account.regulatory.products.bonds')
  },
  {
    id: "Stocks",
    label: t('apply.account.regulatory.products.stocks')
  },
  {
    id: "Options",
    label: t('apply.account.regulatory.products.options')
  },
  {
    id: "Futures",
    label: t('apply.account.regulatory.products.futures')
  },
  {
    id: "ETFs",
    label: t('apply.account.regulatory.products.etfs')
  }
] as const