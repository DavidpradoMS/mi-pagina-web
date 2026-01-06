import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  apiKey: string | null;
  currentSymbol: string;
  favorites: string[];
  searchHistory: string[];
  setApiKey: (key: string) => void;
  setCurrentSymbol: (symbol: string) => void;
  addToFavorites: (symbol: string) => void;
  removeFromFavorites: (symbol: string) => void;
  addToHistory: (symbol: string) => void;
  clearHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: null,
      currentSymbol: '',
      favorites: [],
      searchHistory: [],

      setApiKey: (key: string) => set({ apiKey: key }),

      setCurrentSymbol: (symbol: string) => set({ currentSymbol: symbol }),

      addToFavorites: (symbol: string) =>
        set((state) => ({
          favorites: state.favorites.includes(symbol)
            ? state.favorites
            : [...state.favorites, symbol],
        })),

      removeFromFavorites: (symbol: string) =>
        set((state) => ({
          favorites: state.favorites.filter((s) => s !== symbol),
        })),

      addToHistory: (symbol: string) =>
        set((state) => {
          const newHistory = [
            symbol,
            ...state.searchHistory.filter((s) => s !== symbol),
          ].slice(0, 5);
          return { searchHistory: newHistory };
        }),

      clearHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'stock-price-checker-storage',
    }
  )
);
