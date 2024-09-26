'use client'
import React, { useState } from 'react'

const MarketOverview = () => {

  const [data, setData] = useState<any>(null)

  return (
    <div className="w-full h-full py-5 z-100 flex flex-row gap-x-5 items-center justify-evenly overflow-hidden">
      {data && Object.keys(data).map((key) => (
        <div className='flex gap-x-5 items-center justify-center'>
          <p className='text-foreground text-sm'>{key}</p>
          <p className='text-foreground text-sm'>{Number(data[key]).toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

export default MarketOverview