'use client'

import React, { useEffect, useState } from 'react'

interface Candle {
  open: number
  close: number
  high: number
  low: number
  x: number
}

export const CandlesBackground = () => {
  const [allCandles, setAllCandles] = useState<Candle[]>([])
  const visibleCount = 60
  const bufferCount = 50 // Buffer for SMA calculation
  const smaPeriod = 10

  useEffect(() => {
    const generateCandles = () => {
      const totalCount = visibleCount + bufferCount
      const data: Candle[] = []
      let currentPrice = 50
      
      for (let i = 0; i < totalCount; i++) {
        // Occasional large spikes for extra volatility
        const isSpike = Math.random() < 0.2 // Slightly increased spike chance
        const volatility = isSpike ? 60 : 25 // Significantly increased base and spike volatility
        // Reduced upward bias slightly to allow for more downward movements/pullbacks
        const move = (Math.random() - 0.4) * volatility 
        const open = currentPrice
        const close = currentPrice + move
        
        // Increased wick extensions for more dramatic highs/lows
        const wickExtension = isSpike ? 20 : 12 
        const high = Math.max(open, close) + Math.random() * wickExtension
        const low = Math.min(open, close) - Math.random() * wickExtension
        
        data.push({
          open,
          close,
          high,
          low,
          x: 0 // Will be calculated for visible candles
        })
        
        currentPrice = close
      }
      setAllCandles(data)
    }

    generateCandles()
  }, [])

  // Get only the candles we want to display
  const visibleCandles = allCandles.slice(bufferCount).map((c, i) => ({
    ...c,
    x: i * (100 / visibleCount)
  }))

  if (visibleCandles.length === 0) return null

  const minPrice = Math.min(...visibleCandles.map(c => c.low))
  const maxPrice = Math.max(...visibleCandles.map(c => c.high))
  const range = maxPrice - minPrice

  const getY = (price: number) => {
    return 100 - ((price - minPrice) / range) * 80 - 10 // Keep within 10-90% vertical range
  }

  const smaPoints = visibleCandles.map((_, i) => {
    const fullIndex = i + bufferCount
    // Calculate SMA using the full dataset (including buffer)
    const slice = allCandles.slice(fullIndex - smaPeriod + 1, fullIndex + 1)
    if (slice.length < smaPeriod) return null
    
    const sum = slice.reduce((acc, curr) => acc + curr.close, 0)
    return {
      x: i * (100 / visibleCount) + 0.5,
      y: getY(sum / smaPeriod)
    }
  }).filter((p): p is {x: number, y: number} => p !== null)

  const smaPath = smaPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ')

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {visibleCandles.map((candle, i) => {
          const yOpen = getY(candle.open)
          const yClose = getY(candle.close)
          const yHigh = getY(candle.high)
          const yLow = getY(candle.low)
          
          const bodyTop = Math.min(yOpen, yClose)
          const bodyHeight = Math.abs(yClose - yOpen)
          const color = "fill-gray-400 stroke-gray-400"

          return (
            <g key={i} className={color}>
              {/* Wick */}
              <line 
                x1={candle.x + 0.5} 
                y1={yHigh} 
                x2={candle.x + 0.5} 
                y2={yLow} 
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {/* Body */}
              <rect
                x={candle.x}
                y={bodyTop}
                width={0.5}
                height={Math.max(bodyHeight, 0.5)} // Min height ensuring visibility
              />
            </g>
          )
        })}
        {/* SMA Line */}
        <path
          d={smaPath}
          fill="none"
          className="stroke-secondary"
          strokeWidth="5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
