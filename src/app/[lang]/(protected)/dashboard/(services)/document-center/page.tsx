"use client"
import React from 'react'
import DocumentCenter from '@/components/dashboard/document_center/DocumentCenter';
import DashboardPage from '@/components/misc/DashboardPage';

const page = () => {

  return (
    <DashboardPage title='Document Center' description='Upload, download and manage documents from the database.'>
      <DocumentCenter />
    </DashboardPage>
  )
}

export default page