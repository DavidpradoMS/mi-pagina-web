import { useQuery } from '@tanstack/react-query';
import { fetchRSI, fetchMACD, fetchSMA } from '../services/alphaVantageApi';
import type { TechnicalIndicators } from '../types';
import {
  getRSISignal,
  getMACDSignal,
  getPriceVsSMASignal,
  getSMACrossSignal,
} from '../utils/calculations';

export const useTechnicalIndicators = (
  symbol: string,
  currentPrice: number | undefined,
  apiKey: string | null
) => {
  const rsiQuery = useQuery({
    queryKey: ['rsi', symbol],
    queryFn: () => {
      if (!apiKey) throw new Error('API key is required');
      return fetchRSI(symbol, apiKey);
    },
    enabled: !!symbol && !!apiKey,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });

  const macdQuery = useQuery({
    queryKey: ['macd', symbol],
    queryFn: () => {
      if (!apiKey) throw new Error('API key is required');
      return fetchMACD(symbol, apiKey);
    },
    enabled: !!symbol && !!apiKey,
    staleTime: 15 * 60 * 1000,
    retry: 2,
  });

  const sma50Query = useQuery({
    queryKey: ['sma50', symbol],
    queryFn: () => {
      if (!apiKey) throw new Error('API key is required');
      return fetchSMA(symbol, 50, apiKey);
    },
    enabled: !!symbol && !!apiKey,
    staleTime: 15 * 60 * 1000,
    retry: 2,
  });

  const sma200Query = useQuery({
    queryKey: ['sma200', symbol],
    queryFn: () => {
      if (!apiKey) throw new Error('API key is required');
      return fetchSMA(symbol, 200, apiKey);
    },
    enabled: !!symbol && !!apiKey,
    staleTime: 15 * 60 * 1000,
    retry: 2,
  });

  const indicators: TechnicalIndicators = {};

  if (rsiQuery.data !== undefined && rsiQuery.data !== null) {
    indicators.rsi = getRSISignal(rsiQuery.data);
  }

  if (macdQuery.data) {
    indicators.macd = getMACDSignal(macdQuery.data.macd, macdQuery.data.signal);
  }

  if (currentPrice && sma50Query.data) {
    indicators.priceVsSma50 = getPriceVsSMASignal(currentPrice, sma50Query.data);
    indicators.sma50 = {
      name: 'SMA50',
      value: sma50Query.data,
      signal: 'neutral',
      description: `50-day moving average: ${sma50Query.data.toFixed(2)}`,
    };
  }

  if (sma200Query.data) {
    indicators.sma200 = {
      name: 'SMA200',
      value: sma200Query.data,
      signal: 'neutral',
      description: `200-day moving average: ${sma200Query.data.toFixed(2)}`,
    };
  }

  if (sma50Query.data && sma200Query.data) {
    indicators.sma50VsSma200 = getSMACrossSignal(
      sma50Query.data,
      sma200Query.data
    );
  }

  const isLoading =
    rsiQuery.isLoading ||
    macdQuery.isLoading ||
    sma50Query.isLoading ||
    sma200Query.isLoading;

  const error =
    rsiQuery.error || macdQuery.error || sma50Query.error || sma200Query.error;

  return {
    indicators,
    isLoading,
    error,
  };
};
