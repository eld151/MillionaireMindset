"use client"; //This tells Next.js server components run ONLY in the server.
//Rule of thumb: keep as much as possible in server components.

//---------------------------------

/* Using useState<T> generic:
    'useState<NewsArticle[] | null>(null)' explicitly types the state as:
    "an array of NewsArticle, or null while loading"
*/

import {useState, useEffect, useCallback} from "react";
import {RefreshCw, AlertCircle, Wifi } from "lucide-react";
import { NewsHero } from "@/components/news/NewsHero";
import { NewsCard } from "./NewsCard";
import { NewsSkeleton } from "./NewsSkeleton";
import type { NewsArticle, NewsFeedResponse, NewsCategory } from "@/types/news";

const ALL_LABEL = "All" as const;
type FilterOption = NewsCategory | typeof ALL_LABEL;

//---------------------------------

//Types for local component state:

type FetchStatus =
| { kind: "idle"} 
| { kind: "loading"} 
| { kind: "success"; isLive: boolean; fetchedAt: Date}
| { kind: "error"; message: string};

//---------------------------------

//Component


export function NewsFeed() {
    const[articles, setArticles] = useState<NewsArticle[] | null>(null);
    const[status, setStatus] = useState<FetchStatus>({kind: "loading"});

//-------------------------------

//Data Fetching

/* 
    useCallback: memoise function reference so it's stable across renders.
        -   Can safely list it as a dependency of the useEffect below without causing infinite loop
*/

    const loadNews = useCallback(async () => {setStatus({kind: "loading"});
    try { 
        const res = await fetch("/api/news", {cache: "no-store",});
        if (!res.ok) throw new Error(`API returned ${res.status}`);
    /* 'res.json()' returns 'any' by default. Cast to interface for autocomplete and type-checking on response fields. */
        const data: NewsFeedResponse = await res.json();
    /* Dates arrive as ISO strings, convert them back to date objects: */
        const parsed: NewsArticle[] = data.articles.map((a) => ({...a,
            publishedAt: new Date(a.publishedAt),
        }))

        setArticles(parsed);
        setStatus({
            kind: "success",
            isLive: data.source === "live",
            fetchedAt: new Date(data.fetchedAt),
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setStatus({ kind: "error", message});
    }
    }, []);
    
    //Fetch on mount
    useEffect(() => { loadNews(); }, [loadNews]);

    //-----------------------------------------

    //Render helpers

    const hero = articles?.[0] ?? null;
    const gridArticles = articles?.slice(1) ?? [];

    //----------------------------------------

    //UI
    const isLoading = status.kind === "loading";

    return (
    <section aria-label="Financial news feed">
 
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">News</h1>
 
          {/* Live / fallback indicator */}
          {status.kind === "success" && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status.isLive
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status.isLive ? "bg-green-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              {status.isLive ? "Live" : "Cached"}
            </div>
          )}
        </div>
 
        {/* Refresh button — only shown once we have data */}
        {!isLoading && (
          <button
            onClick={loadNews}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300"
            aria-label="Refresh news"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        )}
      </div>
 
      {/* ── Loading state ──────────────────────────────────────────────── */}
      {isLoading && <NewsSkeleton />}
 
      {/* ── Error state ────────────────────────────────────────────────── */}
      {status.kind === "error" && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-gray-600 text-sm">
            Couldn&apos;t load the latest news. <br />
            <span className="text-gray-400 text-xs font-mono">{status.message}</span>
          </p>
          <button
            onClick={loadNews}
            className="mt-2 px-5 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
        </div>
      )}
 
      {/* ── Success state ──────────────────────────────────────────────── */}
      {status.kind === "success" && articles && articles.length > 0 && (
        <div className="space-y-4">
 
          {/* Stale data banner */}
          {!status.isLive && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              <Wifi className="w-3.5 h-3.5 flex-shrink-0" />
              Showing cached articles — live data temporarily unavailable
            </div>
          )}
 
          {/* Hero — the top story */}
          {hero && <NewsHero article={hero} />}
 
          {/* Category filter bar */}
          {gridArticles.length > 0 && (
            <CategoryFilteredGrid articles={gridArticles} />
          )}
        </div>
      )}
 
      {/* ── Empty state ────────────────────────────────────────────────── */}
      {status.kind === "success" && articles?.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          No articles available right now. Check back soon.
        </div>
      )}
    </section>
  );
}
    //---------------------------------------------------

    //CategoryFilteredGrid - subcomponent for the filterable article grid

    /* Component-local types:
        You can define a simple local type or interface inside a file when it's only
        used in one place. If it's shared across files, move it to types/news.ts 
    */

    function CategoryFilteredGrid({ articles }: {articles: NewsArticle[]}){
        const [activeFilter, setActiveFilter] = useState<FilterOption>(ALL_LABEL);

        //Get list of categories that actually appear in our data
        /* Array.from(new Set<T>()) to deduplicate with types */

        const availableCategories: FilterOption[] = [ALL_LABEL,
            ...Array.from(new Set<NewsCategory>(articles.map((a) => a.category))),
        ];

        const filtered = activeFilter === ALL_LABEL 
        ? articles 
        : articles.filter((a) => a.category === activeFilter);

        return (<div>
            {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilter === cat
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
 
      {/* Article grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((article, i) => (
          <NewsCard
            key={article.id}
            article={article}
            priority={i < 3} // LCP optimisation: preload first 3 images
          />
        ))}
      </div>
        </div>)

    }


