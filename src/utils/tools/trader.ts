import { 
  ContractData, 
  Strategy, 
  TradingDecision, 
  HistoricalDataPoint,
  IchimokuBaseParams,
  AccountSummaryItem,
  TraderState,
  OrderData,
  PositionData,
  Contract,
  FutureContractOptions,
  BacktestSnapshot
} from '@/lib/tools/trader';

/**
 * Utility functions for trader operations
 */

// Contract utilities
export function createFutureContract(options: FutureContractOptions): Contract {
  return {
    symbol: options.symbol,
    secType: 'FUT',
    exchange: options.exchange,
    currency: options.currency || 'USD',
    lastTradeDateOrContractMonth: options.lastTradeDateOrContractMonth
  };
}

export function createContractData(contract: Contract, data: HistoricalDataPoint[] = []): ContractData {
  return {
    contract,
    data,
    symbol: contract.symbol,
    has_data: data.length > 0,
    data_points: data.length
  };
}

// Market data utilities
export function getLatestPrice(contractData: ContractData): number | null {
  if (!contractData.has_data || contractData.data.length === 0) {
    return null;
  }
  return contractData.data[contractData.data.length - 1].close;
}

export function getLatestBar(contractData: ContractData): HistoricalDataPoint | null {
  if (!contractData.has_data || contractData.data.length === 0) {
    return null;
  }
  return contractData.data[contractData.data.length - 1];
}

export function hasValidMarketData(contractData: ContractData): boolean {
  return contractData.has_data && contractData.data.length > 0;
}

// Strategy utilities
export function getContractBySymbol(strategy: Strategy, symbol: string): ContractData | null {
  return strategy.params.contracts.find(contract => contract.symbol === symbol) || null;
}

export function getMESData(strategy: Strategy): ContractData | null {
  return getContractBySymbol(strategy, 'MES');
}

export function getMYMData(strategy: Strategy): ContractData | null {
  return getContractBySymbol(strategy, 'MYM');
}

// Technical indicator utilities
export function calculateTenkan(data: HistoricalDataPoint[], periods: number = 5): number {
  if (data.length < periods) return 0;
  
  const lastPeriods = data.slice(-periods);
  const maxHigh = Math.max(...lastPeriods.map(d => d.high));
  const minLow = Math.min(...lastPeriods.map(d => d.low));
  
  return (maxHigh + minLow) / 2;
}

export function calculateKijun(data: HistoricalDataPoint[], periods: number = 21): number {
  if (data.length < periods) return 0;
  
  const lastPeriods = data.slice(-periods);
  const maxHigh = Math.max(...lastPeriods.map(d => d.high));
  const minLow = Math.min(...lastPeriods.map(d => d.low));
  
  return (maxHigh + minLow) / 2;
}

export function calculateParabolicSAR(
  data: HistoricalDataPoint[], 
  startAf: number = 0.02, 
  incrementAf: number = 0.02, 
  maxAf: number = 0.20
): number[] {
  if (data.length < 2) return [];
  
  const psar: number[] = new Array(data.length);
  let bullish = true;
  let af = startAf;
  let ep = data[0].high;
  
  psar[0] = data[0].low;
  
  for (let i = 1; i < data.length; i++) {
    psar[i] = psar[i-1];
    
    if (bullish) {
      psar[i] = psar[i-1] + af * (ep - psar[i-1]);
      
      if (psar[i] > data[i].low) {
        bullish = false;
        psar[i] = ep;
        af = startAf;
        ep = data[i].low;
      } else {
        if (data[i].high > ep) {
          ep = data[i].high;
          af = Math.min(af + incrementAf, maxAf);
        }
        psar[i] = Math.min(psar[i], data[i-1].low);
      }
    } else {
      psar[i] = psar[i-1] + af * (ep - psar[i-1]);
      
      if (psar[i] < data[i].high) {
        bullish = true;
        psar[i] = ep;
        af = startAf;
        ep = data[i].high;
      } else {
        if (data[i].low < ep) {
          ep = data[i].low;
          af = Math.min(af + incrementAf, maxAf);
        }
        psar[i] = Math.max(psar[i], data[i-1].high);
      }
    }
  }
  
  return psar;
}

