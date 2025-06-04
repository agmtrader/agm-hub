'use client'
import { DataTable } from '@/components/misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'
import { Account, IndividualAccountApplicationInfo } from '@/lib/entities/account'
import { ReadAccountInfoByID } from '@/utils/entities/account'
import React, { useEffect, useState } from 'react'

import { GeneralInfo, AboutYouPrimary, Regulatory } from '@/lib/entities/account'

interface Props {
  account: Account
}

const AccountApplicationInfo = ( { account } : Props) => {

  const [accountInfo, setAccountInfo] = useState<IndividualAccountApplicationInfo | null>(null)
  
  useEffect(() => {
    const fetchAccountInfo = async () => {
      const accountInfo = await ReadAccountInfoByID(account.id)
      setAccountInfo(accountInfo)
    }
    fetchAccountInfo()
  }, [account])

  if (!accountInfo) {
    return (
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <LoadingComponent />
      </div>
    )
  }

  // Separate data into three categories
  const generalInfo: GeneralInfo = {
    email: accountInfo.email,
    country: accountInfo.country,
    account_type: accountInfo.account_type,
    referrer: accountInfo.referrer,
  }
 
  const aboutYou: AboutYouPrimary = {
    salutation: accountInfo.salutation,
    first_name: accountInfo.first_name,
    middle_name: accountInfo.middle_name,
    last_name: accountInfo.last_name,
    address: accountInfo.address,
    city: accountInfo.city,
    state: accountInfo.state,
    zip: accountInfo.zip,
    phone_type: accountInfo.phone_type,
    phone_country: accountInfo.phone_country,
    phone_number: accountInfo.phone_number,
    citizenship: accountInfo.citizenship,
    occupation: accountInfo.occupation,
    country_of_birth: accountInfo.country_of_birth,
    date_of_birth: accountInfo.date_of_birth,
    marital_status: accountInfo.marital_status,
    number_of_dependents: accountInfo.number_of_dependents,
    source_of_wealth: accountInfo.source_of_wealth,
    country_of_residence: accountInfo.country_of_residence,
    tax_id: accountInfo.tax_id,
    id_country: accountInfo.id_country,
    id_type: accountInfo.id_type,
    id_number: accountInfo.id_number,
    id_expiration_date: accountInfo.id_expiration_date,
    employment_status: accountInfo.employment_status,
    employer_name: accountInfo.employer_name,
    employer_address: accountInfo.employer_address,
    employer_city: accountInfo.employer_city,
    employer_state: accountInfo.employer_state,
    employer_country: accountInfo.employer_country,
    employer_zip: accountInfo.employer_zip,
    nature_of_business: accountInfo.nature_of_business,
    currency: accountInfo.currency,
    security_q_1: accountInfo.security_q_1,
    security_a_1: accountInfo.security_a_1,
    security_q_2: accountInfo.security_q_2,
    security_a_2: accountInfo.security_a_2,
    security_q_3: accountInfo.security_q_3,
    security_a_3: accountInfo.security_a_3,
  }

  const regulatory: Regulatory = {
    annual_net_income: accountInfo.annual_net_income,
    net_worth: accountInfo.net_worth,
    liquid_net_worth: accountInfo.liquid_net_worth,
    investment_objectives: accountInfo.investment_objectives,
    products: accountInfo.products,
    amount_to_invest: accountInfo.amount_to_invest,
  }

  return (
    <Card className='w-full max-w-7xl'>
      <CardContent className='flex flex-col gap-4'>
        <DataTable data={[generalInfo]} />
        <DataTable data={[aboutYou]} />
        <DataTable data={[regulatory]} />
      </CardContent>
    </Card>
  )
}

export default AccountApplicationInfo