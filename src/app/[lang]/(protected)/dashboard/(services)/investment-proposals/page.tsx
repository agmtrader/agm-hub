'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'
import InvestmentProposals from '@/components/dashboard/investment-proposals/InvestmentProposals'

const InvestmentProposalsPage = () => {

  return (
    <DashboardPage title='Investment Proposals' description='View all investment proposals'>
      <InvestmentProposals/>
    </DashboardPage>
  )
}

export default InvestmentProposalsPage