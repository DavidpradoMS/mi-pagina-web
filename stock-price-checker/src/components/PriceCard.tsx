import { TrendingUp, TrendingDown } from 'lucide-react';
import type { StockQuote } from '../types';
import {
  formatCurrency,
  formatPercent,
  formatVolume,
  formatDate,
} from '../utils/formatters';

interface PriceCardProps {
  quote: StockQuote;
  eurPrice?: number;
}

export const PriceCard = ({ quote, eurPrice }: PriceCardProps) => {
  const isPositive = quote.change >= 0;
  const rangePercent = ((quote.price - quote.low) / (quote.high - quote.low)) * 100;

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">{quote.symbol}</h2>
          <p className="text-textMuted text-sm">
            Last updated: {formatDate(quote.timestamp)}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
            isPositive ? 'bg-bullish/20 text-bullish' : 'bg-bearish/20 text-bearish'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="font-semibold">{formatPercent(quote.changePercent)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-textMuted text-sm mb-1">USD Price</p>
          <p className="text-4xl font-bold">{formatCurrency(quote.price, 'USD')}</p>
          <p
            className={`text-lg mt-1 ${
              isPositive ? 'text-bullish' : 'text-bearish'
            }`}
          >
            {isPositive ? '+' : ''}
            {formatCurrency(quote.change, 'USD')}
          </p>
        </div>

        {eurPrice && (
          <div>
            <p className="text-textMuted text-sm mb-1">EUR Price</p>
            <p className="text-4xl font-bold">{formatCurrency(eurPrice, 'EUR')}</p>
            <p className="text-sm text-textMuted mt-1">Approximate conversion</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-textMuted">Day Range</span>
            <span>
              {formatCurrency(quote.low)} - {formatCurrency(quote.high)}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-accent rounded-full relative">
              <div
                className="absolute h-full bg-gradient-to-r from-bearish via-neutral to-bullish"
                style={{ width: '100%' }}
              />
              <div
                className="absolute h-full bg-white rounded-full"
                style={{
                  width: '4px',
                  left: `${rangePercent}%`,
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-textMuted text-sm">Previous Close</p>
            <p className="font-semibold">{formatCurrency(quote.previousClose)}</p>
          </div>
          <div>
            <p className="text-textMuted text-sm">Volume</p>
            <p className="font-semibold">{formatVolume(quote.volume)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PriceCardSkeleton = () => {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="skeleton h-8 w-24 mb-2" />
          <div className="skeleton h-4 w-40" />
        </div>
        <div className="skeleton h-8 w-20 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="skeleton h-4 w-20 mb-2" />
          <div className="skeleton h-12 w-32 mb-2" />
          <div className="skeleton h-6 w-24" />
        </div>
        <div>
          <div className="skeleton h-4 w-20 mb-2" />
          <div className="skeleton h-12 w-32 mb-2" />
          <div className="skeleton h-4 w-32" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-2 w-full rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
        </div>
      </div>
    </div>
  );
};
