import { Map } from "../public/types";

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
  average?: number;
  barCount?: number;
}

export interface IndicatorData {
  [indicatorName: string]: number[];
}

export interface SingleIndicatorData {
  [indicatorName: string]: number;
}

export interface ContractData {
  contract: Contract;
  data: HistoricalDataPoint[];
  indicators?: IndicatorData;
  symbol: string;
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

export interface IchimokuBaseParams {
  tenkan: number;
  kijun: number;
  number_of_contracts: number;
  indicators: Map;
  contracts: ContractData[];
  open_orders: OrderData[];
  executed_orders: OrderData[];
  positions: PositionData[];
}

export interface SMACrossoverParams {
  indicators: Map;
  contracts: ContractData[];
  open_orders: OrderData[];
  executed_orders: OrderData[];
  positions: PositionData[];
}

export interface Strategy {
  name: string;
  params: SMACrossoverParams;
}

export interface Snapshot {
  current_time: string;
  strategy: Strategy;
  decision: TradingDecision;
  account_summary: AccountSummaryItem[];
}

export interface BacktestSnapshot {
  Side: 'LONG' | 'SHORT'
  Qty: number
  'Entry Date': string
  'Entry Price': number
  'Exit Date': string
  'Exit Price': number
  'Exit Reason': string
  'PNL $': number
  'PNL %': number
}

export type TradingDecision = 'LONG' | 'SHORT' | 'STAY' | 'EXIT';