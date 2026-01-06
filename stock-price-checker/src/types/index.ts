export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
  timestamp: string;
}

export interface ForexRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
}

export interface TechnicalSignal {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

export interface TechnicalIndicators {
  rsi?: TechnicalSignal;
  macd?: TechnicalSignal;
  sma50?: TechnicalSignal;
  sma200?: TechnicalSignal;
  priceVsSma50?: TechnicalSignal;
  sma50VsSma200?: TechnicalSignal;
}

export interface SpreadAnalysis {
  tradeRepublicPrice: number;
  marketPrice: number;
  spreadAbsolute: number;
  spreadPercent: number;
  rating: 'good' | 'moderate' | 'high';
}

export interface AlphaVantageQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

export interface AlphaVantageForexResponse {
  'Realtime Currency Exchange Rate': {
    '1. From_Currency Code': string;
    '2. From_Currency Name': string;
    '3. To_Currency Code': string;
    '4. To_Currency Name': string;
    '5. Exchange Rate': string;
    '6. Last Refreshed': string;
    '7. Time Zone': string;
    '8. Bid Price': string;
    '9. Ask Price': string;
  };
}

export interface AlphaVantageTechnicalResponse {
  'Meta Data': {
    '1: Symbol': string;
    '2: Indicator': string;
    '3: Last Refreshed': string;
    '4: Interval': string;
    '5: Time Period': number;
    '6: Series Type': string;
    '7: Time Zone': string;
  };
  'Technical Analysis: RSI'?: {
    [date: string]: {
      RSI: string;
    };
  };
  'Technical Analysis: MACD'?: {
    [date: string]: {
      MACD: string;
      MACD_Signal: string;
      MACD_Hist: string;
    };
  };
  'Technical Analysis: SMA'?: {
    [date: string]: {
      SMA: string;
    };
  };
}
