'use client'
import React from 'react'
import Account from '../auth/Account'

export function Dashboard() {
  return (
    <div className="flex w-full h-full">
      <div className="flex-1">
        <header className="flex items-center justify-between p-4 border-b border-muted">
          <Account />
        </header>
      </div>
    </div>
  )
}
