// TypeScript interfaces mirroring Python trader structures

export interface Contract {
  symbol: string;
  secType: string;
  exchange: string;
  currency: string;
  lastTradeDateOrContractMonth?: string;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface ContractData {
  contract: Contract;
  data: HistoricalDataPoint[];
  symbol: string;
  has_data: boolean;
  data_points: number;
}

export interface OrderData {
  contract: Contract;
  order?: {
    orderId: number;
    action: string;
    totalQuantity: number;
    orderType: string;
    lmtPrice: number;
    auxPrice: number;
  };
  orderStatus?: {
    orderId?: number;
    status: string;
    filled: number;
    remaining: number;
    avgFillPrice: number;
  };
  isActive?: boolean;
  isDone?: boolean;
  filled?: number;
  remaining?: number;
}

export interface PositionData {
  account: string;
  contract: Contract;
  position: number;
  avgCost: number;
}

export interface AccountSummaryItem {
  account: string;
  tag: string;
  value: string;
  currency: string;
  modelCode: string;
}

// Base strategy parameters interface
export interface BaseStrategyParams {
  position: number;
  contracts: ContractData[];
  open_orders: OrderData[];
  executed_orders: OrderData[];
  positions: PositionData[];
}

// Ichimoku strategy specific parameters
export interface IchimokuBaseParams extends BaseStrategyParams {
  tenkan: number;
  kijun: number;
  number_of_contracts: number;
  psar_mes: number[];
  psar_mym: number[];
  historical_data?: { [symbol: string]: HistoricalDataPoint[] };
}

// Strategy interface
export interface Strategy {
  name: string;
  params: IchimokuBaseParams;
}

// Trader snapshot interface
export interface TraderSnapshot {
  strategy: Strategy;
  decision: string;
  account_summary: AccountSummaryItem[];
}

// Response interface for trader communications
export interface TraderResponse {
  status: string;
  strategy: Strategy;
  decision: string;
  account_summary: AccountSummaryItem[];
}

// Add backtest interfaces
export interface BacktestSnapshot {
  current_time: string;
  decision: TradingDecision;
  market_data: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
  strategy_indicators?: {
    tenkan?: number;
    kijun?: number;
    psar_mes?: number;
    psar_mym?: number;
    number_of_contracts?: number;
    psar_difference?: number;
  };
}

export interface ExtendedTraderResponse extends TraderResponse {
  backtest?: BacktestSnapshot[];
}

export interface DecisionHistory {
  id: number;
  decision: TradingDecision;
  created: string;
  updated: string;
}

// Decision types
export type TradingDecision = 'LONG' | 'SHORT' | 'STAY' | 'EXIT';

// Utility type for strategy creation
export interface StrategyConfig {
  name: string;
  type: 'ICHIMOKU_BASE' | string;
  params?: Partial<IchimokuBaseParams>;
}

// Contract creation helpers
export interface FutureContractOptions {
  symbol: string;
  lastTradeDateOrContractMonth: string;
  exchange: string;
  currency?: string;
}

// Strategy calculation interfaces
export interface TechnicalIndicatorParams {
  startAf?: number;
  incrementAf?: number;
  maxAf?: number;
}

export interface PsarCalculationResult {
  values: number[];
  isUptrend: boolean[];
  extremePoints: number[];
}

export interface IchimokuIndicators {
  tenkan: number;
  kijun: number;
  senkouSpanA: number;
  senkouSpanB: number;
  chikouSpan: number;
}

// Order creation interfaces
export interface OrderParams {
  symbol: string;
  quantity: number;
  action: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  price?: number;
  stopPrice?: number;
}

export interface BracketOrderParams extends OrderParams {
  takeProfitPrice?: number;
  stopLossPrice?: number;
}

// Market data interfaces
export interface MarketDataRequest {
  contract: Contract;
  endDateTime?: string;
  durationStr: string;
  barSizeSetting: string;
  whatToShow: string;
  useRTH: number;
}

export interface RealTimeMarketData {
  symbol: string;
  last: number;
  bid: number;
  ask: number;
  volume: number;
  timestamp: Date;
}

// Trader state interfaces
export interface TraderState {
  isConnected: boolean;
  isRunning: boolean;
  currentStrategy: Strategy | null;
  lastDecision: TradingDecision | null;
  accountSummary: AccountSummaryItem[] | null;
  positions: PositionData[];
  openOrders: OrderData[];
  executedOrders: OrderData[];
}

// Error handling
export interface TraderError {
  code: string;
  message: string;
  timestamp: Date;
  context?: any;
}

export interface TraderPerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPnL: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
} 