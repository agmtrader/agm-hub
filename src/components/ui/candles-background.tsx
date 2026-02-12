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
  const [candles, setCandles] = useState<Candle[]>([])

  useEffect(() => {
    const generateCandles = () => {
      const count = 40
      const data: Candle[] = []
      let currentPrice = 50
      
      for (let i = 0; i < count; i++) {
        // Occasional large spikes for extra volatility
        const isSpike = Math.random() < 0.15
        const volatility = isSpike ? 30 : 18
        const move = (Math.random() - 0.35) * volatility // Upward bias with high volatility
        const open = currentPrice
        const close = currentPrice + move
        const wickExtension = isSpike ? 12 : 8
        const high = Math.max(open, close) + Math.random() * wickExtension
        const low = Math.min(open, close) - Math.random() * wickExtension
        
        data.push({
          open,
          close,
          high,
          low,
          x: i * (100 / count)
        })
        
        currentPrice = close
      }
      setCandles(data)
    }

    generateCandles()
  }, [])

  const minPrice = Math.min(...candles.map(c => c.low))
  const maxPrice = Math.max(...candles.map(c => c.high))
  const range = maxPrice - minPrice

  const getY = (price: number) => {
    return 100 - ((price - minPrice) / range) * 80 - 10 // Keep within 10-90% vertical range
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-20">
      <svg className="w-full h-full" preserveAspectRatio="none">
        {candles.map((candle, i) => {
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
                x1={`${candle.x + 1}%`} 
                y1={`${yHigh}%`} 
                x2={`${candle.x + 1}%`} 
                y2={`${yLow}%`} 
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {/* Body */}
              <rect
                x={`${candle.x}%`}
                y={`${bodyTop}%`}
                width="2%"
                height={`${Math.max(bodyHeight, 0.5)}%`} // Min height ensuring visibility
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
