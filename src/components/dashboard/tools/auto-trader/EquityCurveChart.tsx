'use client'

import { createChart, ColorType, LineSeries } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

interface EquityCurveChartProps {
  data: Array<{
    date: string
    value: number
  }>
}

const EquityCurveChart = ({ data }: EquityCurveChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Get computed colors from CSS variables
    const computedStyle = getComputedStyle(document.documentElement)
    const foregroundColor = computedStyle.getPropertyValue('--foreground')
    const mutedColor = computedStyle.getPropertyValue('--muted')
    const primaryColor = computedStyle.getPropertyValue('--primary')

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

    const lineSeries = chart.addSeries(LineSeries, {
      color: `hsl(${primaryColor})`,
      lineWidth: 2,
      lastValueVisible: true,
    })

    const chartData = data.map(item => ({
      time: item.date,
      value: item.value,
    }))

    lineSeries.setData(chartData)
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
  }, [data])

  return (
    <div className="w-full h-[400px] p-4 rounded-lg bg-background">
      <h2 className="text-lg font-semibold mb-2">Equity Curve</h2>
      <div ref={chartContainerRef} className="w-full h-[350px]" />
    </div>
  )
}

export default EquityCurveChart 