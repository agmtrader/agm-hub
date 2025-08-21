'use client'
import InvestmentProposals from '@/components/dashboard/tools/investment-center/InvestmentProposals'
import DashboardPage from '@/components/misc/DashboardPage'

const page = () => {
  return (
    <DashboardPage title="Investment Proposals" description="Manage investment proposals">
      <InvestmentProposals />
    </DashboardPage>
  )
}

export default page