import { TradingDecision } from '@/lib/tools/trader';

export function getDecisionColor(decision: TradingDecision | null): string {
  switch(decision) {
    case 'LONG': return 'bg-green-100 hover:bg-green-200 text-green-800';   
    case 'SHORT': return 'bg-red-100 hover:bg-red-200 text-red-800';
    case 'STAY': return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
    case 'EXIT': return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
    default: return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
  }
}