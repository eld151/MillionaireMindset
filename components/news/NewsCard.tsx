import React from 'react';

//components/news/NewsCard.tsx

/* Optional props with '?':
'priority?: boolean' means the prop is optional. Callers can pass it or omit it.
If omitted, priority is undefined, which is falsy.
This is equivalent to a C# nullable parameter: 'bool? priority = null'.
*/

//------------------------------------------------------------

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Clock, TrendingUp } from "lucide-react";
import type { NewsCardProps } from "@/types/news";
import { formatRelativeTime, getCategoryColor } from "@/lib/newsUtils";
 
export function NewsCard({ article, priority = false }: NewsCardProps) {
  return (
    <article className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-300 h-full">
 
      {/* ── Image thumbnail ──────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden flex-shrink-0">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.headline}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <TrendingUp className="w-10 h-10 text-gray-300" strokeWidth={1} />
          </div>
        )}
 
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${getCategoryColor(article.category)}`}
          >
            {article.category}
          </span>
        </div>
      </div>
 
      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Headline */}
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-3 mb-3 group-hover:text-black transition-colors">
          {article.headline}
        </h3>
 
        {/* Spacer pushes the footer to the bottom */}
        <div className="flex-1" />
 
        {/* Footer: source, time, tickers, link */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
              <span className="font-semibold text-gray-700 truncate">
                {article.source}
              </span>
              <span>·</span>
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="flex-shrink-0">{formatRelativeTime(article.publishedAt)}</span>
            </div>
 
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={`Read: ${article.headline}`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700" />
            </Link>
          </div>
 
          {/* Related tickers */}
          {article.relatedTickers.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {article.relatedTickers.slice(0, 3).map((ticker) => (
                <span
                  key={ticker}
                  className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-mono rounded"
                >
                  {ticker}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}






