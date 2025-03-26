'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';
import SingleChart from './Chart';
import Chart from './Chart';
import EquityCurveChart from './EquityCurveChart';

interface BacktestData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  decision: string;
  position: number;
  daily_return: number;
  cumulative_returns: number;
  equity: number;
  entry_price: number;
  contracts: number;
  tenkan: number;
  kijun: number;
  psar_mes: number;
  psar_mym: number;
}

const Backtest = () => {
  const [backtestData, setBacktestData] = useState<BacktestData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      
      const data: BacktestData[] = rows.slice(1)
        .filter(row => row.trim()) // Filter out empty rows
        .map(row => {
          const values = row.split(',');
          return {
            date: values[0]?.trim() || '',
            open: Number(values[1]) || 0,
            high: Number(values[2]) || 0,
            low: Number(values[3]) || 0,
            close: Number(values[4]) || 0,
            volume: Number(values[5]) || 0,
            decision: values[6]?.trim() || 'STAY',
            position: Number(values[7]) || 0,
            daily_return: Number(values[8]) || 0,
            cumulative_returns: Number(values[9]) || 1,
            equity: Number(values[10]) || 0,
            entry_price: Number(values[11]) || 0,
            contracts: Number(values[12]) || 0,
            tenkan: Number(values[13]) || 0,
            kijun: Number(values[14]) || 0,
            psar_mes: Number(values[15]) || 0,
            psar_mym: Number(values[16]) || 0
          };
        });

      setBacktestData(data);
    } catch (err) {
      setError('Error parsing CSV file. Please check the file format.');
      console.error('Error parsing CSV:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    switch(decision) {
      case 'BUY': return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'SELL': return 'bg-red-100 hover:bg-red-200 text-red-800';
      case 'STAY': return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
      default: return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch(decision) {
      case 'BUY': return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
      case 'SELL': return <ArrowDownCircle className="h-4 w-4 text-red-500" />;
      case 'STAY': return <MinusCircle className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    // Handle empty or invalid date strings
    if (!dateString || dateString.trim() === '') {
      return '';
    }

    // Split the date string into parts (assuming format like "2024-03-21 09:30:00")
    const [datePart] = dateString.split(' ');
    
    // Validate the date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      console.error('Invalid date format:', dateString);
      return '';
    }

    return datePart; // Already in yyyy-mm-dd format
  };

  const chartData = {
    'ES': backtestData
      .filter(candle => formatDate(candle.date)) // Filter out invalid dates
      .map(candle => ({
        date: formatDate(candle.date),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }))
  };

  const equityChartData = {
    'Equity': backtestData
      .filter(candle => formatDate(candle.date))
      .map(candle => ({
        date: formatDate(candle.date),
        value: candle.equity,
      }))
  };

  const decisionHistory = backtestData
    .filter(d => formatDate(d.date)) // Remove the filter for STAY decisions
    .map(d => ({
      id: new Date(d.date).getTime(),
      decision: d.decision as 'BUY' | 'SELL' | 'STAY' | 'SELLSHORT',
      created: formatDate(d.date),
      updated: formatDate(d.date)
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Backtest Results</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('csv-upload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload CSV
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {backtestData.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg">
              <div className="text-sm text-muted-foreground">Total Return</div>
              <div className="text-2xl font-bold">
                {(((backtestData[backtestData.length - 1]?.cumulative_returns || 1) - 1) * 100 / 100).toFixed(2)}%
              </div>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <div className="text-sm text-muted-foreground">Final Equity</div>
              <div className="text-2xl font-bold">
                ${(backtestData[backtestData.length - 1]?.equity || 0).toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <div className="text-sm text-muted-foreground">Number of Trades</div>
              <div className="text-2xl font-bold">
                {backtestData.filter(d => d.decision !== 'STAY').length}
              </div>
            </div>
          </div>

          <Chart
            data={chartData}
            indicators={[]}
            decisionHistory={decisionHistory}
          />
          
          <div className="mt-8">
            <EquityCurveChart
              data={backtestData
                .filter(candle => formatDate(candle.date))
                .map(candle => ({
                  date: formatDate(candle.date),
                  value: candle.equity,
                }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Backtest; 