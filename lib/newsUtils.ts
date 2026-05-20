/* Pure utility functions
Pure functions take inputs, return outputs and have no side effects.
Safe to call from both server and client components.
*/

import type { NewsCategory } from "@/types/news";

// Relative time formatter

export function formatRelativeTime(date: Date): string {
    const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  //Intl.RelativeTimeFormat is built into modern browsers and Node to format date as human-readable relative time string.
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffMins < 60) return rtf.format(-diffMins, "minute");
  if (diffHours < 24) return rtf.format(-diffHours, "hour");
  return rtf.format(-diffDays, "day");
}

//---------------------------------------------------

//Category -> Tailwind color classes
// Returns Tailwind background + text classes for a news category badge */
export function getCategoryColor(category: NewsCategory): string {
  switch (category) {
    case "Markets":
      return "bg-blue-100 text-blue-800";
    case "Crypto":
      return "bg-amber-100 text-amber-800";
    case "Economy":
      return "bg-green-100 text-green-800";
    case "Earnings":
      return "bg-purple-100 text-purple-800";
    case "Tech":
      return "bg-sky-100 text-sky-800";
    case "General":
    default:
      return "bg-gray-100 text-gray-700";
  }
}