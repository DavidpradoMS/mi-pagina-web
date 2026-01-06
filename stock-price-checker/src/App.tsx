import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Settings, AlertCircle } from 'lucide-react';
import { useStore } from './store/useStore';
import { useStockData } from './hooks/useStockData';
import { useForexRate } from './hooks/useForexRate';
import { useTechnicalIndicators } from './hooks/useTechnicalIndicators';
import { ApiKeyConfig } from './components/ApiKeyConfig';
import { SearchBar } from './components/SearchBar';
import { PriceCard, PriceCardSkeleton } from './components/PriceCard';
import { ForexRate, ForexRateSkeleton } from './components/ForexRate';
import { TechnicalIndicators, TechnicalIndicatorsSkeleton } from './components/TechnicalIndicators';
import { SpreadCalculator } from './components/SpreadCalculator';
import { DecisionSummary } from './components/DecisionSummary';
import type { TechnicalSignal } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

function AppContent() {
  const { apiKey, currentSymbol, setCurrentSymbol } = useStore();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  }, [apiKey]);

  const {
    data: stockData,
    isLoading: stockLoading,
    error: stockError,
  } = useStockData(currentSymbol, apiKey);

  const {
    data: forexData,
    isLoading: forexLoading,
    error: forexError,
  } = useForexRate('USD', 'EUR', apiKey);

  const {
    indicators,
    isLoading: indicatorsLoading,
    error: indicatorsError,
  } = useTechnicalIndicators(currentSymbol, stockData?.price, apiKey);

  const handleSearch = (symbol: string) => {
    setCurrentSymbol(symbol);
  };

  const eurPrice = stockData && forexData
    ? stockData.price / forexData.rate
    : undefined;

  const allIndicators: TechnicalSignal[] = [
    indicators.rsi,
    indicators.macd,
    indicators.priceVsSma50,
    indicators.sma50VsSma200,
  ].filter((ind): ind is TechnicalSignal => ind !== undefined);

  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8">
      <ApiKeyConfig
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Stock Price Checker
            </h1>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="p-2 hover:bg-card rounded-lg transition-colors"
              title="Configure API Key"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
          <p className="text-textMuted">
            Real-time stock prices and spread detection for Trade Republic
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Error Messages */}
        {(stockError || forexError || indicatorsError) && (
          <div className="mb-8 p-4 bg-bearish/20 border border-bearish rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-bearish flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-bearish mb-1">Error</h3>
              <p className="text-sm text-textMuted">
                {stockError
                  ? 'Failed to fetch stock data. Please check the symbol and try again.'
                  : forexError
                  ? 'Failed to fetch forex rate. Using USD only.'
                  : 'Failed to fetch some technical indicators.'}
              </p>
              {stockError && (
                <p className="text-xs text-textMuted mt-2">
                  Note: Alpha Vantage free tier has a limit of 25 requests per day.
                  If you've exceeded this limit, try again tomorrow or upgrade your
                  API key.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentSymbol && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Card */}
              {stockLoading ? (
                <PriceCardSkeleton />
              ) : stockData ? (
                <PriceCard quote={stockData} eurPrice={eurPrice} />
              ) : null}

              {/* Technical Indicators */}
              {indicatorsLoading ? (
                <TechnicalIndicatorsSkeleton />
              ) : (
                <TechnicalIndicators indicators={indicators} />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Forex Rate */}
              {forexLoading ? (
                <ForexRateSkeleton />
              ) : forexData ? (
                <ForexRate rate={forexData} />
              ) : null}

              {/* Spread Calculator */}
              {stockData && (
                <SpreadCalculator marketPrice={stockData.price} currency="USD" />
              )}

              {/* Decision Summary */}
              {allIndicators.length > 0 && (
                <DecisionSummary indicators={allIndicators} />
              )}
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!currentSymbol && apiKey && (
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p className="text-textMuted mb-6">
              Enter a stock symbol above to get started with real-time price
              tracking and technical analysis.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'].map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSearch(symbol)}
                  className="bg-accent hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-textMuted text-sm">
          <p>
            Data provided by{' '}
            <a
              href="https://www.alphavantage.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Alpha Vantage
            </a>
          </p>
          <p className="mt-2">
            This tool is for informational purposes only and should not be
            considered as financial advice.
          </p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
