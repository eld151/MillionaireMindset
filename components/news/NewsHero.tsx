// components/news/NewsHero.tsx

/* Props with interfaces:
We define props as a TypeScript interface (in types/news.ts) and import it.
This is just like C# method parameters. The compiler enforces that the caller passes the right shape.
If 'article' is missing a field, VS underlines it in red before even running the app.
*/

//---------------------------------------------------------

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Clock, TrendingUp } from "lucide-react";
import type {NewsHeroProps} from "@/types/news";
import { formatRelativeTime, getCategoryColor } from "@/lib/newsUtils";

export function NewsHero({ article }: NewsHeroProps) {
    return (
    <article className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col lg:flex-row min-h-[380px]">
 
        {/* ── Left: Image panel ─────────────────────────────────────────── */}
        <div className="relative w-full lg:w-[58%] min-h-[220px] lg:min-h-full bg-gray-100 overflow-hidden flex-shrink-0">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.headline}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority // above-the-fold: load immediately
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          ) : (
            // Graceful fallback when no image is available
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <TrendingUp className="w-16 h-16 text-gray-300" strokeWidth={1} />
            </div>
          )}
 
          {/* Category badge overlaid on the image */}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getCategoryColor(article.category)}`}
            >
              {article.category}
            </span>
          </div>
 
          {/* Related tickers */}
          {article.relatedTickers.length > 0 && (
            <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
              {article.relatedTickers.slice(0, 3).map((ticker) => (
                <span
                  key={ticker}
                  className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs font-mono rounded"
                >
                  {ticker}
                </span>
              ))}
            </div>
          )}
        </div>
 
        {/* ── Right: Content panel ──────────────────────────────────────── */}
        <div className="flex flex-col justify-between p-6 lg:p-8 flex-1">
          {/* Top section */}
          <div>
            {/* Source + time */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <span className="font-semibold text-gray-700">{article.source}</span>
              <span>·</span>
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
 
            {/* Headline */}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
              {article.headline}
            </h2>
 
            {/* Summary — shown only when available */}
            {article.summary && (
              <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            )}
          </div>
 
          {/* Bottom: Read article CTA */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              Read full story
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
    
}