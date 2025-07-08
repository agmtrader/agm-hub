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

export interface BaseStrategyParams {
  position: number;
  contracts: ContractData[];
  open_orders: OrderData[];
  executed_orders: OrderData[];
  positions: PositionData[];
}

export interface IchimokuBaseParams extends BaseStrategyParams {
  tenkan: number;
  kijun: number;
  number_of_contracts: number;
  psar_mes: number[];
  psar_mym: number[];
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

export type TradingDecision = 'LONG' | 'SHORT' | 'STAY' | 'EXIT';