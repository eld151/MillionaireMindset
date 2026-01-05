import StockTickerList from "@/components/StockTickerList";
import NewsCard from "@/components/NewsCard";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Center Column: News (Takes up 2 columns space on large screens) */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold font-handwritten">News</h2>
        
        {/* Main Story (Story 1) */}
        <div className="h-64 bg-white rounded-xl shadow-md p-4 border border-gray-200">
           <h3 className="text-xl font-bold">Story 1: Market Analysis</h3>
           {/* Placeholder for chart */}
           <div className="h-full flex items-center justify-center text-gray-400">
             [Chart Graphic Placeholder]
           </div>
        </div>

        {/* Sub Stories Row */}
        <div className="grid grid-cols-2 gap-4">
          <NewsCard title="Story 2" />
          <NewsCard title="Story 3" />
        </div>
      </div>

      {/* Right Column: Login & Stocks */}
      <div className="space-y-6">
        {/* Auth Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 px-4 py-2 border-2 border-black rounded hover:bg-gray-100">Login</button>
          <button className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Sign-Up</button>
        </div>

        {/* Stock List */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4">Market Watch</h3>
          <StockTickerList />
        </div>
      </div>

    </div>
  );
}