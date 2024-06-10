import React from 'react'
import { cn } from "@/lib/utils"
import {getLastWorkingDay} from "@/utils/dates"

const MarketOverview = async () => {

  const data = await fetch('https://laserfocus-api.onrender.com/athena/market', {
    headers:{'Cache-Control': 'no-cache'}
  }).then(response => response.json()).then(async (data) => await data)

  function getData(ticker:string, date:string, type:string) {
    if (data) {
      return Number(Number(data[ticker]['20240509'][type]).toFixed(2))
    } else {
      return null
    }
  }

  const date = getLastWorkingDay()

  return (
    <div className="bg-agm-dark-blue w-full h-full py-5 z-100 flex flex-row gap-x-5 items-center justify-evenly overflow-hidden">
      {data &&
        Object.keys(data).map((ticker) => (
          <div className='flex flex-row gap-x-[0.5vw]' key={ticker}>
            <p className='text-white text-sm'> {ticker}: </p>
            <p className='text-white text-sm'> {getData(ticker, date, 'Close')}</p>
            <p className='text-white text-sm'>|</p>
            <p className={cn(getData(ticker, date, 'Change %')! > 0 ? 'text-green-500':'text-red-500', 'text-sm')}> {getData(ticker, date, 'Change %')}%</p>
          </div>
      ))}
    </div>
  )
}

export default MarketOverview