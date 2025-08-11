'use client'

import { createChart, ColorType, CandlestickData, CandlestickSeries, LineSeries } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'
import { ContractData } from '@/lib/tools/trader'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface TraderChartProps {
  contract?: ContractData
  indicator?: number[]
  title?: string
}

const TraderChart = ({ contract, indicator, title }: TraderChartProps) => {

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [showIndicators, setShowIndicators] = useState(true)

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
      candlestickData = contract.data.map(point => ({   
        time: point.date.split(' ')[0],
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
  }, [contract, indicator, showIndicators])

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