import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown, Percent, Target, DollarSign, Activity } from 'lucide-react'
import React from 'react'
import { Strategy, BacktestSnapshot, DecisionHistory } from '@/lib/tools/trader'
import TraderChart from './TraderChart'
import EquityCurveChart from './EquityCurveChart'
import { getDecisionColor, calculateBacktestMetrics } from '@/utils/tools/trader'

type Props = {
    backtestData: BacktestSnapshot[]
    strategy: Strategy
    decisionHistory: DecisionHistory[]
}

// Function to calculate equity curve data from backtest snapshots
const calculateEquityCurveData = (backtestData: BacktestSnapshot[]): Array<{ date: string; value: number; pnl: number; position: string }> => {
  if (backtestData.length === 0) return []
  
  const equityData: Array<{ date: string; value: number; pnl: number; position: string }> = []
  let currentEquity = 100000 // Starting equity $100,000
  let currentPosition: 'LONG' | 'SHORT' | null = null
  let entryPrice = 0
  let contracts = 0
  let positionValue = 0
  
  // Contract specifications for MES (Micro S&P 500)
  const contractMultiplier = 5 // $5 per point for MES
  
  for (let i = 0; i < backtestData.length; i++) {
    const snapshot = backtestData[i]
    const currentPrice = snapshot.market_data.close
    let pnl = 0
    let positionStr = 'NONE'
    
    // Handle strategy decisions
    if (snapshot.decision === 'LONG' && currentPosition === null) {
      // Enter LONG position
      currentPosition = 'LONG'
      entryPrice = currentPrice
      contracts = snapshot.strategy_indicators?.number_of_contracts || 12 // Use actual contracts from strategy
      positionValue = entryPrice * contracts * contractMultiplier
      positionStr = `LONG ${contracts}`
      
    } else if (snapshot.decision === 'SHORT' && currentPosition === null) {
      // Enter SHORT position
      currentPosition = 'SHORT'
      entryPrice = currentPrice
      contracts = snapshot.strategy_indicators?.number_of_contracts || 4 // Use actual contracts from strategy
      positionValue = entryPrice * contracts * contractMultiplier
      positionStr = `SHORT ${contracts}`
      
    } else if (snapshot.decision === 'EXIT' && currentPosition !== null) {
      // Exit current position
      if (currentPosition === 'LONG') {
        pnl = (currentPrice - entryPrice) * contracts * contractMultiplier
      } else if (currentPosition === 'SHORT') {
        pnl = (entryPrice - currentPrice) * contracts * contractMultiplier
      }
      
      currentEquity += pnl
      currentPosition = null
      entryPrice = 0
      contracts = 0
      positionValue = 0
      positionStr = 'EXIT'
      
    } else if (currentPosition !== null) {
      // Update unrealized PnL for existing position
      if (currentPosition === 'LONG') {
        pnl = (currentPrice - entryPrice) * contracts * contractMultiplier
        positionStr = `LONG ${contracts}`
      } else if (currentPosition === 'SHORT') {
        pnl = (entryPrice - currentPrice) * contracts * contractMultiplier
        positionStr = `SHORT ${contracts}`
      }
    }
    
    // Handle position reversals (LONG to SHORT or SHORT to LONG)
    if ((snapshot.decision === 'LONG' && currentPosition === 'SHORT') ||
        (snapshot.decision === 'SHORT' && currentPosition === 'LONG')) {
      
      // Close existing position first
      if (currentPosition === 'LONG') {
        pnl = (currentPrice - entryPrice) * contracts * contractMultiplier
      } else if (currentPosition === 'SHORT') {
        pnl = (entryPrice - currentPrice) * contracts * contractMultiplier
      }
      
      currentEquity += pnl
      
      // Open new position
      if (snapshot.decision === 'LONG') {
        currentPosition = 'LONG'
        contracts = snapshot.strategy_indicators?.number_of_contracts || 12 // Use actual contracts from strategy
        positionStr = `LONG ${contracts}`
      } else {
        currentPosition = 'SHORT'
        contracts = snapshot.strategy_indicators?.number_of_contracts || 4 // Use actual contracts from strategy
        positionStr = `SHORT ${contracts}`
      }
      
      entryPrice = currentPrice
      positionValue = entryPrice * contracts * contractMultiplier
      pnl = 0 // Reset PnL for new position
    }
    
    equityData.push({
      date: snapshot.current_time,
      value: currentEquity + (currentPosition ? pnl : 0), // Include unrealized PnL
      pnl: pnl,
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

  let completedTrades = 0
  let winningTrades = 0
  let losingTrades = 0
  let totalTradeReturn = 0
  let currentPosition: 'LONG' | 'SHORT' | null = null
  let entryPrice = 0
  let contracts = 0
  
  // Contract specifications for MES (Micro S&P 500)
  const contractMultiplier = 5 // $5 per point for MES

  for (let i = 0; i < backtestData.length; i++) {
    const snapshot = backtestData[i]
    const currentPrice = snapshot.market_data.close

    // Track position entries
    if (snapshot.decision === 'LONG' && currentPosition === null) {
      currentPosition = 'LONG'
      entryPrice = currentPrice
      contracts = snapshot.strategy_indicators?.number_of_contracts || 12
    } else if (snapshot.decision === 'SHORT' && currentPosition === null) {
      currentPosition = 'SHORT'
      entryPrice = currentPrice
      contracts = snapshot.strategy_indicators?.number_of_contracts || 4
    } else if (snapshot.decision === 'EXIT' && currentPosition !== null) {
      // Calculate trade result
      let pnl = 0
      if (currentPosition === 'LONG') {
        pnl = (currentPrice - entryPrice) * contracts * contractMultiplier
      } else if (currentPosition === 'SHORT') {
        pnl = (entryPrice - currentPrice) * contracts * contractMultiplier
      }

      completedTrades++
      totalTradeReturn += pnl

      if (pnl > 0) {
        winningTrades++
      } else if (pnl < 0) {
        losingTrades++
      }

      // Reset position
      currentPosition = null
      entryPrice = 0
      contracts = 0
    } else if ((snapshot.decision === 'LONG' && currentPosition === 'SHORT') ||
               (snapshot.decision === 'SHORT' && currentPosition === 'LONG')) {
      // Handle position reversals - close existing position first
      let pnl = 0
      if (currentPosition === 'LONG') {
        pnl = (currentPrice - entryPrice) * contracts * contractMultiplier
      } else if (currentPosition === 'SHORT') {
        pnl = (entryPrice - currentPrice) * contracts * contractMultiplier
      }

      completedTrades++
      totalTradeReturn += pnl

      if (pnl > 0) {
        winningTrades++
      } else if (pnl < 0) {
        losingTrades++
      }

      // Open new position
      if (snapshot.decision === 'LONG') {
        currentPosition = 'LONG'
        contracts = snapshot.strategy_indicators?.number_of_contracts || 12
      } else {
        currentPosition = 'SHORT'
        contracts = snapshot.strategy_indicators?.number_of_contracts || 4
      }
      entryPrice = currentPrice
    }
  }

  const totalTrades = backtestData.filter(s => s.decision === 'LONG' || s.decision === 'SHORT').length
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

const Backtest = ({backtestData, strategy, decisionHistory}: Props) => {
  const backtestMetrics = calculateBacktestMetrics(backtestData);
  const equityCurveData = calculateEquityCurveData(backtestData);
  const tradingStats = calculateTradingStats(backtestData);
  
  // Calculate Ichimoku-specific metrics
  const ichimokuMetrics = {
    longSignals: backtestData.filter(s => s.decision === 'LONG').length,
    shortSignals: backtestData.filter(s => s.decision === 'SHORT').length,
    exitSignals: backtestData.filter(s => s.decision === 'EXIT').length,
    staySignals: backtestData.filter(s => s.decision === 'STAY').length,
    totalSignals: backtestData.length,
    signalDistribution: {
      long: ((backtestData.filter(s => s.decision === 'LONG').length / backtestData.length) * 100).toFixed(1),
      short: ((backtestData.filter(s => s.decision === 'SHORT').length / backtestData.length) * 100).toFixed(1),
      exit: ((backtestData.filter(s => s.decision === 'EXIT').length / backtestData.length) * 100).toFixed(1),
      stay: ((backtestData.filter(s => s.decision === 'STAY').length / backtestData.length) * 100).toFixed(1)
    }
  };
  
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
        <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm">
            {backtestData.length} days analyzed
            </Badge>
        </div>
        
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