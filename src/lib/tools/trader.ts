export interface Contract {
  symbol: string;
  secType: string;
  exchange: string;
  currency: string;
  lastTradeDateOrContractMonth?: string;
}

export interface BacktestSnapshot {
  /** ISO date string (e.g. 2024-09-23) */
  Date: string;
  /** OHLC values for the trading session */
  Open: number;
  High: number;
  Low: number;
  Close: number;
  /** Previous close to calculate returns */
  'Prev Close': number;
  /** Trading decision produced by the strategy for this snapshot */
  Decision: TradingDecision;
  /** Current open position size (can be 0 when flat) */
  Position: number;
  /** Portfolio value after applying the snapshot returns */
  'Portfolio Value': number;
  /** Percentage returns for this snapshot */
  Returns: number;
  /** The following legacy fields are kept optional for backward compatibility */
  EntryPrice?: string | number;
  ExitPrice?: string | number;
  'P/L'?: number;
  'Cum. P/L'?: number;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  /** Optional additional fields returned by the Trader back-end */
  volume?: number;
  average?: number;
  barCount?: number;
}

export interface IndicatorData {
  /** Generic indicator list ‑ keyed by indicator name (e.g. "psar") */
  [indicatorName: string]: number[];
}

export interface ContractData {
  contract: Contract;
  data: HistoricalDataPoint[];
  symbol: string;
  /** Optional container for any indicators calculated for this contract */
  indicators?: IndicatorData;
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

// NOTE: keep the interface flexible so the front-end does not break if the
// back-end sends additional optional fields.

export interface IchimokuBaseParams {
  tenkan: number;
  kijun: number;
  number_of_contracts: number;

  /* Trading objects */
  contracts: ContractData[];
  open_orders: OrderData[];
  executed_orders: OrderData[];
  positions: PositionData[];

  /* Optional historical dump */
  historical_data?: { [symbol: string]: HistoricalDataPoint[] };
}

export interface Strategy {
  name: string;
  params: IchimokuBaseParams;
}

export interface TraderResponse {
  status: string;
  strategy: Strategy;
  decision: string;
  account_summary: AccountSummaryItem[];
}

export interface ExtendedTraderResponse extends TraderResponse {
  backtest?: BacktestSnapshot[];
}

export type TradingDecision = 'LONG' | 'SHORT' | 'STAY' | 'EXIT';