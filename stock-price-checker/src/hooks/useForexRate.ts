import { useQuery } from '@tanstack/react-query';
import { fetchForexRate } from '../services/alphaVantageApi';
import type { ForexRate } from '../types';

export const useForexRate = (
  from: string,
  to: string,
  apiKey: string | null
) => {
  return useQuery<ForexRate>({
    queryKey: ['forex', from, to],
    queryFn: () => {
      if (!apiKey) throw new Error('API key is required');
      return fetchForexRate(from, to, apiKey);
    },
    enabled: !!apiKey && !!from && !!to,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
