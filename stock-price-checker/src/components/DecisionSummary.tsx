import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TechnicalSignal } from '../types';
import { calculateDecisionScore } from '../utils/calculations';

interface DecisionSummaryProps {
  indicators: TechnicalSignal[];
  spreadRating?: 'good' | 'moderate' | 'high';
}

export const DecisionSummary = ({
  indicators,
  spreadRating,
}: DecisionSummaryProps) => {
  if (indicators.length === 0) {
    return null;
  }

  const { score, total } = calculateDecisionScore(indicators);

  const bullishCount = indicators.filter((i) => i.signal === 'bullish').length;
  const bearishCount = indicators.filter((i) => i.signal === 'bearish').length;
  const neutralCount = indicators.filter((i) => i.signal === 'neutral').length;

  const getOverallRating = () => {
    if (spreadRating === 'high') {
      return {
        text: 'Consider Waiting',
        color: 'text-bearish',
        bgColor: 'bg-bearish/20',
        description: 'High spread detected - better to wait for lower execution costs',
      };
    }

    if (bullishCount >= total * 0.6) {
      return {
        text: 'Strong Buy',
        color: 'text-bullish',
        bgColor: 'bg-bullish/20',
        description: 'Majority of indicators show bullish signals',
      };
    } else if (bearishCount >= total * 0.6) {
      return {
        text: 'Strong Sell',
        color: 'text-bearish',
        bgColor: 'bg-bearish/20',
        description: 'Majority of indicators show bearish signals',
      };
    } else if (bullishCount > bearishCount) {
      return {
        text: 'Buy',
        color: 'text-bullish',
        bgColor: 'bg-bullish/20',
        description: 'More bullish than bearish signals',
      };
    } else if (bearishCount > bullishCount) {
      return {
        text: 'Sell',
        color: 'text-bearish',
        bgColor: 'bg-bearish/20',
        description: 'More bearish than bullish signals',
      };
    } else {
      return {
        text: 'Hold',
        color: 'text-neutral',
        bgColor: 'bg-neutral/20',
        description: 'Mixed signals - no clear direction',
      };
    }
  };

  const rating = getOverallRating();

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-accent" />
        <h3 className="text-xl font-bold">Decision Summary</h3>
      </div>

      <div className={`p-6 rounded-lg ${rating.bgColor} mb-6`}>
        <div className="text-center">
          <p className="text-textMuted text-sm mb-2">Overall Recommendation</p>
          <p className={`text-3xl font-bold mb-2 ${rating.color}`}>
            {rating.text}
          </p>
          <p className="text-sm text-textMuted">{rating.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-bullish/10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-bullish mx-auto mb-2" />
          <p className="text-2xl font-bold text-bullish">{bullishCount}</p>
          <p className="text-xs text-textMuted">Bullish</p>
        </div>
        <div className="text-center p-4 bg-neutral/10 rounded-lg">
          <Minus className="w-6 h-6 text-neutral mx-auto mb-2" />
          <p className="text-2xl font-bold text-neutral">{neutralCount}</p>
          <p className="text-xs text-textMuted">Neutral</p>
        </div>
        <div className="text-center p-4 bg-bearish/10 rounded-lg">
          <TrendingDown className="w-6 h-6 text-bearish mx-auto mb-2" />
          <p className="text-2xl font-bold text-bearish">{bearishCount}</p>
          <p className="text-xs text-textMuted">Bearish</p>
        </div>
      </div>

      <div className="p-4 bg-background rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-textMuted">Signal Strength</span>
          <span className="text-sm font-semibold">
            {score}/{total} Positive
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              score / total >= 0.6
                ? 'bg-bullish'
                : score / total <= 0.4
                ? 'bg-bearish'
                : 'bg-neutral'
            }`}
            style={{ width: `${(score / total) * 100}%` }}
          />
        </div>
      </div>

      {spreadRating && (
        <div className="mt-4 p-3 bg-background rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-textMuted">Spread Rating:</span>
            <span
              className={`font-semibold ${
                spreadRating === 'good'
                  ? 'text-bullish'
                  : spreadRating === 'moderate'
                  ? 'text-neutral'
                  : 'text-bearish'
              }`}
            >
              {spreadRating === 'good'
                ? 'Good'
                : spreadRating === 'moderate'
                ? 'Moderate'
                : 'High'}
            </span>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-background rounded-lg text-xs text-textMuted">
        <p className="mb-2">
          <strong>Disclaimer:</strong> This analysis is based on technical
          indicators and should not be considered as financial advice.
        </p>
        <p>
          Always do your own research and consider multiple factors before making
          investment decisions.
        </p>
      </div>
    </div>
  );
};
