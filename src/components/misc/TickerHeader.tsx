'use client'

import React, { useEffect, useState } from 'react'
import { ReadStocksReport } from '@/utils/tools/reporting'

type Ticker = {
  ticker?: string
  price?: number | string | null
  Symbol?: string
  Last?: number | string | null
  Last_price?: number | string | null
  Change_percent?: number | string | null
  Financial_Instrument?: string
  Contract_description_1?: string
  'Financial Instrument'?: string
  'Company Name'?: string
}

const TickerHeader = () => {
  const [tickers, setTickers] = useState<Ticker[]>([])

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const data = await ReadStocksReport()
        setTickers(data ?? [])
      } catch {
        setTickers([])
      }
    }

    fetchTickers()
  }, [])

  const renderTickerItem = (ticker: Ticker, index: number, prefix: string) => (
    <div
      key={`${prefix}-${ticker.ticker ?? ticker['Financial Instrument'] ?? ticker.Symbol ?? 'ticker'}-${index}`}
      className="flex items-center gap-2 whitespace-nowrap px-4"
    >
      <span className="font-semibold">
        {ticker['Financial Instrument'] ?? ticker.Financial_Instrument ?? ticker.Symbol ?? ticker.ticker}
      </span>
      <span>${ticker.Last ?? ticker.Last_price ?? ticker.price}</span>
      <span className={Number(ticker.Change_percent) < 0 ? 'text-error' : 'text-success'}>
        {ticker.Change_percent}%
      </span>
    </div>
  )

  return (
    <div className="w-full border-b bg-foreground text-white">
      <div className="mx-auto flex h-8 items-center overflow-hidden px-5 text-xs uppercase tracking-wide">
        <div
          className="flex w-max min-w-full shrink-0 items-center"
          style={{ animation: 'ticker-scroll 28s linear infinite' }}
        >
          {tickers.map((ticker, index) => renderTickerItem(ticker, index, 'first'))}
          {tickers.map((ticker, index) => renderTickerItem(ticker, index, 'second'))}
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
      `}</style>
    </div>
  )
}

export default TickerHeader
