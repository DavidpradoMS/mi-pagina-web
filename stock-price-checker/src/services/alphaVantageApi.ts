import type {
  AlphaVantageQuoteResponse,
  AlphaVantageForexResponse,
  AlphaVantageTechnicalResponse,
  StockQuote,
  ForexRate,
} from '../types';

const BASE_URL = 'https://www.alphavantage.co/query';

export const endpoints = {
  quote: (symbol: string, apiKey: string) =>
    `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,

  forex: (from: string, to: string, apiKey: string) =>
    `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${apiKey}`,

  rsi: (symbol: string, apiKey: string) =>
    `${BASE_URL}?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`,

  macd: (symbol: string, apiKey: string) =>
    `${BASE_URL}?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${apiKey}`,

  sma: (symbol: string, period: number, apiKey: string) =>
    `${BASE_URL}?function=SMA&symbol=${symbol}&interval=daily&time_period=${period}&series_type=close&apikey=${apiKey}`,
};

export const fetchStockQuote = async (
  symbol: string,
  apiKey: string
): Promise<StockQuote> => {
  const response = await fetch(endpoints.quote(symbol, apiKey));
  const data: AlphaVantageQuoteResponse = await response.json();

  if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
    throw new Error('Invalid symbol or API limit reached');
  }

  const quote = data['Global Quote'];

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    volume: parseFloat(quote['06. volume']),
    previousClose: parseFloat(quote['08. previous close']),
    timestamp: quote['07. latest trading day'],
  };
};

export const fetchForexRate = async (
  from: string,
  to: string,
  apiKey: string
): Promise<ForexRate> => {
  const response = await fetch(endpoints.forex(from, to, apiKey));
  const data: AlphaVantageForexResponse = await response.json();

  if (!data['Realtime Currency Exchange Rate']) {
    throw new Error('Failed to fetch forex rate');
  }

  const rate = data['Realtime Currency Exchange Rate'];

  return {
    from: rate['1. From_Currency Code'],
    to: rate['3. To_Currency Code'],
    rate: parseFloat(rate['5. Exchange Rate']),
    timestamp: rate['6. Last Refreshed'],
  };
};

export const fetchRSI = async (
  symbol: string,
  apiKey: string
): Promise<number | null> => {
  const response = await fetch(endpoints.rsi(symbol, apiKey));
  const data: AlphaVantageTechnicalResponse = await response.json();

  const rsiData = data['Technical Analysis: RSI'];
  if (!rsiData) return null;

  const dates = Object.keys(rsiData).sort().reverse();
  if (dates.length === 0) return null;

  return parseFloat(rsiData[dates[0]].RSI);
};

export const fetchMACD = async (
  symbol: string,
  apiKey: string
): Promise<{ macd: number; signal: number; hist: number } | null> => {
  const response = await fetch(endpoints.macd(symbol, apiKey));
  const data: AlphaVantageTechnicalResponse = await response.json();

  const macdData = data['Technical Analysis: MACD'];
  if (!macdData) return null;

  const dates = Object.keys(macdData).sort().reverse();
  if (dates.length === 0) return null;

  const latest = macdData[dates[0]];
  return {
    macd: parseFloat(latest.MACD),
    signal: parseFloat(latest.MACD_Signal),
    hist: parseFloat(latest.MACD_Hist),
  };
};

export const fetchSMA = async (
  symbol: string,
  period: number,
  apiKey: string
): Promise<number | null> => {
  const response = await fetch(endpoints.sma(symbol, period, apiKey));
  const data: AlphaVantageTechnicalResponse = await response.json();

  const smaData = data['Technical Analysis: SMA'];
  if (!smaData) return null;

  const dates = Object.keys(smaData).sort().reverse();
  if (dates.length === 0) return null;

  return parseFloat(smaData[dates[0]].SMA);
};
