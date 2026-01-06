import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TechnicalIndicators as TechnicalIndicatorsType } from '../types';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicatorsType;
}

export const TechnicalIndicators = ({ indicators }: TechnicalIndicatorsProps) => {
  const indicatorsList = [
    indicators.rsi,
    indicators.macd,
    indicators.priceVsSma50,
    indicators.sma50VsSma200,
  ].filter((indicator) => indicator !== undefined);

  if (indicatorsList.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-bold">Technical Indicators</h3>
        </div>
        <p className="text-textMuted">Loading indicators...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-accent" />
        <h3 className="text-xl font-bold">Technical Indicators</h3>
      </div>

      <div className="space-y-4">
        {indicatorsList.map((indicator, index) => {
          if (!indicator) return null;

          const Icon =
            indicator.signal === 'bullish'
              ? TrendingUp
              : indicator.signal === 'bearish'
              ? TrendingDown
              : Minus;

          const bgColor =
            indicator.signal === 'bullish'
              ? 'bg-bullish/20'
              : indicator.signal === 'bearish'
              ? 'bg-bearish/20'
              : 'bg-neutral/20';

          const textColor =
            indicator.signal === 'bullish'
              ? 'text-bullish'
              : indicator.signal === 'bearish'
              ? 'text-bearish'
              : 'text-neutral';

          const borderColor =
            indicator.signal === 'bullish'
              ? 'border-bullish'
              : indicator.signal === 'bearish'
              ? 'border-bearish'
              : 'border-neutral';

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${borderColor} ${bgColor}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${textColor}`} />
                    <h4 className="font-semibold">{indicator.name}</h4>
                  </div>
                  <p className="text-sm text-textMuted mb-2">
                    {indicator.description}
                  </p>
                  <p className="text-xs text-textMuted">
                    Value: {indicator.value.toFixed(2)}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${textColor} ${bgColor}`}
                >
                  {indicator.signal === 'bullish'
                    ? 'Bullish'
                    : indicator.signal === 'bearish'
                    ? 'Bearish'
                    : 'Neutral'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-background rounded-lg">
        <h4 className="font-semibold mb-2 text-sm">Signal Legend</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-bullish rounded-full" />
            <span className="text-textMuted">Bullish - Buy signal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-neutral rounded-full" />
            <span className="text-textMuted">Neutral - Hold</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-bearish rounded-full" />
            <span className="text-textMuted">Bearish - Sell signal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TechnicalIndicatorsSkeleton = () => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <div className="skeleton w-5 h-5 rounded" />
        <div className="skeleton h-6 w-40" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-24 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
};
