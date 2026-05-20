//app/api/news/route.ts

/* API routes:
In Next.js 13+ App Router, API routes live in 'app/api/' and export
named function that match HTTP methods: GET, POST, PUT, DELETE, etc.

The CONTROLLER in the MVC architecture:
    - Reveives the HTTP request
    - Calls the service (lib/fetchNews.ts) for Data
    - Returns an HTTP response
    - Does NOT contain business logic itself
*/

/* NextResponse.json<T>():
The generic parameter <NewsFeedResponse> tells TypeScript what shape the JSON body must be.
If you accidentally run the wrong shape, TypeScript will error at compile time - same as C#'s strong typing.
*/

import { NextResponse } from "next/server";
import { fetchFinancialNews } from "@/lib/fetchNews";
import type { NewsFeedResponse } from "@/types/news";

// GET api/news -> called by NewsFeed client component on mount and on manual refresh

export async function GET(): Promise<NextResponse<NewsFeedResponse>> {
    try {
        const articles = await fetchFinancialNews(10);

        const body: NewsFeedResponse = {
            articles,
            fetchedAt: new Date().toISOString(),
            source: articles.some((a) => a.id.startsWith("fallback"))
                ? "fallback"
                : "live",
        };

        return NextResponse.json(body, {
            status: 200,
            headers: {
                //Users get a fast cached response while fresh data loads
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (err) {
        console.error("[GET /api/news]", err);

        return NextResponse.json(
            {
                articles: [],
                fetchedAt: new Date().toISOString(),
                source: "fallback" as const,
            },
            {status: 500}
        );
    }
}
