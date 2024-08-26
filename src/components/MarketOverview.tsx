'use client'
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import {getLastWorkingDay} from "@/utils/dates"

const MarketOverview = () => {

  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://laserfocus-api.onrender.com/market')
      const data = await response.json()
      setData(data['stocks']['last'])
    }
    fetchData()
  },[])

  return (
    <div className="bg-agm-dark-blue w-full h-full py-5 z-100 flex flex-row gap-x-5 items-center justify-evenly overflow-hidden">
      {data && Object.keys(data).map((key) => (
        <div className='flex gap-x-5 items-center justify-center'>
          <p className='text-white text-sm'>{key}</p>
          <p className='text-white text-sm'>{Number(data[key]).toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

export default MarketOverview