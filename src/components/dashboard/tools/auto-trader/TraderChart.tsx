'use client'

import { createChart, ColorType, CandlestickData, CandlestickSeries, LineSeries } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'
import { ContractData, TradingDecision } from '@/lib/tools/trader'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface TraderChartProps {
  contract?: ContractData
  indicator?: number[]
  title?: string
  decisions?: { time: string; decision: TradingDecision }[]
}

const TraderChart = ({ contract, indicator, title, decisions }: TraderChartProps) => {

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [showIndicators, setShowIndicators] = useState(true)
  const decisionColorMap: Record<TradingDecision, string> = {
    LONG: '#22c55e', // green
    SHORT: '#ef4444', // red
    STAY: '#3b82f6', // blue
    EXIT: '#facc15', // yellow
  }

  useEffect(() => {

    if (!chartContainerRef.current) throw new Error('Chart container not found')
    if (!contract?.data) throw new Error('No valid data source found')

    const computedStyle = getComputedStyle(document.documentElement)
    const foreground   = computedStyle.getPropertyValue('--foreground')
    const mutedColor = computedStyle.getPropertyValue('--muted')

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: `hsl(${foreground})`,
      },
      grid: {
        vertLines: { color: `hsl(${mutedColor})` },
        horzLines: { color: `hsl(${mutedColor})` },
      },
      rightPriceScale: {
        borderColor: `hsl(${foreground})`,
      },
      timeScale: {
        borderColor: `hsl(${foreground})`,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    })

    let candlestickData: CandlestickData[] = []

    if (contract?.data) {
      // Create a map to handle duplicate dates by keeping the last occurrence
      const dataMap = new Map<string, CandlestickData>()
      
      contract.data.forEach(point => {
        const timeKey = point.date.split(' ')[0] // Extract date part
        dataMap.set(timeKey, {
          time: timeKey,
          open: point.open,
          high: point.high,
          low: point.low,
          close: point.close,
        })
      })
      
      // Convert map to array and sort by time ascending
      candlestickData = Array.from(dataMap.values()).sort((a, b) => {
        const timeA = new Date(a.time as string).getTime()
        const timeB = new Date(b.time as string).getTime()
        return timeA - timeB
      })
    }

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    candlestickSeries.setData(candlestickData)

    // Add decision markers if provided
    if (decisions && decisions.length > 0) {
      // Group decisions by type for better visualization
      const decisionGroups: Record<TradingDecision, Array<{time: string, value: number}>> = {
        LONG: [],
        SHORT: [],
        STAY: [],
        EXIT: []
      }

      decisions.forEach(({ time, decision }) => {
        // Filter out STAY decisions - only show actionable trading decisions
        if (decision === 'STAY') return
        
        // Parse the time to extract just the date part for matching with candlestick data
        // Handle various formats: "Nov 17, 2021, 12:00 AM", "2021-11-17 12:00:00", etc.
        let timeKey = time
        if (time.includes(',')) {
          // Format like "Nov 17, 2021, 12:00 AM"
          const datePart = time.split(',').slice(0, 2).join(',').trim() // "Nov 17, 2021"
          timeKey = new Date(datePart).toISOString().split('T')[0] // Convert to "2021-11-17"
        } else if (time.includes(' ')) {
          // Format like "2021-11-17 12:00:00" or similar
          timeKey = time.split(' ')[0]
        }
        
        // Find the corresponding candlestick data to get price level
        const candleData = candlestickData.find(candle => {
          // Try exact match first
          if (candle.time === timeKey) return true
          
          // Try converting both to Date objects and comparing dates
          try {
            const candleDate = new Date(candle.time as string).toDateString()
            const decisionDate = new Date(timeKey).toDateString()
            return candleDate === decisionDate
          } catch {
            return false
          }
        })
        
        if (candleData) {
          const value = decision === 'LONG' ? candleData.low * 0.995 : // Show below candle for LONG
                       decision === 'SHORT' ? candleData.high * 1.005 : // Show above candle for SHORT
                       candleData.close // Show at close for EXIT
          
          decisionGroups[decision].push({
            time: candleData.time as string, // Use the candle's time format for consistency
            value: value
          })
        }
      })

      // Add series for each decision type
      Object.entries(decisionGroups).forEach(([decision, points]) => {
        if (points.length > 0) {
          // Sort points by time and remove duplicates
          const sortedPoints = points
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
            .filter((point, index, array) => {
              // Keep only the first occurrence of each timestamp
              return index === 0 || point.time !== array[index - 1].time
            })

          if (sortedPoints.length > 0) {
            const decisionSeries = chart.addSeries(LineSeries, {
              color: decisionColorMap[decision as TradingDecision],
              pointMarkersVisible: true,
              pointMarkersRadius: 4,
              lineVisible: false,
              lastValueVisible: false,
              title: `${decision} Decisions`
            })
            decisionSeries.setData(sortedPoints)
          }
        }
      })
    }

    // Add PSAR indicator if provided and enabled
    if (showIndicators && indicator && indicator.length > 0) {

      const indicatorBelow: any[] = []
      const indicatorAbove: any[] = []

      // Ensure we don't exceed the candlestick data length and properly align indicator data
      const maxLength = Math.min(indicator.length, candlestickData.length)
      
      for (let index = 0; index < maxLength; index++) {
        const candle = candlestickData[index]
        const value = indicator[index]
        
        if (!candle || value === undefined || value === null) continue

        const point = {
          time: candle.time,
          value: value,
        }

        // Determine if PSAR is below or above the close price
        if (value < candle.close) {
          indicatorBelow.push(point)
        } else {
          indicatorAbove.push(point)
        }
      }

      // Add blue series for PSAR points below the close price
      if (indicatorBelow.length > 0) {
        // Sort and deduplicate indicator data
        const sortedIndicatorBelow = indicatorBelow
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
          .filter((point, index, array) => {
            return index === 0 || point.time !== array[index - 1].time
          })
          
        const indicatorSeriesBelow = chart.addSeries(LineSeries, {
          color: '#3b82f6', // Blue color
          lineWidth: 2,
          pointMarkersVisible: true,
          pointMarkersRadius: 1,
          lineVisible: false,
          lastValueVisible: false,
        })
        indicatorSeriesBelow.setData(sortedIndicatorBelow)
      }

      // Add purple series for PSAR points above the close price
      if (indicatorAbove.length > 0) {
        // Sort and deduplicate indicator data
        const sortedIndicatorAbove = indicatorAbove
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
          .filter((point, index, array) => {
            return index === 0 || point.time !== array[index - 1].time
          })
          
        const indicatorSeriesAbove = chart.addSeries(LineSeries, {
          color: '#9333ea', // Purple color (original)
          lineWidth: 2,
          pointMarkersVisible: true,
          pointMarkersRadius: 1,
          lineVisible: false,
          lastValueVisible: false,
        })
        indicatorSeriesAbove.setData(sortedIndicatorAbove)
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
  }, [contract, indicator, showIndicators, decisions])

  if (!contract?.data) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg bg-background">
      <div className="p-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {title || `${contract?.symbol} Chart`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {contract?.data.length || 0} data points
            </p>
          </div>
          <div className="flex items-center gap-4">
            {(indicator && indicator.length > 0) && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-indicators"
                  checked={showIndicators}
                  onCheckedChange={(checked) => setShowIndicators(checked === 'indeterminate' ? true : checked)}
                />
                <Label htmlFor="show-indicators" className="text-sm">Indicators</Label>
              </div>
            )}
            {decisions && decisions.length > 0 && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">Decisions:</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#22c55e'}}></div>
                  <span>LONG</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#ef4444'}}></div>
                  <span>SHORT</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#facc15'}}></div>
                  <span>EXIT</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div ref={chartContainerRef} className="w-full h-[400px]" />
      </div>
    </div>
  )
}

export default TraderChart 