import { DollarSign } from 'lucide-react';
import type { ForexRate as ForexRateType } from '../types';
import { formatNumber, formatDateTime } from '../utils/formatters';

interface ForexRateProps {
  rate: ForexRateType;
}

export const ForexRate = ({ rate }: ForexRateProps) => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-accent" />
        <h3 className="text-xl font-bold">Exchange Rate</h3>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold">{formatNumber(rate.rate, 4)}</span>
        <span className="text-textMuted">
          {rate.from}/{rate.to}
        </span>
      </div>

      <p className="text-textMuted text-sm">
        Updated: {formatDateTime(rate.timestamp)}
      </p>

      <div className="mt-4 p-3 bg-background rounded-lg">
        <p className="text-sm text-textMuted">
          1 {rate.from} = {formatNumber(rate.rate, 4)} {rate.to}
        </p>
        <p className="text-sm text-textMuted">
          1 {rate.to} = {formatNumber(1 / rate.rate, 4)} {rate.from}
        </p>
      </div>
    </div>
  );
};

export const ForexRateSkeleton = () => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton w-5 h-5 rounded" />
        <div className="skeleton h-6 w-32" />
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <div className="skeleton h-9 w-24" />
        <div className="skeleton h-5 w-16" />
      </div>

      <div className="skeleton h-4 w-40 mb-4" />

      <div className="skeleton h-16 w-full rounded-lg" />
    </div>
  );
};
