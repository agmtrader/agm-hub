'use client'

import { createChart, ColorType, CandlestickData, CandlestickSeries, LineSeries } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import { ContractData, TradingDecision } from '@/lib/entities/trader'

interface TraderChartProps {
  contract: ContractData
  indicator: number[]
  decisions: Array<{
    id: number
    decision: TradingDecision
    created: string
    updated: string
  }>
  title?: string
}

const TraderChart = ({ contract, indicator, decisions, title }: TraderChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current || !contract.has_data || !contract.data) return

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

    // Prepare candlestick data
    const candlestickData: CandlestickData[] = contract.data.map(point => ({
      time: point.date.split(' ')[0], // Extract date part
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
    }))

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    candlestickSeries.setData(candlestickData)

    // Add PSAR indicator if provided
    if (indicator && indicator.length > 0) {
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

    // Add decision markers
    if (decisions && decisions.length > 0) {
      const decisionColors = {
        LONG: '#22c55e', // Green
        SHORT: '#ef4444', // Red
        STAY: '#FFA500', // Orange
        EXIT: '#FFA500', // Orange
      }

      // Group decisions by type for better performance
      const groupedDecisions = decisions.reduce((acc, decision) => {
        if (!acc[decision.decision]) acc[decision.decision] = []
        acc[decision.decision].push(decision)
        return acc
      }, {} as Record<TradingDecision, typeof decisions>)

      // Create series for each decision type
      Object.entries(groupedDecisions).forEach(([decisionType, decisionList]) => {
        const decisionPoints = decisionList.map(decision => {
          const date = decision.created.split(' ')[0]
          const dataPoint = candlestickData.find(d => d.time === date)
          
          if (!dataPoint) return null

          // Position markers based on decision type
          let value: number
          switch (decisionType as TradingDecision) {
            case 'LONG':
            case 'EXIT':
              value = dataPoint.high * 1.02 // Above the candle
              break
            case 'SHORT':
            case 'EXIT':
              value = dataPoint.low * 0.98 // Below the candle
              break
            case 'STAY':
              value = dataPoint.close // At the close price
              break
            default:
              value = dataPoint.close
          }
          
          return {
            time: date,
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
            color: decisionColors[decisionType as TradingDecision] || '#666666',
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
  }, [contract, indicator, decisions])

  if (!contract.has_data) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">No data available for {contract.symbol}</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg bg-background">
      <div className="p-4 border-b border-muted">
        <h3 className="text-lg font-semibold">
          {title || `${contract.symbol} Chart`}
        </h3>
        <p className="text-sm text-muted-foreground">
          {contract.data_points} data points • PSAR Indicator
        </p>
      </div>
      <div className="p-4">
        <div ref={chartContainerRef} className="w-full h-[400px]" />
      </div>
    </div>
  )
}

export default TraderChart 