// Decision utilities
export function getDecisionColor(decision: TradingDecision | null): string {
  switch(decision) {
    case 'LONG': return 'bg-green-100 hover:bg-green-200 text-green-800';   
    case 'SHORT': return 'bg-red-100 hover:bg-red-200 text-red-800';
    case 'STAY': return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
    case 'EXIT': return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
    default: return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
  }
}

export function getDecisionDisplayName(decision: TradingDecision | null): string {
  switch(decision) {
    case 'LONG': return 'Buy';
    case 'SHORT': return 'Sell';
    case 'STAY': return 'Hold';
    case 'EXIT': return 'Exit';
    default: return 'Unknown';
  }
}

export function isPositiveDecision(decision: TradingDecision | null): boolean {
  return decision === 'LONG' || decision === 'EXIT';
}

export function isNegativeDecision(decision: TradingDecision | null): boolean {
  return decision === 'SHORT' || decision === 'EXIT';
}

export function isNeutralDecision(decision: TradingDecision | null): boolean {
  return decision === 'STAY' || decision === null;
}

// Account utilities
export function getAccountSummaryValue(
  accountSummary: AccountSummaryItem[],
  tag: string
): AccountSummaryItem | null {
  return accountSummary.find(item => item.tag === tag) || null;
}

export function formatAccountValue(item: AccountSummaryItem): string {
  return item.currency ? `${item.value} ${item.currency}` : item.value;
}

export function getAccountBalance(accountSummary: AccountSummaryItem[]): string {
  const netLiquidation = getAccountSummaryValue(accountSummary, 'NetLiquidation');
  return netLiquidation ? formatAccountValue(netLiquidation) : 'N/A';
}

export function getUnrealizedPnL(accountSummary: AccountSummaryItem[]): {
  value: number;
  formatted: string;
  isPositive: boolean;
} {
  const unrealizedPnL = getAccountSummaryValue(accountSummary, 'UnrealizedPnL');
  if (!unrealizedPnL) {
    return { value: 0, formatted: 'N/A', isPositive: false };
  }
  
  const value = parseFloat(unrealizedPnL.value);
  return {
    value,
    formatted: formatAccountValue(unrealizedPnL),
    isPositive: value > 0
  };
}

// Order utilities
export function getOrderStatusColor(status: string): string {
  switch(status.toLowerCase()) {
    case 'filled': return 'text-green-500';
    case 'cancelled': return 'text-red-500';
    case 'submitted': return 'text-blue-500';
    case 'pending': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
}

export function isOrderActive(order: OrderData): boolean {
  return order.isActive || false;
}

export function isOrderCompleted(order: OrderData): boolean {
  return order.isDone || false;
}

// Position utilities
export function getTotalPositionValue(positions: PositionData[]): number {
  return positions.reduce((total, position) => {
    return total + (position.position * position.avgCost);
  }, 0);
}

export function getPositionPnLStatus(position: PositionData, currentPrice: number): {
  pnl: number;
  isProfit: boolean;
  percentage: number;
} {
  const pnl = (currentPrice - position.avgCost) * position.position;
  const percentage = ((currentPrice - position.avgCost) / position.avgCost) * 100;
  
  return {
    pnl,
    isProfit: pnl > 0,
    percentage
  };
}

// Data validation utilities
export function validateStrategyData(strategy: Strategy): boolean {
  return (
    strategy &&
    strategy.params &&
    strategy.params.contracts &&
    strategy.params.contracts.length > 0
  );
}

export function validateMarketData(contractData: ContractData): boolean {
  return (
    contractData &&
    contractData.has_data &&
    contractData.data &&
    contractData.data.length > 0
  );
}

// Date utilities
export function formatTradeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch {
    return dateString;
  }
}

