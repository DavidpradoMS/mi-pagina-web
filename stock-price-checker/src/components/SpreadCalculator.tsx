import { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { calculateSpread } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface SpreadCalculatorProps {
  marketPrice: number;
  currency?: string;
}

export const SpreadCalculator = ({
  marketPrice,
  currency = 'USD',
}: SpreadCalculatorProps) => {
  const [trPrice, setTrPrice] = useState('');

  const analysis = trPrice
    ? calculateSpread(parseFloat(trPrice), marketPrice)
    : null;

  const getRatingConfig = (rating: 'good' | 'moderate' | 'high') => {
    switch (rating) {
      case 'good':
        return {
          icon: CheckCircle,
          color: 'text-bullish',
          bgColor: 'bg-bullish/20',
          borderColor: 'border-bullish',
          message: 'Spread aceptable',
          recommendation: 'Good time to buy!',
        };
      case 'moderate':
        return {
          icon: AlertCircle,
          color: 'text-neutral',
          bgColor: 'bg-neutral/20',
          borderColor: 'border-neutral',
          message: 'Spread moderado',
          recommendation: 'Consider waiting for a better price',
        };
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'text-bearish',
          bgColor: 'bg-bearish/20',
          borderColor: 'border-bearish',
          message: 'Spread alto',
          recommendation: 'Wait for better execution price',
        };
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-accent" />
        <h3 className="text-xl font-bold">Spread Calculator</h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Market Price ({currency})
        </label>
        <input
          type="text"
          value={formatCurrency(marketPrice, currency)}
          disabled
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-textMuted cursor-not-allowed"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Trade Republic Price ({currency})
        </label>
        <input
          type="number"
          step="0.01"
          value={trPrice}
          onChange={(e) => setTrPrice(e.target.value)}
          placeholder={`Enter price from Trade Republic`}
          className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {analysis && (
        <>
          <div
            className={`p-4 rounded-lg border-l-4 ${
              getRatingConfig(analysis.rating).borderColor
            } ${getRatingConfig(analysis.rating).bgColor} mb-4`}
          >
            <div className="flex items-start gap-3">
              {(() => {
                const Icon = getRatingConfig(analysis.rating).icon;
                return (
                  <Icon
                    className={`w-6 h-6 ${getRatingConfig(analysis.rating).color}`}
                  />
                );
              })()}
              <div className="flex-1">
                <h4
                  className={`font-semibold mb-1 ${
                    getRatingConfig(analysis.rating).color
                  }`}
                >
                  {getRatingConfig(analysis.rating).message}
                </h4>
                <p className="text-sm text-textMuted mb-2">
                  {getRatingConfig(analysis.rating).recommendation}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded-lg">
            <div>
              <p className="text-textMuted text-sm mb-1">Spread (Absolute)</p>
              <p
                className={`font-semibold ${
                  analysis.spreadAbsolute > 0 ? 'text-bearish' : 'text-bullish'
                }`}
              >
                {analysis.spreadAbsolute > 0 ? '+' : ''}
                {formatCurrency(analysis.spreadAbsolute, currency)}
              </p>
            </div>
            <div>
              <p className="text-textMuted text-sm mb-1">Spread (Percent)</p>
              <p
                className={`font-semibold ${
                  analysis.spreadPercent > 0 ? 'text-bearish' : 'text-bullish'
                }`}
              >
                {formatPercent(analysis.spreadPercent)}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-background rounded-lg text-xs text-textMuted">
            <p className="mb-1">
              ✓ Spread &lt; 0.3% - Good to trade
            </p>
            <p className="mb-1">
              ⚠ Spread 0.3% - 1% - Consider waiting
            </p>
            <p>
              ✗ Spread &gt; 1% - High spread, wait for better price
            </p>
          </div>
        </>
      )}
    </div>
  );
};
