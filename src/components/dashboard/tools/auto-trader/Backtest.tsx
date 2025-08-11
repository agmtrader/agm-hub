import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown, Percent, Target, DollarSign, Activity } from 'lucide-react'
import React from 'react'
import EquityCurveChart from './EquityCurveChart'

// New BacktestSnapshot interface to match the Python structure
interface BacktestSnapshot {
  Date: string
  Open: number
  High: number
  Low: number
  Close: number
  'Prev Close': number
  Decision: 'LONG' | 'SHORT' | 'EXIT' | 'STAY'
  EntryPrice: string | number
  ExitPrice: string | number
  'P/L': number
  'Cum. P/L': number
}

type Props = {
    backtestData: BacktestSnapshot[]
}

// Function to calculate equity curve data from backtest snapshots
const calculateEquityCurveData = (backtestData: BacktestSnapshot[]): Array<{ date: string; value: number; pnl: number; position: string }> => {
  if (backtestData.length === 0) return []
  
  const equityData: Array<{ date: string; value: number; pnl: number; position: string }> = []
  const startingEquity = 100000 // Starting equity $100,000
  
  for (let i = 0; i < backtestData.length; i++) {
    const snapshot = backtestData[i]
    
    // Use cumulative P/L to calculate current equity value
    const currentEquity = startingEquity + snapshot['Cum. P/L']
    
    // Determine position string based on decision and entry/exit prices
    let positionStr = 'NONE'
    if (snapshot.Decision === 'LONG' && (snapshot.EntryPrice !== '' && snapshot.EntryPrice !== 0)) {
      positionStr = 'LONG'
    } else if (snapshot.Decision === 'SHORT' && (snapshot.EntryPrice !== '' && snapshot.EntryPrice !== 0)) {
      positionStr = 'SHORT'
    } else if (snapshot.Decision === 'EXIT') {
      positionStr = 'EXIT'
    } else if (snapshot.Decision === 'STAY') {
      positionStr = 'STAY'
    }
    
    equityData.push({
      date: snapshot.Date,
      value: currentEquity,
      pnl: snapshot['P/L'],
      position: positionStr
    })
  }
  
  return equityData
}

// Function to calculate trading statistics
const calculateTradingStats = (backtestData: BacktestSnapshot[]): {
  totalTrades: number;
  completedTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageTradeReturn: number;
} => {
  if (backtestData.length === 0) {
    return {
      totalTrades: 0,
      completedTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      averageTradeReturn: 0
    }
  }

  // Count completed trades (those with exit prices)
  const completedTrades = backtestData.filter(s => 
    s.ExitPrice !== '' && s.ExitPrice !== 0 && s['P/L'] !== 0
  ).length

  // Count winning and losing trades
  const winningTrades = backtestData.filter(s => s['P/L'] > 0).length
  const losingTrades = backtestData.filter(s => s['P/L'] < 0).length

  // Calculate total return from all trades
  const totalTradeReturn = backtestData.reduce((sum, s) => sum + s['P/L'], 0)

  // Count total signals (LONG and SHORT entries)
  const totalTrades = backtestData.filter(s => 
    s.Decision === 'LONG' || s.Decision === 'SHORT'
  ).length

  const winRate = completedTrades > 0 ? (winningTrades / completedTrades * 100) : 0
  const averageTradeReturn = completedTrades > 0 ? (totalTradeReturn / completedTrades) : 0

  return {
    totalTrades,
    completedTrades,
    winningTrades,
    losingTrades,
    winRate: Math.round(winRate * 100) / 100,
    averageTradeReturn: Math.round(averageTradeReturn * 100) / 100
  }
}

const Backtest = ({backtestData}: Props) => {
  const equityCurveData = calculateEquityCurveData(backtestData);
  const tradingStats = calculateTradingStats(backtestData);

  // Calculate equity performance
  const finalEquity = equityCurveData.length > 0 ? equityCurveData[equityCurveData.length - 1].value : 100000;
  const startingEquity = 100000;
  const totalReturn = ((finalEquity - startingEquity) / startingEquity * 100).toFixed(2);
  const maxEquity = Math.max(...equityCurveData.map(d => d.value));
  const minEquity = Math.min(...equityCurveData.map(d => d.value));
  const maxDrawdown = (((maxEquity - minEquity) / maxEquity) * 100).toFixed(2);

  return (
    <div className="rounded-lg p-4 bg-background">
        <div className="space-y-4">
        
        {backtestData.length > 0 ? (
            <div className="space-y-6">
            
            {/* Strategy Summary */}
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Strategy Performance</h3>
                
                {/* First row - Overall Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="text-sm text-subtitle">Total Return</span>
                        </div>
                        <span className={`text-2xl font-bold ${parseFloat(totalReturn) >= 0 ? 'text-success' : 'text-error'}`}>
                            {parseFloat(totalReturn) >= 0 ? '+' : ''}{totalReturn}%
                        </span>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="h-4 w-4 text-error" />
                            <span className="text-sm text-subtitle">Max Drawdown</span>
                        </div>
                        <span className="text-2xl font-bold text-error">
                            -{maxDrawdown}%
                        </span>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="text-sm text-subtitle">Final Equity</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            ${finalEquity.toLocaleString()}
                        </span>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-primary" />
                            <span className="text-sm text-subtitle">Trading Days</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {backtestData.length}
                        </span>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Percent className="h-4 w-4 text-primary" />
                            <span className="text-sm text-subtitle">Win Rate</span>
                        </div>
                        <span className={`text-2xl font-bold text-success`}>
                            {tradingStats.winRate.toFixed(1)}%
                        </span>
                    </div>
                </div>

            </div>

            {/* Equity Curve Chart */}
            {equityCurveData.length > 0 && (
                <EquityCurveChart data={equityCurveData} />
            )}

            </div>
        ) : (
            <div className="text-center py-8">
            <p className="text-muted-foreground">No backtest data available</p>
            <p className="text-sm text-subtitle mt-2">Run the strategy to generate backtest results</p>
            </div>
        )}
        </div>
    </div>
  )
}

export default Backtest