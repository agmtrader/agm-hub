'use client'

import { createChart, ColorType, CandlestickData, CandlestickSeries, LineSeries } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'
import { ContractData, TradingDecision } from '@/lib/tools/trader'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface TradingDataPoint {
  Date: string
  Open: number
  High: number
  Low: number
  Close: number
  'Prev Close': number
  Decision: string
  EntryPrice: string | number
  ExitPrice: string | number
  'P/L': number
  'Cum. P/L': number
}

interface TraderChartProps {
  contract?: ContractData
  indicator?: number[]
  tradingData?: TradingDataPoint[]
  title?: string
}

const TraderChart = ({ contract, indicator, tradingData, title }: TraderChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [showDecisionMarkers, setShowDecisionMarkers] = useState(true)
  const [showIndicators, setShowIndicators] = useState(true)

  useEffect(() => {
    console.log('🔍 TraderChart useEffect triggered')
          console.log('📦 Props received:', {
        tradingData: tradingData ? `${tradingData.length} items` : 'undefined/null',
        contract: contract ? `has_data: ${contract.has_data}, data_points: ${contract.data?.length || 0}` : 'undefined/null',
        indicator: indicator ? `${indicator.length} items` : 'undefined/null'
      })
    
    if (!chartContainerRef.current) return

    // Determine data source - prefer tradingData if available
    const hasTradeData = tradingData && tradingData.length > 0
    const hasContractData = contract?.has_data && contract?.data
    
    console.log('🎯 Data source check:', {
      hasTradeData,
      hasContractData,
      tradingDataLength: tradingData?.length || 0,
      contractDataLength: contract?.data?.length || 0
    })
    
    if (!hasTradeData && !hasContractData) {
      console.log('❌ No valid data source found, exiting')
      return
    }

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
      height: 400,
    })

    let candlestickData: CandlestickData[] = []

    // Prepare candlestick data from either source
    if (hasTradeData) {
      candlestickData = tradingData.map(point => ({
        time: point.Date,
        open: point.Open,
        high: point.High,
        low: point.Low,
        close: point.Close,
      }))
    } else if (hasContractData) {
      candlestickData = contract.data.map(point => ({
        time: point.date.split(' ')[0], // Extract date part
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close,
      }))
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

    // Add PSAR indicator if provided and enabled
    if (showIndicators && indicator && indicator.length > 0) {
      const psarPointsBelow: any[] = []
      const psarPointsAbove: any[] = []

      indicator.forEach((value, index) => {
        const candle = candlestickData[index]
        if (!candle) return

        const point = {
          time: candle.time,
          value: value,
        }

        // Determine if PSAR is below or above the close price
        if (value < candle.close) {
          psarPointsBelow.push(point)
        } else {
          psarPointsAbove.push(point)
        }
      })

      // Add blue series for PSAR points below the close price
      if (psarPointsBelow.length > 0) {
        const psarSeriesBelow = chart.addSeries(LineSeries, {
          color: '#3b82f6', // Blue color
          lineWidth: 2,
          pointMarkersVisible: true,
          pointMarkersRadius: 3,
          lineVisible: false,
          lastValueVisible: false,
        })
        psarSeriesBelow.setData(psarPointsBelow)
      }

      // Add purple series for PSAR points above the close price
      if (psarPointsAbove.length > 0) {
        const psarSeriesAbove = chart.addSeries(LineSeries, {
          color: '#9333ea', // Purple color (original)
          lineWidth: 2,
          pointMarkersVisible: true,
          pointMarkersRadius: 3,
          lineVisible: false,
          lastValueVisible: false,
        })
        psarSeriesAbove.setData(psarPointsAbove)
      }
    }

    // Add decision markers - handle both data formats (only if enabled)
    if (showDecisionMarkers && hasTradeData) {
      // New trading data format
      const getDecisionColor = (decisionType: string): string => {
        const type = decisionType.trim().toUpperCase()
        console.log(`Processing decision: "${decisionType}" -> "${type}"`)
        
        // Long positions and short stop losses (profitable)
        if (type.startsWith('LONG') && !type.includes('SL')) {
          console.log(`Matched LONG (non-SL): ${type} -> GREEN`)
          return '#22c55e' // Green
        }
        if (type === 'SHORT_SL') {
          console.log(`Matched SHORT_SL: ${type} -> GREEN`)
          return '#22c55e' // Green
        }
        
        // Short positions and long stop losses (entries/losses)
        if (type.startsWith('SHORT') && !type.includes('SL')) {
          console.log(`Matched SHORT (non-SL): ${type} -> RED`)
          return '#ef4444' // Red
        }
        if (type === 'LONG_SL') {
          console.log(`Matched LONG_SL: ${type} -> RED`)
          return '#ef4444' // Red
        }
        
        // Exit signals
        if (type.includes('EXIT')) {
          console.log(`Matched EXIT: ${type} -> ORANGE`)
          return '#FFA500' // Orange
        }
        
        // Default fallback
        console.warn(`❌ Unknown decision type: "${decisionType}" (normalized: "${type}"), using PURPLE`)
        return '#9333ea' // Purple for unknown types
      }

      // Filter out decisions that are just "EXIT" with no meaningful data
      const meaningfulDecisions = tradingData.filter(point => 
        point.Decision !== 'EXIT' || 
        (point.Decision === 'EXIT' && (point.EntryPrice || point.ExitPrice))
      )

      // Debug: Log filtering results
      console.log(`📊 Total trading data points: ${tradingData.length}`)
      console.log(`📊 After filtering: ${meaningfulDecisions.length}`)
      console.log('Filtered out:', tradingData.length - meaningfulDecisions.length, 'EXIT decisions with no price data')
      
      // Debug: Log unique decision types
      const uniqueDecisions = [...new Set(meaningfulDecisions.map(p => p.Decision))]
      console.log('📋 Unique decision types in filtered data:', uniqueDecisions)

      // Group decisions by type for better performance
      const groupedDecisions = meaningfulDecisions.reduce((acc, point) => {
        const decision = point.Decision.trim() // Trim whitespace
        if (!acc[decision]) acc[decision] = []
        acc[decision].push(point)
        return acc
      }, {} as Record<string, TradingDataPoint[]>)

      // Create series for each decision type
      Object.entries(groupedDecisions).forEach(([decisionType, decisionList]) => {
        const decisionPoints = decisionList.map(point => {
          const dataPoint = candlestickData.find(d => d.time === point.Date)
          
          if (!dataPoint) return null

          // Position markers based on decision type
          let value: number
          const isLongDecision = decisionType.startsWith('LONG')
          const isShortDecision = decisionType.startsWith('SHORT')
          const isExitDecision = decisionType.startsWith('EXIT')
          
          if (isLongDecision && !decisionType.includes('SL')) {
            value = dataPoint.low * 0.98 // Below the candle for long entries/exits
          } else if (isShortDecision && !decisionType.includes('SL')) {
            value = dataPoint.high * 1.02 // Above the candle for short entries/exits
          } else if (decisionType.includes('SL')) {
            // Stop losses - position opposite of the trade direction
            value = isLongDecision ? dataPoint.high * 1.02 : dataPoint.low * 0.98
          } else if (isExitDecision) {
            value = dataPoint.close // At the close price for exits
          } else {
            value = dataPoint.close
          }
          
          return {
            time: point.Date,
            value
          }
        }).filter(point => point !== null)

        if (decisionPoints.length > 0) {
          // Create white border effect by adding a larger white marker first
          const whiteBorderSeries = chart.addSeries(LineSeries, {
            color: '#ffffff',
            lineWidth: 2,
            pointMarkersVisible: true,
            lineVisible: false,
            pointMarkersRadius: 5,
            lastValueVisible: false,
          })
          whiteBorderSeries.setData(decisionPoints)

          // Then add the colored marker on top
          const decisionSeries = chart.addSeries(LineSeries, {  
            color: getDecisionColor(decisionType),
            lineWidth: 2,
            pointMarkersVisible: true,
            lineVisible: false,
            pointMarkersRadius: 3,
            lastValueVisible: false,
          })
          decisionSeries.setData(decisionPoints)
        }
      })
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
  }, [contract, indicator, tradingData, showDecisionMarkers, showIndicators])

  // Determine what data we have for display
  const hasTradeData = tradingData && tradingData.length > 0
  const hasContractData = contract?.has_data && contract?.data
  const dataPoints = hasTradeData ? tradingData.length : (hasContractData ? contract.data_points : 0)
  const symbol = hasTradeData ? 'Trading Data' : (contract?.symbol || 'Chart')

  if (!hasTradeData && !hasContractData) {
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
              {title || `${symbol} Chart`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {dataPoints} data points • {hasTradeData ? 'Trading Decisions' : 'PSAR Indicator'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {(indicator && indicator.length > 0) && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-indicators"
                  checked={showIndicators}
                  onCheckedChange={setShowIndicators}
                />
                <Label htmlFor="show-indicators" className="text-sm">Indicators</Label>
              </div>
            )}
            {hasTradeData && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-decisions"
                  checked={showDecisionMarkers}
                  onCheckedChange={setShowDecisionMarkers}
                />
                <Label htmlFor="show-decisions" className="text-sm">Decisions</Label>
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