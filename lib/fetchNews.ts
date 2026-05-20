// lib/fetchNews.ts

/* "server-only" modules:
This file runs ONLY on the server (inside API routes or server components).
It uses yahoo-finance2, which uses Node.js APIs that don't exist in the browser.
The same idea as a C# service class - business logic lives here, not in the controller (API) or view (component).
*/

/* async/await and Promise<T>
'async function foo(): Promise<NewsArticle[]>' is the explicit return type for an async funciton.
Typescript infers this automatically but being explicit is good practice.
*/

//------------------------------------------------------------

import type { YahooNewsItem, NewsArticle, NewsCategory} from "@/types/news";

//Helpers

//Pick the best thumbnail URL from Yahoo's resolution array (wider than 400px).

function pickBestImage(item: YahooNewsItem): string | null {
    if (!item.thumbnail?.resolutions?.length) return null;

    const sorted = [...item.thumbnail.resolutions].sort((a,b) => b.width - a.width);
    const preferred = sorted.find((r) => r.width >= 400) ?? sorted[0];
    return preferred?.url ?? null;

}

//---------------------------------------------------------

// Guess category based on article title

function inferCategory(title: string, tickers: string[]): NewsCategory {
    const t = title.toLowerCase();
    if (tickers.some((tk) => ["btc", "eth", "crypto"].includes(tk.toLowerCase())))
        return "Crypto";
    if (/\bearning|revenue|profit|eps|beat|miss\b/.test(t)) return "Earnings";
    if (/\bfed|rate|inflation|gdp|cpi|ppi|treasury\b/.test(t)) return "Economy";
    if (/\bnvda|apple|google|microsoft|meta|amazon|ai\b/.test(t)) return "Tech";
    if (/\bmarket|nasdaq|s&p|dow|stock|share|index\b/.test(t)) return "Markets";
    return "General";
}

//--------------------------------------------------------

// Transform Yahoo's raw shape to our app's NewsArticle shape

/* Explicit return type annotation
The ': NewsArticle' annotation on the function means TypeScript will
error at compile time if we forget a required field or return the wrong type.
Useful when refactoring.
*/

function transform(raw: YahooNewsItem): NewsArticle {
    const tickers = raw.relatedTickers ?? [];
    return {
        id: raw.uuid,
        headline: raw.title,
        summary: null, //Yahoo doesn't include a summary body
        imageUrl: pickBestImage(raw),
        source: raw.publisher,
        publishedAt: new Date(raw.providerPublishTime * 1000), //Unix seconds -> ms 
        url: raw.link,
        relatedTickers: tickers,
        category: inferCategory(raw.title, tickers),
        
    };
}

//---------------------------------------------------------

// Main export: Fetch latest financial used on yahoo-finance2 package.

/*
Promise.all runs multiple searches in parallel to get diverse coverage, then deduplicate and sort by date.
*/

export async function fetchFinancialNews(limit = 10): Promise<NewsArticle[]> {
    try {
        //Dynamic import to stay server only
        const yahooFinance = (await import("yahoo-finance2")).default;
        //Use Promise.all so all searches run concurrently
        type YahooSearchResult = {news?: YahooNewsItem[] };

        const [generalResult, marketsResult, techResult] = await Promise.all([
            yahooFinance.search("stock market investing finance", {
                newsCount: 8,
                quotesCount: 0,
            }) as Promise<YahooSearchResult>,
            yahooFinance.search("S&P 500 Federal Reserve economy", {
        newsCount: 6,
        quotesCount: 0,
        }) as Promise<YahooSearchResult>,
        yahooFinance.search("NVIDIA Apple Microsoft earnings tech", {
            newsCount: 6,
            quotesCount: 0,
        }) as Promise<YahooSearchResult>,
    ]);

        const allRaw: YahooNewsItem[] = [
        ...(generalResult.news ?? []),
        ...(marketsResult.news ?? []),
        ...(techResult.news ?? []),
    ];

    //Deduplicate by UUID (same story can appear in multiple searches)
    const seen = new Set<string>();
    const unique = allRaw.filter((item) => {
        if (seen.has(item.uuid)) return false;
        seen.add(item.uuid);
        return true;
    });

    return (unique
        .filter((item => item.title && item.thumbnail))
        .map(transform)
        .sort((a,b) => b.publishedAt.getTime() - a.publishedAt.getTime())
        .slice(0, limit)
    );
    } catch (err) {
        console.error("[fetchNews] yahoo-finance2 failed:", err);
        return getFallbackArticles(limit);
    }

}

