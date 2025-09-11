'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card } from "@/components/ui/card";
import LoadingComponent from '@/components/misc/LoadingComponent';
import { DataTable } from '@/components/misc/DataTable';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, DollarSign, BarChart3, TrendingUp, Briefcase, Settings, Target, Activity, Hash, Zap, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TraderChart from './TraderChart';
import {
  Strategy,
  TradingDecision,
  AccountSummaryItem,
  ContractData,
  OrderData,
  PositionData,
  Snapshot
} from '@/lib/tools/trader';
import { toast } from '@/hooks/use-toast';  
import { getDecisionColor, getDecisionIcon } from '@/utils/tools/trader';
import { formatDateFromTimestamp } from '@/utils/dates';
import Backtest from './Backtest';

const AutoTrader = () => {
  
  const [socket, setSocket] = useState<any>(null);

  const [trades, setTrades] = useState<any>(null);
  const [decision, setDecision] = useState<TradingDecision | null>(null);
  const [accountSummary, setAccountSummary] = useState<AccountSummaryItem[] | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [history, setHistory] = useState<Snapshot[]>([]);

  //const socketURL = process.env.DEV_MODE === 'true' ? 'http://localhost:3333' : 'NULL';
  const socketURL = 'http://167.71.94.59:3333'

  useEffect(() => {

    const traderSocket = io(socketURL);
    setSocket(traderSocket)

    traderSocket.on('connected', () => {
      try {
        console.log('Connected to Trader');
        traderSocket.emit('history');
        traderSocket.emit('trades');
      } catch (error) {
        toast({
          title: 'Error connecting to Trader',
          description: 'Please check your connection and try again.',
          variant: 'destructive',
        });
      }
    });

    traderSocket.on('disconnected', () => {
      console.log('Disconnected from Trader');
    });

    traderSocket.on('trades_data', (trades: any) => {
      console.log(trades);
      setTrades(trades);
    });

    traderSocket.on('history_data', (history: Snapshot[]) => {
      console.log(history);
      if (!history || history.length === 0) return;
      setHistory(history);
      const latest = history[history.length - 1];
      setDecision(latest.decision as TradingDecision);
      setStrategy(latest.strategy);
      setAccountSummary(latest.account_summary);
    });

    return () => {
      traderSocket.disconnect();
    };

  }, []);

  // Ping every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      socket?.emit('history');
      socket?.emit('trades');
    }, 10000);
    return () => clearInterval(interval);
  }, [socket]);

  if (!socket || !socket.connected || !strategy || !accountSummary || !decision) return <LoadingComponent className='w-full h-full'/>

  return (
    <div className='w-full h-full p-4 '>
      <Card className="w-full h-fit p-6 bg-background">
        <div className='space-y-4'>
          <div className='rounded-lg p-4 bg-background'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <BarChart3 className="h-8 w-8 mr-3 text-primary" />
                <div>
                  <h1 className='text-2xl font-bold text-foreground'>{strategy.name || 'AGM Trader'}</h1>
                </div>
              </div>
              <div>
                <Badge className={`text-lg py-2 px-4 ${getDecisionColor(decision)}`}>
                  {getDecisionIcon(decision)}
                  <span className="ml-2 font-bold">{decision || 'Initializing...'}</span>
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chart">Chart Analysis</TabsTrigger>
              <TabsTrigger value="backtest">Backtest</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className='grid grid-cols-12 gap-4'>

                {/* Account Summary */}
                <div className='col-span-12 md:col-span-4'>
                  <div className='flex flex-col h-full rounded-lg p-4'>
                    <div className="flex items-center mb-4">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Account Summary</h2>
                    </div>
                    {accountSummary && (
                      <div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
                        {[
                          { tag: 'BuyingPower', icon: <DollarSign className="h-4 w-4" /> },
                          { tag: 'NetLiquidation', icon: <DollarSign className="h-4 w-4" /> },
                          { tag: 'TotalCashValue', icon: <DollarSign className="h-4 w-4" /> },
                          { tag: 'AvailableFunds', icon: <DollarSign className="h-4 w-4" /> },
                          { tag: 'UnrealizedPnL', icon: <TrendingUp className="h-4 w-4" /> },
                          { tag: 'RealizedPnL', icon: <TrendingUp className="h-4 w-4" /> },
                        ].map((item) => {
                          const summary = accountSummary.find((s: AccountSummaryItem) => s.tag === item.tag);
                          return summary ? (
                            <div key={item.tag} className='flex h-20 w-full flex-col p-4 bg-muted rounded-lg'>
                              <div className='flex items-center gap-2 text-muted-foreground'>
                                {item.icon}
                                <span className='text-sm'>{item.tag}</span>
                              </div>
                              <span className={`font-bold text-lg ${
                                item.tag.includes('PnL') 
                                  ? parseFloat(summary.value) > 0 
                                    ? 'text-green-500' 
                                    : parseFloat(summary.value) < 0 
                                      ? 'text-red-500' 
                                      : 'text-foreground'
                                  : 'text-foreground'
                              }`}>
                                {summary.currency ? `${parseFloat(summary.value).toFixed(2)} ${summary.currency}` : parseFloat(summary.value).toFixed(2)}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contract Parameters */}
                <div className='col-span-12 md:col-span-4'>
                  <div className='flex flex-col h-full rounded-lg p-4'>
                    {strategy.params.contracts.map((contractData: ContractData) => (
                      <div key={contractData.symbol} className='w-full'>
                        <div className='flex items-center gap-2 mb-3'>
                          <DollarSign className="h-5 w-5 mr-2 text-primary" />
                          <h2 className="text-lg font-semibold text-foreground">{contractData.symbol}</h2>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='flex w-full flex-col p-4 bg-muted rounded-lg'>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                              <ArrowUpCircle className="h-4 w-4" />
                              <span className='text-sm'>Open</span>
                            </div>
                            <span className='font-bold text-lg text-foreground'>
                              {contractData.data.length > 0 
                                ? contractData.data[contractData.data.length - 1].open.toFixed(2) 
                                : 'No data'
                              }
                            </span>
                          </div>
                          <div className='flex w-full flex-col p-4 bg-muted rounded-lg'>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                              <TrendingUp className="h-4 w-4" />
                              <span className='text-sm'>High</span>
                            </div>
                            <span className='font-bold text-lg text-green-500'>
                              {contractData.data.length > 0 
                                ? contractData.data[contractData.data.length - 1].high.toFixed(2) 
                                : 'No data'
                              }
                            </span>
                          </div>
                          <div className='flex w-full flex-col p-4 bg-muted rounded-lg'>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                              <ArrowDownCircle className="h-4 w-4" />
                              <span className='text-sm'>Low</span>
                            </div>
                            <span className='font-bold text-lg text-red-500'>
                              {contractData.data.length > 0 
                                ? contractData.data[contractData.data.length - 1].low.toFixed(2) 
                                : 'No data'
                              }
                            </span>
                          </div>
                          <div className='flex w-full flex-col p-4 bg-muted rounded-lg'>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                              <MinusCircle className="h-4 w-4" />
                              <span className='text-sm'>Close</span>
                            </div>
                            <span className='font-bold text-lg text-foreground'>
                              {contractData.data.length > 0 
                                ? contractData.data[contractData.data.length - 1].close.toFixed(2) 
                                : 'No data'
                              }
                            </span>
                          </div>
                          {Object.entries(strategy.params.indicators).map(([name, value]) => (
                            <div key={name} className='flex w-full flex-col p-4 bg-muted rounded-lg'>
                              <div className='flex items-center gap-2 text-muted-foreground'>
                                <Hash className="h-4 w-4" />
                                <span className='text-sm'>{name.toLocaleUpperCase()}</span>
                              </div>
                              <span className='font-bold text-lg text-foreground'>
                                {value.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className='mt-3 flex items-center gap-4 text-xs text-muted-foreground'>
                          <span>Volume: {contractData.data[contractData.data.length - 1].volume || 'N/A'}</span>
                          <span>Date: {contractData.data[contractData.data.length - 1].date}</span>
                        </div>
                      </div>
                    ))}
                    </div>
                </div>

                {/* Open Orders */}
                <div className='col-span-12'>
                  <div className='rounded-lg p-4 bg-background'>
                    <div className="flex items-center mb-4">
                      <Briefcase className="h-5 w-5 mr-2 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Open Orders</h2>
                    </div>
                    {strategy && strategy.params && strategy.params.open_orders && (
                      <div className="overflow-x-auto w-full">
                        <DataTable<OrderData> data={strategy.params.open_orders || []} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Positions */}
                <div className='col-span-12'>
                  <div className='rounded-lg p-4 bg-background'>
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Positions</h2>
                    </div>
                    {strategy && strategy.params && strategy.params.positions ? (
                      <div className="overflow-x-auto w-full">
                        <DataTable<PositionData> data={strategy.params.positions || []} />
                      </div>
                    ) : (
                      <LoadingComponent className='w-full h-full'/>
                    )}
                  </div>
                </div>

                {/* Recently Executed Orders */}
                <div className='col-span-12'>
                  <div className="rounded-lg p-4 bg-background">
                    <div className="flex items-center mb-4">
                      <ArrowDownCircle className="h-5 w-5 mr-2 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Recently Executed Orders</h2>
                    </div>
                    {strategy && strategy.params && strategy.params.executed_orders ? (
                      <div className="overflow-x-auto w-full">
                        <DataTable<OrderData>
                          data={strategy.params.executed_orders || []} 
                          enablePagination 
                          pageSize={5}
                        />
                      </div>
                    ) : (
                      <LoadingComponent className='w-full h-full'/>
                    )}
                  </div>
                </div>

              </div>
            </TabsContent>

            <TabsContent value="chart" className="mt-0">
              <div className="rounded-lg p-4 bg-background space-y-6">
                {strategy.params.contracts.map((contract, index) => {
                  const first_indicator = contract.indicators?.[Object.keys(contract.indicators)[0]] || [];
                  const decisions = history.map(snap => ({
                    time: formatDateFromTimestamp(snap.current_time),
                    decision: snap.decision,
                  }));
                  return (
                    <TraderChart
                      key={contract.symbol}
                      contract={contract}
                      indicator={first_indicator}
                      title={`${contract.symbol} Trading Chart`}
                      decisions={decisions}
                    />
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="backtest" className="mt-0">
              <Backtest trades={trades} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}

export default AutoTrader

