'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card } from "@/components/ui/card";
import LoadingComponent from '@/components/misc/LoadingComponent';
import { DataTable } from '@/components/misc/DataTable';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, DollarSign, BarChart3, Clock, TrendingUp, Briefcase } from 'lucide-react';

const AutoTrader = () => {
  
  const [socket, setSocket] = useState<any>(null);

  const [strategyStarted, setStrategyStarted] = useState(false);
  const [decision, setDecision] = useState<any>(null);
  const [accountSummary, setAccountSummary] = useState<any>(null);
  const [strategy, setStrategy] = useState<any>(null);

  const socketURL = process.env.DEV_MODE === 'true' ? 'ws://127.0.0.1:4444' : 'NULL';

  useEffect(() => {

    const newSocket = io(socketURL);
    setSocket(newSocket);

    newSocket.on('connected', (data: any) => {
      console.log('Connected to Trader', data);
      if (data['status'] !== 'success') {
        throw new Error('Error connecting to Trader');
      }
      setStrategyStarted(true);
      setDecision(data['content']['decision']);
      setStrategy(data['content']['strategy']);
      setAccountSummary(data['content']['account_summary']);
    });

    newSocket.on('disconnected', () => {
      console.log('Disconnected from Trader');
    });

    newSocket.on('strategy_started', (data: any) => {
      console.log('Strategy started', data);
      setStrategyStarted(true);
    });

    newSocket.on('strategy_stopped', (data: any) => {
      console.log('Strategy stopped', data);
      setStrategyStarted(false);
    });

    newSocket.on('pong', (data: any) => {
      console.log('Pong', data);
      setDecision(data['content']['decision']);
      setStrategy(data['content']['strategy']);
      setAccountSummary(data['content']['account_summary']);
    });

    return () => {
      newSocket.disconnect();
    };

  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (socket && strategyStarted) {
      interval = setInterval(() => {
        socket.emit('ping');
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [socket, strategyStarted]);

  const getDecisionColor = (decision: string) => {
    switch(decision) {
      case 'BUY': return 'bg-green-100 text-green-800';
      case 'SELL': return 'bg-red-100 text-red-800';
      case 'STAY': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch(decision) {
      case 'BUY': return <ArrowUpCircle className="h-10 w-10 text-green-500" />;
      case 'SELL': return <ArrowDownCircle className="h-10 w-10 text-red-500" />;
      case 'STAY': return <MinusCircle className="h-10 w-10 text-blue-500" />;
      default: return null;
    }
  };

  if (!socket || !strategyStarted) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <LoadingComponent className='w-full h-full'/>
      </div>
    )
  }

  if (strategyStarted) {
    return (
      <div className='w-full h-full p-4'>
        <Card className="w-full h-full p-6 bg-background">
          <div className='space-y-4'>
            {/* Header Section */}
            <div className='border rounded-lg p-4 bg-background'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <BarChart3 className="h-8 w-8 mr-3 text-primary" />
                  <div>
                    <h1 className='text-2xl font-bold text-foreground'>Automated Trading Dashboard</h1>
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

            <div className='grid grid-cols-12 gap-4'>
              {/* Strategy and Position Info */}
              <div className='col-span-12 md:col-span-4'>
                <div className="h-full border rounded-lg p-4 bg-background">
                  <div className="flex items-center mb-4">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Strategy Details</h2>
                  </div>
                  {strategy && strategy.params ? (
                    <div className='space-y-4'>
                      <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                        <span className='text-muted-foreground'>Strategy Name</span>
                        <span className='font-bold text-primary'>{strategy.params.name || 'Ichimogu Base'}</span>
                      </div>
                      <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                        <span className='text-muted-foreground'>Contracts</span>
                        <div className='flex gap-2'>
                          {strategy.params.contracts.map((contract: any) => (
                            <span key={contract.symbol} className='font-bold text-foreground'>{contract.symbol}</span>
                          ))}
                        </div>
                      </div>
                      <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                        <span className='text-muted-foreground'>Current Position</span>
                        <span className={`font-bold ${strategy.params.position > 0 ? 'text-green-500' : strategy.params.position < 0 ? 'text-red-500' : 'text-foreground'}`}>
                          {strategy.params.position}
                        </span>
                      </div>
                      <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                        <span className='text-muted-foreground'>Tenkan</span>
                        <span className={`font-bold text-foreground`}>
                          {strategy.params.tenkan}
                        </span>
                      </div>
                      <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                        <span className='text-muted-foreground'>Kijun</span>
                        <span className={`font-bold text-foreground`}>
                          {strategy.params.kijun}
                        </span>
                      </div>
                      <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                        <span className='text-muted-foreground'>PSAR MES</span>
                        <span className={`font-bold text-foreground`}>
                          {strategy.params.current_psar_mes.toFixed(2)}
                        </span>
                      </div>
                      <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                        <span className='text-muted-foreground'>PSAR MYM</span>
                        <span className={`font-bold text-foreground`}>
                          {strategy.params.current_psar_mym.toFixed(2)}
                        </span>
                      </div>
                      <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                        <span className='text-muted-foreground'>Number of Contracts</span>
                        <span className={`font-bold text-foreground`}>
                          {strategy.params.number_of_contracts}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <LoadingComponent className='w-full h-full'/>
                  )}
                </div>
              </div>

              {/* Market Data */}
              <div className='col-span-12 md:col-span-4'>
                <div className="h-full w-full flex flex-col border rounded-lg p-4 bg-background">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Last Market Data</h2>
                  </div>
                  {strategy && strategy.params && strategy.params.historicalData ? (
                    <div className='w-full'>
                      {Object.entries(strategy.params.historicalData).map(([symbol, data]: [string, any]) => (
                        <div key={symbol} className='w-full'>
                          <span className='text-sm font-semibold text-primary'>{symbol}</span>
                          <div className='grid grid-cols-2 grid-rows-2 gap-2 w-full'>
                            <div className='flex flex-col h-16 w-full items-center justify-center bg-muted rounded-lg'>
                              <span className='text-xs text-muted-foreground'>Open</span>
                              <span className='font-bold text-lg text-foreground'>{data.length > 0 ? data[data.length - 1].open : 'Data not available'}</span>
                            </div>
                            <div className='flex flex-col h-16 w-full items-center justify-center bg-muted rounded-lg'>
                              <span className='text-xs text-muted-foreground'>High</span>
                              <span className='font-bold text-lg text-green-500'>{data.length > 0 ? data[data.length - 1].high : 'Data not available'}</span>
                            </div>
                            <div className='flex flex-col h-16 w-full items-center justify-center bg-muted rounded-lg'>
                              <span className='text-xs text-muted-foreground'>Low</span>
                              <span className='font-bold text-lg text-red-500'>{data.length > 0 ? data[data.length - 1].low : 'Data not available'}</span>
                            </div>
                            <div className='flex flex-col h-16 w-full items-center justify-center bg-muted rounded-lg'>
                              <span className='text-xs text-muted-foreground'>Close</span>
                              <span className='font-bold text-lg text-foreground'>{data.length > 0 ? data[data.length - 1].close : 'Data not available'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <LoadingComponent className='w-full h-full'/>
                  )}
                </div>
              </div>

              {/* Account Summary */}
              <div className='col-span-12 md:col-span-4'>
                <div className='flex flex-col h-full border rounded-lg p-4 bg-background'>
                  <div className="flex items-center mb-4">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Account Summary</h2>
                  </div>
                  {accountSummary ? (
                    <div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
                      {[
                        { tag: 'BuyingPower', icon: <DollarSign className="h-4 w-4" /> },
                        { tag: 'BuyingPower', icon: <DollarSign className="h-4 w-4" /> },
                        { tag: 'BuyingPower', icon: <DollarSign className="h-4 w-4" /> },
                        { tag: 'BuyingPower', icon: <DollarSign className="h-4 w-4" /> },
                        { tag: 'UnrealizedPnL', icon: <TrendingUp className="h-4 w-4" /> },
                        { tag: 'RealizedPnL', icon: <TrendingUp className="h-4 w-4" /> },
                      ].map((item) => {
                        const summary = accountSummary.find((s: any) => s.tag === item.tag);
                        return summary ? (
                          <div key={item.tag} className='flex h-20 w-full flex-col p-4 bg-muted rounded-lg'>
                            <div className='flex items-center gap-2 mb-1 text-muted-foreground'>
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
                              {summary.currency ? `${summary.value} ${summary.currency}` : summary.value}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <LoadingComponent className='w-full h-full'/>
                  )}
                </div>
              </div>

              {/* Open Orders */}
              <div className='col-span-12 md:col-span-6'>
                <div className='h-full border rounded-lg p-4 bg-background'>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Open Orders</h2>
                  {strategy && strategy.params && strategy.params.openOrders ? (
                    strategy.params.openOrders.length > 0 ? (
                      <DataTable data={strategy.params.openOrders}/>
                    ) : (
                      <div className='text-center py-8 text-muted-foreground'>
                        <p>No open orders at this time</p>
                      </div>
                    )
                  ) : (
                    <LoadingComponent className='w-full h-full'/>
                  )}
                </div>
              </div>

              {/* Recently Executed Orders */}
              <div className='col-span-12 md:col-span-6'>
                <div className="border rounded-lg p-4 bg-background">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Recently Executed Orders</h2>
                  {strategy && strategy.params && strategy.params.executedOrders ? (
                    strategy.params.executedOrders.length > 0 ? (
                      <DataTable 
                        data={strategy.params.executedOrders} 
                        enablePagination 
                        pageSize={5} 
                      />
                    ) : (
                      <div className='text-center py-8 text-muted-foreground'>
                        <p>No executed orders yet</p>
                      </div>
                    )
                  ) : (
                    <LoadingComponent className='w-full h-full'/>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return null
}

export default AutoTrader