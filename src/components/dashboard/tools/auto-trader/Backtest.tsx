'use client'

import React from 'react'
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BacktestSnapshot } from '@/lib/tools/trader'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

type Props = {
  trades: BacktestSnapshot[]
}

// Helper to format percentage (e.g. 0.105 -> 10.5%)
const formatPercent = (decimal: number) => `${(decimal * 100).toFixed(2)}%`

// Helper to format currency
const formatCurrency = (value: number) => `$${value.toFixed(2)}`

// Derive high-level statistics from trades
const calculateStats = (trades: BacktestSnapshot[]) => {
  const totalTrades = trades.length
  const winningTrades = trades.filter((t) => t['PNL $'] > 0).length
  const losingTrades = trades.filter((t) => t['PNL $'] < 0).length
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
  const totalPnl = trades.reduce((sum, t) => sum + t['PNL $'], 0)
  const avgPnl = totalTrades > 0 ? totalPnl / totalTrades : 0

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate: winRate.toFixed(2),
    totalPnl,
    avgPnl,
  }
}

const Backtest = ({ trades }: Props) => {
  // Calculate equity curve (cumulative P&L over time)
  const equityCurve = React.useMemo(() => {
    // Sort trades by Exit Date chronologically
    const sorted = [...trades].sort(
      (a, b) => new Date(a['Exit Date']).getTime() - new Date(b['Exit Date']).getTime()
    )

    let cumulative = 0
    return sorted.map((t) => {
      cumulative += t['PNL $']
      return {
        date: t['Exit Date'],
        equity: Number(cumulative.toFixed(2)),
      }
    })
  }, [trades])

  const stats = calculateStats(trades)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-subtitle mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalTrades}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-subtitle mb-1">Winning Trades</p>
          <p className="text-2xl font-bold text-success">{stats.winningTrades}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-subtitle mb-1">Losing Trades</p>
          <p className="text-2xl font-bold text-error">{stats.losingTrades}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-subtitle mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-primary">{stats.winRate}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-subtitle mb-1">Total P&L</p>
          <p
            className={`text-2xl font-bold ${
              stats.totalPnl >= 0 ? 'text-success' : 'text-error'
            }`}
          >
            {formatCurrency(stats.totalPnl)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-subtitle mb-1">Average P&L / Trade</p>
          <p
            className={`text-2xl font-bold ${
              stats.avgPnl >= 0 ? 'text-success' : 'text-error'
            }`}
          >
            {formatCurrency(stats.avgPnl)}
          </p>
        </Card>
      </div>

      {/* Equity curve chart */}
      {equityCurve.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Equity Curve</h3>
          <div className="h-64 w-full">
            <ChartContainer
              config={{
                equity: {
                  label: 'Equity',
                  color: '#f97316', // Tailwind orange-500 (primary)
                },
              }}
              className="h-full w-full"
            >
              <LineChart data={equityCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis domain={['dataMin', 'dataMax']} tickFormatter={(v) => `$${v}`}/>
                <Line
                  type="monotone"
                  dataKey="equity"
                  stroke="var(--color-equity)"
                  dot={false}
                  strokeWidth={2}
                  name="Equity"
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const { equity, date } = payload[0].payload as any
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                          <p className="text-xs text-subtitle">{date}</p>
                          <p className="text-sm font-medium text-foreground">${equity.toFixed(2)}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </Card>
      )}

      {/* Trades table */}
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Side</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Entry Date</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Exit Date</TableHead>
              <TableHead>Exit Price</TableHead>
              <TableHead>PNL $</TableHead>
              <TableHead>PNL %</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Badge
                    variant={trade.Side === 'LONG' ? 'success' : 'destructive'}
                    className="px-2 py-1"
                  >
                    {trade.Side}
                  </Badge>
                </TableCell>
                <TableCell>{trade.Qty}</TableCell>
                <TableCell>{trade['Entry Date']}</TableCell>
                <TableCell>{formatCurrency(trade['Entry Price'])}</TableCell>
                <TableCell>{trade['Exit Date']}</TableCell>
                <TableCell>{formatCurrency(trade['Exit Price'])}</TableCell>
                <TableCell
                  className={trade['PNL $'] >= 0 ? 'text-success' : 'text-error'}
                >
                  {formatCurrency(trade['PNL $'])}
                </TableCell>
                <TableCell
                  className={trade['PNL %'] >= 0 ? 'text-success' : 'text-error'}
                >
                  {formatPercent(trade['PNL %'])}
                </TableCell>
                <TableCell>{trade['Exit Reason']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default Backtest