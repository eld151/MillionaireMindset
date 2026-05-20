//types/news.ts

import { LargeNumberLike } from "crypto";

/* Interfaces vs. Types:
interface -> best for object shapes that may be extended later
type -> best for unions, primitives or computed/mapped objects

Both compile away completely with zero runtime cost.
Choice is mostly about convention and extensibility. 
In a team C# .NET codebase you'd see the same separation: DTOs (Data Transfer Objects)
for API shapes, and domain models for internal use. Same idea here.

*/

// Raw shape returned by yahoo-finance2's search() function
// Keep this separate so that the rest of the app NEVER depends on the library's field names

export interface YahooNewsItem {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number;
    type: string;
    thumbnail?: {
        resolutions: Array<{
            url: string;
            width: number;
            height: number;
            tag: string;
        }>;
    };
    relatedTickers?: string[];
}

//-------------------------------------------------------

// Normalised article shape used throughout the app

// This is what is ALWAYS imported, never YahooNewsItem

export interface NewsArticle {
    id: string;
    headline: string;
  summary: string | null; // Yahoo doesn't always return a summary
  imageUrl: string | null;
  source: string;
  publishedAt: Date;
  url: string;
  relatedTickers: string[];
  category: NewsCategory;
}

export type NewsCategory =
  | "Markets"
  | "Crypto"
  | "Economy"
  | "Earnings"
  | "Tech"
  | "General";

//-----------------------------------------

// API response envelope - wraps the articles with metadata

export interface NewsFeedResponse {
    articles: NewsArticle[];
  fetchedAt: string; // ISO 8601 string — used for "updated X min ago" display
  source: "live" | "fallback"; // lets the UI show a warning if data is stale
}

//---------------------------------------------------------

// Component prop shapes

export interface NewsHeroProps {
    article: NewsArticle;
}

export interface NewsCardProps {
    article: NewsArticle;
    priority?: boolean;
}