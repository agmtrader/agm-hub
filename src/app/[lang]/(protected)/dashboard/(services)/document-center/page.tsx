"use client"
import React from 'react'
import DocumentCenter from '@/components/dashboard/document_center/DocumentCenter';

const page = () => {

  return (
    <div className='h-full w-full flex flex-col text-foreground justify-start gap-y-10 items-center'>
      <h1 className='text-7xl font-bold'>Document Center</h1>
      <p className='text-lg text-subtitle text-center'>Upload, download and manage documents from the database.</p>
      <DocumentCenter />
    </div>
  )
}

export default page