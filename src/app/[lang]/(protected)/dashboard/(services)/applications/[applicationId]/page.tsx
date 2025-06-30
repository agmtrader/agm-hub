import React from 'react'
import ApplicationPage from '@/components/dashboard/entities/applications/ApplicationPage'
import DashboardPage from '@/components/misc/DashboardPage'

type Props = {
  params: Promise<{
    applicationId: string
  }>
}

const page = async ({ params }: Props) => { 

  const { applicationId } = await params
  if (!applicationId) return <div>Application not found</div>

  return (
    <DashboardPage title="Application Details" description="">
      <ApplicationPage applicationId={applicationId} />
    </DashboardPage>
  )
}

export default page