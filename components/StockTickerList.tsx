import yahooFinance from 'yahoo-finance2';

type Quote = any;

export default async function StockTickerList() {
  // 1. Define the symbols you want to track
  // Yahoo uses specific symbols for indices: ^GSPC is S&P 500, ^IXIC is Nasdaq
  const tickers = [
    { label: 'NASDAQ', symbol: '^IXIC' },
    { label: 'S&P 500', symbol: '^GSPC' },
    { label: 'NYSE', symbol: '^NYA' }, // NYSE Composite
    { label: 'NVIDIA', symbol: 'NVDA' },
    { label: 'APPLE', symbol: 'AAPL' },
  ];

  // 2. Fetch data for all symbols in parallel
  const quotes = await Promise.all(
    tickers.map(async (ticker) => {
      try {
        const result = await yahooFinance.quote(ticker.symbol, { validateResult: false }) as Quote;
        const price = result.regularMarketPrice ?? result.priceHint;
        const change = result.regularMarketChangePercent;

        if (!price) throw new Error("No price found");

        return {
          ...ticker,
          price: price,
          change: change,
          isValid: true,
        };
      } catch (error) {
        console.error(`Failed to fetch ${ticker.symbol}:`, error);
        return { ...ticker, price: 0, change: 0, isValid: false };
      }
    })
  );

  // 3. Render the list matching your sketch
  return (
    <ul className="space-y-3 font-mono text-sm">
      {quotes.map((stock) => (
        <li key={stock.symbol} className="flex items-end justify-between w-full">
          {/* Left: Name */}
          <span className="font-bold whitespace-nowrap">{stock.label}</span>

          {/* Center: Dashed line filler */}
          <span className="flex-grow border-b-2 border-dotted border-gray-300 mx-2 mb-1"></span>

          {/* Right: Price & Indicator */}
          <div className="flex flex-col items-end">
            <span className="font-semibold text-right">
              {stock.isValid ? `$${Number(stock.price).toLocaleString(undefined, {minimumFractionDigits: 2})}` : 'Loading...'}
            </span>
            {stock.isValid && typeof stock.change === 'number' && (
              <span
                className={`text-xs ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

