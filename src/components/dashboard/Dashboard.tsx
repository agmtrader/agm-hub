'use client'
import React from 'react'
import { Button } from '../ui/button'
import { GenerateReports } from '@/utils/tools/reporting'

export function Dashboard() {
  
  async function handleGenerateDailyReports() {
    await GenerateReports()
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1">
        <header className="flex items-center justify-between p-4 border-b border-muted">
          <Button onClick={handleGenerateDailyReports}>Generate Daily Reports</Button>
        </header>
      </div>
    </div>
  )
}
