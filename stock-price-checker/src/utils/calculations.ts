import type { SpreadAnalysis, TechnicalSignal } from '../types';

export const calculateSpread = (
  tradeRepublicPrice: number,
  marketPrice: number
): SpreadAnalysis => {
  const spreadAbsolute = tradeRepublicPrice - marketPrice;
  const spreadPercent = (spreadAbsolute / marketPrice) * 100;

  let rating: 'good' | 'moderate' | 'high';
  if (Math.abs(spreadPercent) < 0.3) {
    rating = 'good';
  } else if (Math.abs(spreadPercent) < 1) {
    rating = 'moderate';
  } else {
    rating = 'high';
  }

  return {
    tradeRepublicPrice,
    marketPrice,
    spreadAbsolute,
    spreadPercent,
    rating,
  };
};

export const getRSISignal = (rsi: number): TechnicalSignal => {
  let signal: 'bullish' | 'bearish' | 'neutral';
  let description: string;

  if (rsi < 30) {
    signal = 'bullish';
    description = 'Oversold - Potential buying opportunity';
  } else if (rsi > 70) {
    signal = 'bearish';
    description = 'Overbought - Consider taking profits';
  } else {
    signal = 'neutral';
    description = 'RSI in neutral range';
  }

  return {
    name: 'RSI (14)',
    value: rsi,
    signal,
    description,
  };
};

export const getMACDSignal = (
  macd: number,
  signal: number
): TechnicalSignal => {
  const diff = macd - signal;
  let signalType: 'bullish' | 'bearish' | 'neutral';
  let description: string;

  if (macd > signal && diff > 0.1) {
    signalType = 'bullish';
    description = 'MACD above signal - Bullish momentum';
  } else if (macd < signal && diff < -0.1) {
    signalType = 'bearish';
    description = 'MACD below signal - Bearish momentum';
  } else {
    signalType = 'neutral';
    description = 'MACD near signal line';
  }

  return {
    name: 'MACD',
    value: macd,
    signal: signalType,
    description,
  };
};

export const getPriceVsSMASignal = (
  price: number,
  sma: number
): TechnicalSignal => {
  const diff = ((price - sma) / sma) * 100;
  let signal: 'bullish' | 'bearish' | 'neutral';
  let description: string;

  if (diff > 2) {
    signal = 'bullish';
    description = `Price ${diff.toFixed(1)}% above SMA50`;
  } else if (diff < -2) {
    signal = 'bearish';
    description = `Price ${Math.abs(diff).toFixed(1)}% below SMA50`;
  } else {
    signal = 'neutral';
    description = `Price near SMA50 (${diff > 0 ? '+' : ''}${diff.toFixed(1)}%)`;
  }

  return {
    name: 'Price vs SMA50',
    value: price,
    signal,
    description,
  };
};

export const getSMACrossSignal = (
  sma50: number,
  sma200: number
): TechnicalSignal => {
  const diff = ((sma50 - sma200) / sma200) * 100;
  let signal: 'bullish' | 'bearish' | 'neutral';
  let description: string;

  if (diff > 2) {
    signal = 'bullish';
    description = 'Golden Cross - Strong bullish signal';
  } else if (diff < -2) {
    signal = 'bearish';
    description = 'Death Cross - Strong bearish signal';
  } else {
    signal = 'neutral';
    description = 'SMAs converging';
  }

  return {
    name: 'SMA50 vs SMA200',
    value: sma50,
    signal,
    description,
  };
};

export const calculateDecisionScore = (
  indicators: TechnicalSignal[]
): { score: number; total: number; recommendation: string } => {
  const bullish = indicators.filter((i) => i.signal === 'bullish').length;
  const bearish = indicators.filter((i) => i.signal === 'bearish').length;
  const total = indicators.length;

  let recommendation: string;
  if (bullish > bearish && bullish / total >= 0.6) {
    recommendation = 'Strong Buy Signal';
  } else if (bullish > bearish) {
    recommendation = 'Buy Signal';
  } else if (bearish > bullish && bearish / total >= 0.6) {
    recommendation = 'Strong Sell Signal';
  } else if (bearish > bullish) {
    recommendation = 'Sell Signal';
  } else {
    recommendation = 'Hold - Mixed Signals';
  }

  return {
    score: bullish,
    total,
    recommendation,
  };
};
