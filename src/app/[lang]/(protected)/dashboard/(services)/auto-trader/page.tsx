'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingComponent from '@/components/misc/LoadingComponent';
import { DataTable } from '@/components/dashboard/components/DataTable';

export default function Home() {
  
  const [socket, setSocket] = useState<any>(null);

  const [strategyStarted, setStrategyStarted] = useState(false);
  const [decision, setDecision] = useState<any>(null);
  const [accountSummary, setAccountSummary] = useState<any>(null);
  const [strategy, setStrategy] = useState<any>(null);

  useEffect(() => {

    const newSocket = io(`${process.env.NEXT_PUBLIC_TRADER_SOCKET_URL}:${process.env.NEXT_PUBLIC_TRADER_SOCKET_PORT}`);
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

  if (!socket || !strategyStarted) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <LoadingComponent className='w-full h-full'/>
      </div>
    )
  }

  if (strategyStarted) {
    return (
      <div className='w-full h-full grid grid-cols-4 bg-cover bg-center grid-rows-4 gap-5'>

        <Card className="w-full h-full row-span-1 col-span-1 col-start-1 row-start-1">
          <CardHeader>
            <CardTitle>Current strategy</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-y-4'>
            {strategy && 
              <div className='flex flex-col gap-y-2 w-full h-full'>
                <p className='text-2xl font-bold'>{strategy.params.name}</p>
                <p className='text-lg'>Ticker: {strategy.params.ticker}</p>
              </div>
            }
          </CardContent>
        </Card>

        <Card className="w-full h-full row-span-1 col-span-1 col-start-2 row-start-1">
          <CardHeader>
            <CardTitle>Current Decision</CardTitle>
          </CardHeader>
          <CardContent>
            {decision ? (
              <div className='flex flex-col w-full h-full'>
                <p className='text-center text-7xl font-bold'>{decision}</p>
              </div>
            ) : (
              <LoadingComponent className='w-full h-full'>
                <p>Initializing...</p>
              </LoadingComponent>
            )}
          </CardContent>
        </Card>

        <Card className='w-full h-full row-span-2 col-span-2 col-start-3 row-start-1'>
          <CardHeader>
            <CardTitle>Open Orders</CardTitle>
          </CardHeader>
          <CardContent className='flex gap-y-2 flex-col h-full w-full'>
            {strategy && strategy.params && strategy.params.openOrders ? 
              <DataTable data={strategy.params.openOrders}/> 
              : 
              <LoadingComponent className='w-full h-full'/>
            }
          </CardContent>
        </Card>

        <Card className='w-full h-full row-span-3 col-span-1 col-start-1 row-start-2'>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-y-4'> 
            {accountSummary ? accountSummary.filter((summary: any) => summary.tag === 'BuyingPower').map((summary: any) => (
              <div className='flex flex-col w-full h-full'>
                <p>{summary.tag} : {summary.value}</p>
              </div>
            )) : (
              <LoadingComponent className='w-full h-full'/>
            )}
          </CardContent>
        </Card>

        <Card className='w-full h-full row-span-1 col-span-1 col-start-2 row-start-2'>
          <CardHeader>
            <CardTitle>Current Position</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-y-4'>
            {strategy && strategy.params ? (
              <div className='flex flex-col w-full h-full'>
                <p className='text-center text-7xl font-bold'>{strategy.params.position}</p>
              </div>
            ) : (
              <LoadingComponent className='w-full h-full'/>
            )}
          </CardContent>
        </Card>

        <Card className="w-full h-full col-span-3 row-span-2 col-start-2 row-start-3">
          <CardHeader>
            <CardTitle>Recently Executed Orders</CardTitle>
          </CardHeader>
          <CardContent className='flex gap-y-2 flex-col h-64'>
            {strategy && strategy.params && strategy.params.executedOrders ? 
              <DataTable data={strategy.params.executedOrders} enablePagination pageSize={4} /> 
              : 
              <LoadingComponent className='w-full h-full'/>
            }
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}