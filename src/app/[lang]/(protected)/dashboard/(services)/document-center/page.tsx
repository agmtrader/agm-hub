"use client"
import React from 'react'
import DocumentCenter from '@/components/dashboard/document-center/DocumentCenter';
import DashboardPage from '@/components/misc/DashboardPage';

const page = () => {

  return (
    <DashboardPage title='Document Center' description='Manage documents connected to your account.'>
      <DocumentCenter />
    </DashboardPage>
  )
}

export default page