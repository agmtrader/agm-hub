'use client'

import { createChart, ColorType, CandlestickData, CandlestickSeries, LineSeries } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

interface ChartProps {
  data: {
    [key: string]: Array<{
      date: string
      open: number
      high: number
      low: number
      close: number
    }>
  }
  indicators: number[][]
  decisionHistory: Array<{
    id: number
    decision: 'BUY' | 'SELL'
    created: string
    updated: string
  }>
}

const SingleChart = ({
  data,
  title,
  colors,
  indicator,
  decisions,
}: {
  data: CandlestickData[]
  title: string
  colors: { up: string; down: string }
  indicator?: number[]
  decisions?: Array<{
    id: number
    decision: 'BUY' | 'SELL'
    created: string
  }>
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Get computed colors from CSS variables
    const computedStyle = getComputedStyle(document.documentElement)
    const foregroundColor = computedStyle.getPropertyValue('--foreground')
    const mutedColor = computedStyle.getPropertyValue('--muted')

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: `hsl(${foregroundColor})`,
      },
      grid: {
        vertLines: { color: `hsl(${mutedColor})` },
        horzLines: { color: `hsl(${mutedColor})` },
      },
      rightPriceScale: {
        borderColor: `hsl(${foregroundColor})`,
      },
      timeScale: {
        borderColor: `hsl(${foregroundColor})`,
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
    })

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: colors.up,
      downColor: colors.down,
      borderVisible: false,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    })

    candlestickSeries.setData(data)

    if (indicator) {
      // Split indicator data into above and below points
      const abovePoints: Array<{ time: any; value: number }> = []
      const belowPoints: Array<{ time: any; value: number }> = []

      indicator.forEach((value, index) => {
        const candle = data[index]
        const point = {
          time: data[index].time,
          value: value,
        }
        
        if (value < candle.low) {
          belowPoints.push(point)
        } else {
          abovePoints.push(point)
        }
      })

      // Add series for points above price
      if (abovePoints.length > 0) {
        const aboveSeries = chart.addSeries(LineSeries, {
          color: '#9333ea',
          lineWidth: 2,
          pointMarkersVisible: true,
          pointMarkersRadius: 2,
          lineVisible: false,
        })
        aboveSeries.setData(abovePoints)
      }

      // Add series for points below price
      if (belowPoints.length > 0) {
        const belowSeries = chart.addSeries(LineSeries, {
          color: '#2962FF', // Purple color
          lineWidth: 2,
          pointMarkersVisible: true,
          pointMarkersRadius: 2,
          lineVisible: false,
        })
        belowSeries.setData(belowPoints)
      }
    }

    // Add decision markers
    if (decisions) {
      const markerSeries = chart.addSeries(LineSeries, {
        color: '#22c55e', // Green color for BUY decisions
        lineWidth: 1,
        pointMarkersVisible: true,
        lineVisible: false,
        pointMarkersRadius: 4,
        lastValueVisible: false,
      })

      // Sort decisions by date first
      const sortedDecisions = [...decisions].sort((a, b) => 
        new Date(a.created).getTime() - new Date(b.created).getTime()
      )

      const decisionPoints = sortedDecisions
        .filter(d => d.decision === 'BUY')
        .map(decision => {
          const date = decision.created.split(' ')[0]
          const dataPoint = data.find(d => d.time === date)
          
          console.log('Processing decision:', {
            created: decision.created,
            date,
            foundDataPoint: !!dataPoint,
            dataPointTime: dataPoint?.time,
            existingValue: dataPoint?.high
          })
          
          return dataPoint ? {
            time: date,
            value: dataPoint.high * 1.01 // Place marker slightly above the candle
          } : null
        })
        .filter((point): point is { time: string, value: number } => point !== null)
        // Ensure unique timestamps by keeping only the first occurrence
        .filter((point, index, self) => 
          index === self.findIndex(p => p.time === point.time)
        )

      console.log('Final decision points:', decisionPoints)

      if (decisionPoints.length > 0) {
        markerSeries.setData(decisionPoints)
      }
    }

    chart.timeScale().fitContent()

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      chart.remove()
      window.removeEventListener('resize', handleResize)
    }
  }, [data, colors, indicator, decisions])

  return (
    <div className="w-full h-[400px] p-4 rounded-lg bg-background">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div ref={chartContainerRef} className="w-full h-[350px]" />
    </div>
  )
}

const Chart = ({ data, indicators, decisionHistory }: ChartProps) => {
  const chartData = Object.entries(data).map(([symbol, contractData], index) => ({
    symbol,
    data: contractData.map(candle => ({
      time: candle.date.split(' ')[0],
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    })),
    indicator: indicators[index],
    decisions: decisionHistory
  }))

  return (
    <div className="flex flex-col gap-4">
      {chartData.map(({ symbol, data, indicator, decisions }) => (
        <SingleChart
          key={symbol}
          data={data}
          indicator={indicator}
          decisions={decisions}
          title={`${symbol} Chart`}
          colors={{ up: '#26a69a', down: '#ef5350' }}
        />
      ))}
    </div>
  )
}

export default Chart