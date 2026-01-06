import { useState, useEffect } from 'react';
import { Search, Star, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { normalizeSymbol, validateSymbol } from '../utils/formatters';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const {
    currentSymbol,
    favorites,
    searchHistory,
    addToFavorites,
    removeFromFavorites,
    addToHistory,
  } = useStore();

  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setInput(currentSymbol);
  }, [currentSymbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeSymbol(input);

    if (validateSymbol(normalized)) {
      addToHistory(normalized);
      onSearch(normalized);
      setShowSuggestions(false);
    }
  };

  const handleSelectSymbol = (symbol: string) => {
    setInput(symbol);
    addToHistory(symbol);
    onSearch(symbol);
    setShowSuggestions(false);
  };

  const isFavorite = favorites.includes(currentSymbol);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(currentSymbol);
    } else {
      addToFavorites(currentSymbol);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="card">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted w-5 h-5" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Enter stock symbol (e.g., AAPL, MSFT)"
              className="w-full bg-background border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              maxLength={5}
            />
          </div>

          <button
            type="submit"
            disabled={!validateSymbol(normalizeSymbol(input))}
            className="bg-accent hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Search
          </button>

          {currentSymbol && (
            <button
              type="button"
              onClick={toggleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-background'
                  : 'bg-slate-700 hover:bg-slate-600 text-textMuted'
              }`}
            >
              <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (favorites.length > 0 || searchHistory.length > 0) && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowSuggestions(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 card z-20">
            {favorites.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-textMuted mb-2">
                  <Star className="w-4 h-4" />
                  <span>Favorites</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSelectSymbol(symbol)}
                      className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm text-textMuted mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSelectSymbol(symbol)}
                      className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
