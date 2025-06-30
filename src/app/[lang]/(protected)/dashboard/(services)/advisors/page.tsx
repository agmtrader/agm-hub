'use client'

import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'
import AdvisorsPage from '@/components/dashboard/entities/advisors/AdvisorsPage'

const page = () => {

  return (
    <DashboardPage title='Advisor Center' description='Manage, contact and more'>
        <AdvisorsPage />
    </DashboardPage>
  )
}

export default page