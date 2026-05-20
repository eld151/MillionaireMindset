//components/news/NewsSkeleton.tsx

/* Components with no props:
When a component takes no props, you can just write 'function Foo() with no argument.
Alternatively, 'function Foo(props: Record<string, never>)' is explicit, but unnecessary
Empty props case is inferred by TypeScript.
*/

//-----------------------------------------

/** Animated pulse placeholder shown while news articles are loading */
export function NewsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
 
      {/* Hero skeleton */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white flex flex-col lg:flex-row min-h-[380px]">
        {/* Image panel */}
        <div className="w-full lg:w-[58%] min-h-[220px] bg-gray-200" />
        {/* Content panel */}
        <div className="flex flex-col justify-between p-6 lg:p-8 flex-1">
          <div>
            <div className="h-3 bg-gray-200 rounded w-32 mb-5" />
            <div className="space-y-3 mb-4">
              <div className="h-7 bg-gray-200 rounded w-full" />
              <div className="h-7 bg-gray-200 rounded w-5/6" />
              <div className="h-7 bg-gray-200 rounded w-4/6" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-11/12" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="h-10 bg-gray-200 rounded-full w-36" />
          </div>
        </div>
      </div>
 
      {/* Grid skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden border border-gray-200 bg-white"
          >
            <div className="aspect-[16/9] bg-gray-200 w-full" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="pt-3 border-t border-gray-100">
                <div className="h-3 bg-gray-100 rounded w-2/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}