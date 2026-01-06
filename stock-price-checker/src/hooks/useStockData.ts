import { useQuery } from '@tanstack/react-query';
import { fetchStockQuote } from '../services/alphaVantageApi';
import type { StockQuote } from '../types';

export const useStockData = (symbol: string, apiKey: string | null) => {
  return useQuery<StockQuote>({
    queryKey: ['stock', symbol],
    queryFn: () => {
      if (!apiKey) throw new Error('API key is required');
      return fetchStockQuote(symbol, apiKey);
    },
    enabled: !!symbol && !!apiKey && symbol.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