//------------------------------------------------------

//Fallback mock articles in case of live fetch failure

function getFallbackArticles(limit: number): NewsArticle[] {
  const now = new Date();
  const ago = (mins: number) => new Date(now.getTime() - mins * 60_000);
 
  const articles: NewsArticle[] = [
    {
      id: "fallback-1",
      headline: "S&P 500 Hits Record High as Megacap Tech Earnings Impress",
      summary:
        "Strong quarterly results from Apple, Microsoft, and NVIDIA pushed the S&P 500 to an all-time high Thursday, with the index gaining 1.4% in its biggest single-day move since January.",
      imageUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
      source: "Financial Times",
      publishedAt: ago(20),
      url: "#",
      relatedTickers: ["SPY", "AAPL", "MSFT", "NVDA"],
      category: "Markets",
    },
    {
      id: "fallback-2",
      headline: "Federal Reserve Holds Rates Steady, Signals Two Cuts in 2025",
      summary:
        "The Federal Open Market Committee voted unanimously to hold the benchmark rate at its current range, while projections suggest two quarter-point reductions before year-end.",
      imageUrl:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
      source: "Wall Street Journal",
      publishedAt: ago(75),
      url: "#",
      relatedTickers: [],
      category: "Economy",
    },
    {
      id: "fallback-3",
      headline: "NVIDIA Posts 400% Data-Center Revenue Growth on AI Chip Demand",
      summary:
        "NVIDIA's H100 and Blackwell chips are backlogged through mid-2026 as cloud providers race to build AI infrastructure.",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      source: "Reuters",
      publishedAt: ago(150),
      url: "#",
      relatedTickers: ["NVDA"],
      category: "Earnings",
    },
    {
      id: "fallback-4",
      headline: "Bitcoin Crosses $80,000 as Spot ETF Inflows Hit Monthly Record",
      summary:
        "BlackRock's IBIT alone accounted for $2.1 billion in net inflows over the past five trading sessions.",
      imageUrl:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=80",
      source: "Bloomberg",
      publishedAt: ago(210),
      url: "#",
      relatedTickers: ["BTC", "ETH"],
      category: "Crypto",
    },
    {
      id: "fallback-5",
      headline: "Apple Unveils On-Device AI Features, Eyes $4 Trillion Market Cap",
      summary:
        "Apple Intelligence expands to 50 new markets with writing tools, smart search, and Siri overhaul powered by an updated language model.",
      imageUrl:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      source: "CNBC",
      publishedAt: ago(300),
      url: "#",
      relatedTickers: ["AAPL"],
      category: "Tech",
    },
    {
      id: "fallback-6",
      headline: "US CPI Data Comes in Cooler Than Expected at 2.8%",
      summary:
        "Inflation moderated for the third consecutive month, raising hopes that the Fed will have room to cut rates earlier than markets currently price in.",
      imageUrl:
        "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&auto=format&fit=crop&q=80",
      source: "Barron's",
      publishedAt: ago(390),
      url: "#",
      relatedTickers: [],
      category: "Economy",
    },
    {
      id: "fallback-7",
      headline: "Warren Buffett Reveals New $6B Position in Domino's Pizza",
      summary:
        "Berkshire Hathaway's 13-F filing surprised Wall Street with a substantial stake in the pizza chain, sending shares up 11% in after-hours trading.",
      imageUrl:
        "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&auto=format&fit=crop&q=80",
      source: "MarketWatch",
      publishedAt: ago(480),
      url: "#",
      relatedTickers: ["BRK.A", "DPZ"],
      category: "Markets",
    },
  ];
 
  return articles.slice(0, limit);
}