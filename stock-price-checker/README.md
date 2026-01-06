# Stock Price Checker

A modern web application for tracking real-time stock prices and detecting high spreads on Trade Republic. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Stock Quotes**: Get live stock prices from Alpha Vantage API
- **EUR/USD Exchange Rates**: Automatic currency conversion for European investors
- **Technical Indicators**:
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - SMA 50 & SMA 200 (Simple Moving Averages)
  - Price vs SMA analysis
- **Spread Calculator**: Compare Trade Republic prices with market prices
- **Decision Summary**: AI-powered recommendation based on technical signals
- **Favorites & History**: Save frequently watched stocks
- **Dark Mode UI**: Beautiful, responsive interface optimized for readability

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **TanStack Query (React Query)** - Data fetching and caching
- **Zustand** - State management
- **Recharts** - Data visualization (ready for future enhancements)
- **Lucide React** - Icon library

## Installation

### Prerequisites

- Node.js 18+ and npm
- Alpha Vantage API key (free tier available)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-price-checker
```

2. Install dependencies:
```bash
npm install
```

3. Get your free API key:
   - Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Sign up and get your free API key
   - **Note**: Free tier includes 25 requests/day and 5 requests/minute

4. Configure your API key:
   - The app uses localStorage to store your API key
   - On first launch, you'll be prompted to enter your key
   - Alternatively, create a `.env` file (optional):
   ```bash
   cp .env.example .env
   # Edit .env and add your key
   ```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Workflow

1. **Enter API Key**: On first launch, enter your Alpha Vantage API key
2. **Search Stock**: Type a ticker symbol (e.g., AAPL, MSFT, TSLA) and press Enter
3. **View Analysis**:
   - See current price in USD and EUR
   - Check technical indicators with color-coded signals
   - Review decision summary
4. **Calculate Spread**:
   - Enter the price shown in Trade Republic
   - App will calculate the spread and provide a recommendation
5. **Save Favorites**: Click the star icon to save stocks for quick access

### Understanding Technical Indicators

#### RSI (Relative Strength Index)
- **Green (Bullish)**: RSI < 30 - Stock may be oversold, potential buying opportunity
- **Yellow (Neutral)**: RSI 30-70 - Normal trading range
- **Red (Bearish)**: RSI > 70 - Stock may be overbought, consider taking profits

#### MACD
- **Green**: MACD line above signal line - Bullish momentum
- **Yellow**: Lines crossing or very close - Neutral
- **Red**: MACD line below signal line - Bearish momentum

#### Price vs SMA50
- **Green**: Price > 2% above SMA50 - Strong uptrend
- **Yellow**: Price within ±2% of SMA50 - Consolidation
- **Red**: Price > 2% below SMA50 - Downtrend

#### SMA50 vs SMA200
- **Green**: Golden Cross - SMA50 crosses above SMA200 (Strong buy signal)
- **Yellow**: Lines converging - Potential trend change
- **Red**: Death Cross - SMA50 crosses below SMA200 (Strong sell signal)

### Spread Calculator

The spread calculator helps you determine if Trade Republic's execution price is fair:

- **Green (< 0.3%)**: Acceptable spread, good to trade
- **Yellow (0.3% - 1%)**: Moderate spread, consider waiting
- **Red (> 1%)**: High spread, recommended to wait for better price

## API Limitations

### Free Tier (Alpha Vantage)
- **25 requests per day**
- **5 requests per minute**
- Data may be delayed by 15 minutes

### Tips to Stay Within Limits
- The app caches data for 5-15 minutes to reduce API calls
- Use favorites to quickly access frequently watched stocks
- Plan your research to make the most of daily limit

## Project Structure

```
stock-price-checker/
├── src/
│   ├── components/          # React components
│   │   ├── ApiKeyConfig.tsx
│   │   ├── SearchBar.tsx
│   │   ├── PriceCard.tsx
│   │   ├── ForexRate.tsx
│   │   ├── TechnicalIndicators.tsx
│   │   ├── SpreadCalculator.tsx
│   │   └── DecisionSummary.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useStockData.ts
│   │   ├── useForexRate.ts
│   │   └── useTechnicalIndicators.ts
│   ├── services/           # API integration
│   │   └── alphaVantageApi.ts
│   ├── store/              # State management
│   │   └── useStore.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── calculations.ts
│   │   └── formatters.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── package.json
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Building for Production

```bash
# Build the app
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
Add to `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/stock-price-checker/',
  // ... rest of config
})
```

Then:
```bash
npm run build
npm run deploy  # If you set up gh-pages
```

## Future Enhancements

- [ ] PWA support for mobile installation
- [ ] Push notifications for price alerts
- [ ] Multi-stock comparison view
- [ ] Price history charts with Recharts
- [ ] Export analysis to PDF
- [ ] Integration with Google Sheets
- [ ] Watchlist alerts
- [ ] News sentiment analysis
- [ ] Portfolio tracking

## Troubleshooting

### API Rate Limit Exceeded
**Error**: "Failed to fetch stock data"
**Solution**: You've exceeded the 25 requests/day limit. Wait until tomorrow or upgrade your API key.

### Invalid Symbol
**Error**: "Invalid symbol or API limit reached"
**Solution**: Check that you're using a valid stock ticker (e.g., AAPL not Apple).

### CORS Errors
**Solution**: Alpha Vantage API supports CORS. If you see CORS errors, check your API key and network connection.

### Data Not Loading
1. Check your API key is correct
2. Verify you have internet connection
3. Check browser console for errors
4. Try a different stock symbol

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This tool is for informational purposes only and should not be considered as financial advice. Always do your own research and consult with a qualified financial advisor before making investment decisions.

## Credits

- Data provided by [Alpha Vantage](https://www.alphavantage.co/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

## Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Alpha Vantage [API documentation](https://www.alphavantage.co/documentation/)
3. Open an issue on GitHub

---

**Made with ❤️ for smart investors**
