'use client'

import { createChart, ColorType, CandlestickData, CandlestickSeries, LineSeries, Time, UTCTimestamp } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'
import { ContractData, TradingDecision } from '@/lib/tools/trader'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface TraderChartProps {
  contract?: ContractData
  indicator?: number[]
  title?: string
  decisions?: { time: string; decision: TradingDecision }[]
  timeframe?: string
}

const TraderChart = ({ contract, indicator, title, decisions, timeframe }: TraderChartProps) => {

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [showIndicators, setShowIndicators] = useState(true)
  const decisionColorMap: Record<TradingDecision, string> = {
    LONG: '#22c55e', // green
    SHORT: '#ef4444', // red
    STAY: '#3b82f6', // blue
    EXIT: '#facc15', // yellow
  }

  // Function to automatically detect timeframe from data intervals
  const detectTimeframe = (data: any[]): string => {
    if (!data || data.length < 2) return 'Unknown'
    
    // Calculate intervals between consecutive data points
    const intervals: number[] = []
    for (let i = 1; i < Math.min(data.length, 10); i++) { // Check first 10 intervals for accuracy
      const prev = new Date(data[i - 1].date || data[i - 1].time).getTime()
      const curr = new Date(data[i].date || data[i].time).getTime()
      const interval = curr - prev
      if (interval > 0) intervals.push(interval)
    }
    
    if (intervals.length === 0) return 'Unknown'
    
    // Get the most common interval (mode)
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    
    // Convert milliseconds to readable timeframe
    const minutes = avgInterval / (1000 * 60)
    const hours = minutes / 60
    const days = hours / 24
    
    if (minutes < 60) {
      return `${Math.round(minutes)}m`
    } else if (hours < 24) {
      return `${Math.round(hours)}h`
    } else if (days < 7) {
      return `${Math.round(days)}d`
    } else {
      const weeks = days / 7
      return `${Math.round(weeks)}w`
    }
  }

  // Get timeframe from data or use provided timeframe
  const detectedTimeframe = contract?.data ? detectTimeframe(contract.data) : 'Unknown'
  const displayTimeframe = timeframe || detectedTimeframe

  useEffect(() => {

    if (!chartContainerRef.current) throw new Error('Chart container not found')
    if (!contract?.data) throw new Error('No valid data source found')

    const computedStyle = getComputedStyle(document.documentElement)
    const foreground   = computedStyle.getPropertyValue('--foreground')
    const mutedColor = computedStyle.getPropertyValue('--muted')

    // Configure timeScale based on detected timeframe
    const getTimeScaleOptions = (timeframe: string) => {
      const baseOptions = {
        borderColor: `hsl(${foreground})`,
        timeVisible: true,
        secondsVisible: false,
      }

      // Configure time formatting based on timeframe
      if (timeframe.includes('m')) { // Minutes
        return {
          ...baseOptions,
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: (time: any) => {
            // Create date from UTC timestamp and format as UTC (which now represents market time)
            const date = new Date(time * 1000)
            return date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })
          }
        }
      } else if (timeframe.includes('h')) { // Hours
        return {
          ...baseOptions,
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: (time: any) => {
            // Create date from UTC timestamp and format as UTC (which now represents market time)
            const date = new Date(time * 1000)
            return date.toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              hour12: false 
            })
          }
        }
      } else { // Days, weeks, etc.
        return {
          ...baseOptions,
          timeVisible: false,
          secondsVisible: false,
        }
      }
    }

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
      timeScale: getTimeScaleOptions(displayTimeframe),
      width: chartContainerRef.current.clientWidth,
      height: 400,
    })

    let candlestickData: CandlestickData[] = []

    if (contract?.data) {
      // Process data based on detected timeframe
      const processTimeData = (dateString: string, timeframe: string): Time => {
        
        if (timeframe.includes('m') || timeframe.includes('h')) {
          // For intraday data, treat the time as local market time without timezone conversion
          if (dateString.includes(' ')) {
            // Format like "2024-08-06 09:30:00"
            // Parse manually to avoid timezone issues
            const [datePart, timePart] = dateString.split(' ')
            const [year, month, day] = datePart.split('-').map(Number)
            const [hours, minutes, seconds = 0] = timePart.split(':').map(Number)
            
            // Create UTC date directly with the same time values (no timezone conversion)
            const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds || 0))
            const timestamp = Math.floor(utcDate.getTime() / 1000)
            
            return timestamp as UTCTimestamp
          } else {
            // Fallback for other formats
            const date = new Date(dateString)
            return Math.floor(date.getTime() / 1000) as UTCTimestamp
          }
        } else {
          // For daily+ data, use date only
          const date = new Date(dateString)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}` as Time
        }
      }

      // Create a map to handle duplicate timestamps
      const dataMap = new Map<string, CandlestickData>()
      
      contract.data.forEach(point => {
        const timeKey = processTimeData(point.date, displayTimeframe)
        const timeKeyString = typeof timeKey === 'number' ? timeKey.toString() : timeKey as string
        dataMap.set(timeKeyString, {
          time: timeKey,
          open: point.open,
          high: point.high,
          low: point.low,
          close: point.close,
        })
      })
      
      // Convert map to array and sort by time ascending
      candlestickData = Array.from(dataMap.values()).sort((a, b) => {
        if (typeof a.time === 'string' && typeof b.time === 'string') {
          return new Date(a.time).getTime() - new Date(b.time).getTime()
        } else if (typeof a.time === 'number' && typeof b.time === 'number') {
          return a.time - b.time
        } else {
          // Mixed types, convert to Date for comparison
          const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : (a.time as number) * 1000
          const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : (b.time as number) * 1000
          return timeA - timeB
        }
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
      const decisionGroups: Record<TradingDecision, Array<{time: Time, value: number}>> = {
        LONG: [],
        SHORT: [],
        STAY: [],
        EXIT: []
      }

      decisions.forEach(({ time, decision }) => {
        // Filter out STAY decisions - only show actionable trading decisions
        if (decision === 'STAY') return
        
        // Parse the decision time using the same UTC logic as candlestick data
        // The time comes from formatDateFromTimestamp which creates local time strings like "Aug 6, 2024, 9:30 AM"
        // We need to convert this back to the same format as the candlestick data
        let processedDecisionTime: Time | null = null
        
        try {
          // Parse the formatted date string back to a Date object
          const decisionDate = new Date(time)
          
          if (displayTimeframe.includes('m') || displayTimeframe.includes('h')) {
            // For intraday data, create UTC timestamp matching the candlestick processing
            const utcDate = new Date(Date.UTC(
              decisionDate.getFullYear(),
              decisionDate.getMonth(),
              decisionDate.getDate(),
              decisionDate.getHours(),
              decisionDate.getMinutes(),
              decisionDate.getSeconds()
            ))
            processedDecisionTime = Math.floor(utcDate.getTime() / 1000) as UTCTimestamp
          } else {
            // For daily+ data, use date string format
            const year = decisionDate.getFullYear()
            const month = String(decisionDate.getMonth() + 1).padStart(2, '0')
            const day = String(decisionDate.getDate()).padStart(2, '0')
            processedDecisionTime = `${year}-${month}-${day}` as Time
          }
        } catch (error) {
          console.warn('Failed to parse decision time:', time, error)
          return
        }
        
        // Find the corresponding candlestick data to get price level
        const candleData = candlestickData.find(candle => {
          if (typeof candle.time === 'number' && typeof processedDecisionTime === 'number') {
            // For intraday data, match timestamps (allow small tolerance for rounding)
            return Math.abs(candle.time - processedDecisionTime) < 60 // Within 1 minute tolerance
          } else if (typeof candle.time === 'string' && typeof processedDecisionTime === 'string') {
            // For daily data, exact string match
            return candle.time === processedDecisionTime
          } else {
            // Mixed types, try to compare dates
            try {
              const candleDate = typeof candle.time === 'number' 
                ? new Date(candle.time * 1000)
                : new Date(candle.time as string)
              const decisionDate = typeof processedDecisionTime === 'number'
                ? new Date(processedDecisionTime * 1000)
                : new Date(processedDecisionTime as string)
              
              // Compare date parts only
              return candleDate.toDateString() === decisionDate.toDateString()
            } catch {
              return false
            }
          }
        })
        
        if (candleData) {
          // Test: Show all decision dots on the high of the candle
          const value = candleData.high
          
          decisionGroups[decision].push({
            time: candleData.time as Time, // Use the candle's time format for consistency
            value: value
          })
        } else {
          // Debug logging when no matching candle is found
          console.warn('No matching candle found for decision:', {
            originalTime: time,
            processedTime: processedDecisionTime,
            decision,
            availableCandles: candlestickData.slice(0, 3).map(c => ({ time: c.time, date: typeof c.time === 'number' ? new Date(c.time * 1000).toISOString() : c.time }))
          })
        }
      })

      // Add series for each decision type
      Object.entries(decisionGroups).forEach(([decision, points]) => {
        if (points.length > 0) {
          // Sort points by time and remove duplicates
          const sortedPoints = points
            .sort((a, b) => {
              if (typeof a.time === 'number' && typeof b.time === 'number') {
                return a.time - b.time
              } else if (typeof a.time === 'string' && typeof b.time === 'string') {
                return new Date(a.time).getTime() - new Date(b.time).getTime()
              } else {
                // Mixed types
                const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : (a.time as number) * 1000
                const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : (b.time as number) * 1000
                return timeA - timeB
              }
            })
            .filter((point, index, array) => {
              // Keep only the first occurrence of each timestamp
              return index === 0 || point.time !== array[index - 1].time
            })

          if (sortedPoints.length > 0) {
            const decisionSeries = chart.addSeries(LineSeries, {
              color: decisionColorMap[decision as TradingDecision],
              pointMarkersVisible: true,
              pointMarkersRadius: 6, // Larger markers for better visibility
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
          .sort((a, b) => {
            if (typeof a.time === 'number' && typeof b.time === 'number') {
              return a.time - b.time
            } else if (typeof a.time === 'string' && typeof b.time === 'string') {
              return new Date(a.time).getTime() - new Date(b.time).getTime()
            } else {
              const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : (a.time as number) * 1000
              const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : (b.time as number) * 1000
              return timeA - timeB
            }
          })
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
          .sort((a, b) => {
            if (typeof a.time === 'number' && typeof b.time === 'number') {
              return a.time - b.time
            } else if (typeof a.time === 'string' && typeof b.time === 'string') {
              return new Date(a.time).getTime() - new Date(b.time).getTime()
            } else {
              const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : (a.time as number) * 1000
              const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : (b.time as number) * 1000
              return timeA - timeB
            }
          })
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
  }, [contract, indicator, showIndicators, decisions, displayTimeframe])

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
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{contract?.data.length || 0} data points</span>
              {displayTimeframe && displayTimeframe !== 'Unknown' && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span className="font-medium text-primary">Timeframe: {displayTimeframe}</span>
                </div>
              )}
            </div>
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