export function getLatestDataTimestamp(contractData: ContractData): Date | null {
  if (!validateMarketData(contractData)) return null;
  
  const latestBar = contractData.data[contractData.data.length - 1];
  try {
    return new Date(latestBar.date);
  } catch {
    return null;
  }
}

// Performance utilities
export function calculateStrategyPerformance(executedOrders: OrderData[]): {
  totalTrades: number;
  totalVolume: number;
  averageFillPrice: number;
} {
  if (!executedOrders || executedOrders.length === 0) {
    return { totalTrades: 0, totalVolume: 0, averageFillPrice: 0 };
  }
  
  const totalTrades = executedOrders.length;
  const totalVolume = executedOrders.reduce((sum, order) => {
    return sum + (order.orderStatus?.filled || 0);
  }, 0);
  
  const totalValue = executedOrders.reduce((sum, order) => {
    const filled = order.orderStatus?.filled || 0;
    const avgPrice = order.orderStatus?.avgFillPrice || 0;
    return sum + (filled * avgPrice);
  }, 0);
  
  const averageFillPrice = totalVolume > 0 ? totalValue / totalVolume : 0;
  
  return { totalTrades, totalVolume, averageFillPrice };
}

// Backtest performance calculation utilities
export function calculateBacktestMetrics(backtestData: BacktestSnapshot[]): {
  totalReturn: number;
  winRate: number;
  totalTrades: number;
  profitableTrades: number;
  averageGainPerTrade: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
} {
  if (backtestData.length === 0) {
    return {
      totalReturn: 0,
      winRate: 0,
      totalTrades: 0,
      profitableTrades: 0,
      averageGainPerTrade: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      profitFactor: 0,
      largestWin: 0,
      largestLoss: 0
    };
  }

  const trades = calculateTrades(backtestData);
  
  if (trades.length === 0) {
    return {
      totalReturn: 0,
      winRate: 0,
      totalTrades: 0,
      profitableTrades: 0,
      averageGainPerTrade: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      profitFactor: 0,
      largestWin: 0,
      largestLoss: 0
    };
  }

  const startPrice = backtestData[0].market_data.close;
  const endPrice = backtestData[backtestData.length - 1].market_data.close;
  
  const tradePnLs = trades.map(trade => trade.pnl);
  const profitableTrades = tradePnLs.filter(pnl => pnl > 0);
  const totalTrades = trades.length;
  const totalPnL = tradePnLs.reduce((sum, pnl) => sum + pnl, 0);
  
  // Calculate total return percentage
  const totalReturn = ((endPrice + totalPnL - startPrice) / startPrice) * 100;
  
  // Calculate win rate
  const winRate = totalTrades > 0 ? (profitableTrades.length / totalTrades) * 100 : 0;
  
  // Calculate average gain per trade
  const averageGainPerTrade = totalTrades > 0 ? totalPnL / totalTrades : 0;
  
  // Calculate maximum drawdown
  let runningBalance = startPrice;
  let peak = startPrice;
  let maxDrawdown = 0;
  
  for (const trade of trades) {
    runningBalance += trade.pnl;
    if (runningBalance > peak) {
      peak = runningBalance;
    }
    const drawdown = ((peak - runningBalance) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  // Calculate Sharpe ratio (simplified version using trade returns)
  const returns = tradePnLs.map(pnl => (pnl / startPrice) * 100);
  const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length;
  const standardDeviation = Math.sqrt(variance);
  const sharpeRatio = standardDeviation > 0 ? averageReturn / standardDeviation : 0;
  
  // Calculate profit factor
  const grossProfit = profitableTrades.reduce((sum, profit) => sum + profit, 0);
  const grossLoss = Math.abs(tradePnLs.filter(pnl => pnl < 0).reduce((sum, loss) => sum + loss, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0;
  
  // Find largest win and loss
  const largestWin = Math.max(...tradePnLs, 0);
  const largestLoss = Math.min(...tradePnLs, 0);

  return {
    totalReturn: Math.round(totalReturn * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    totalTrades,
    profitableTrades: profitableTrades.length,
    averageGainPerTrade: Math.round(averageGainPerTrade * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    profitFactor: Math.round(profitFactor * 100) / 100,
    largestWin: Math.round(largestWin * 100) / 100,
    largestLoss: Math.round(largestLoss * 100) / 100
  };
}

interface Trade {
  entryPrice: number;
  exitPrice: number;
  entryTime: string;
  exitTime: string;
  direction: 'LONG' | 'SHORT';
  pnl: number;
}

function calculateTrades(backtestData: BacktestSnapshot[]): Trade[] {
  const trades: Trade[] = [];
  let currentPosition: 'LONG' | 'SHORT' | null = null;
  let entryPrice = 0;
  let entryTime = '';

  for (let i = 0; i < backtestData.length; i++) {
    const snapshot = backtestData[i];
    const currentPrice = snapshot.market_data.close;
    const prevSnapshot = i > 0 ? backtestData[i - 1] : null;

    // Handle transitions between different decision states
    if (currentPosition === null) { 
      // Enter long position when strategy changes from STAY to BUY
      if (snapshot.decision === 'LONG' && (!prevSnapshot || prevSnapshot.decision === 'STAY')) {
        currentPosition = 'LONG';
        entryPrice = currentPrice;
        entryTime = snapshot.current_time;
      }
      // Enter short position when strategy changes from STAY to SELLSHORT
      else if (snapshot.decision === 'SHORT' && (!prevSnapshot || prevSnapshot.decision === 'STAY')) {
        currentPosition = 'SHORT';
        entryPrice = currentPrice;
        entryTime = snapshot.current_time;
      }
    } else {
      // Exit long position when strategy changes from BUY to STAY
      if (currentPosition === 'LONG' && snapshot.decision === 'STAY' && prevSnapshot && prevSnapshot.decision === 'LONG') {
        const exitPrice = currentPrice;
        const pnl = exitPrice - entryPrice;

        trades.push({
          entryPrice,
          exitPrice,
          entryTime,
          exitTime: snapshot.current_time,
          direction: currentPosition,
          pnl
        });

        currentPosition = null;
        entryPrice = 0;
        entryTime = '';
      }
      // Exit short position when strategy changes from SELLSHORT to STAY
      else if (currentPosition === 'SHORT' && snapshot.decision === 'STAY' && prevSnapshot && prevSnapshot.decision === 'SHORT') {
        const exitPrice = currentPrice;
        const pnl = entryPrice - exitPrice;

        trades.push({
          entryPrice,
          exitPrice,
          entryTime,
          exitTime: snapshot.current_time,
          direction: currentPosition,
          pnl
        });

        currentPosition = null;
        entryPrice = 0;
        entryTime = '';
      }
      // Handle explicit exit signals
      else if ((currentPosition === 'LONG' && (snapshot.decision === 'SHORT' || snapshot.decision === 'EXIT')) ||
               (currentPosition === 'SHORT' && (snapshot.decision === 'LONG' || snapshot.decision === 'EXIT'))) {
        
        const exitPrice = currentPrice;
        const pnl = currentPosition === 'LONG' 
          ? (exitPrice - entryPrice) 
          : (entryPrice - exitPrice);

        trades.push({
          entryPrice,
          exitPrice,
          entryTime,
          exitTime: snapshot.current_time,
          direction: currentPosition,
          pnl
        });

        currentPosition = null;
        entryPrice = 0;
        entryTime = '';
      }
    }
  }

  // Close any remaining open position at the end of backtest
  if (currentPosition !== null && backtestData.length > 0) {
    const lastSnapshot = backtestData[backtestData.length - 1];
    const exitPrice = lastSnapshot.market_data.close;
    const pnl = currentPosition === 'LONG' 
      ? (exitPrice - entryPrice) 
      : (entryPrice - exitPrice);

    trades.push({
      entryPrice,
      exitPrice,
      entryTime,
      exitTime: lastSnapshot.current_time,
      direction: currentPosition,
      pnl
    });
  }

  return trades;
} 