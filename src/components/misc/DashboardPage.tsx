'use client'
import React from 'react'

interface Props {
  title: string
  description: string
  children: React.ReactNode
}

const DashboardPage = ({title, description, children}: Props) => {

  return (
    <div className='flex flex-col gap-4 w-full h-full p-4 text-foreground'>
      <p className='text-3xl font-bold'>{title}</p>
      <p className='text-sm'>{description}</p>
      {children}
    </div>
  )
}

export default DashboardPage