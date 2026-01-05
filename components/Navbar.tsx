import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {/* Simple CSS Crown Logo */}
                <div className = "relative flex flex-col items-center">
                    <div className = "text-2xl">👑</div>
                    <span className="font-bold text-xl tracking-lighter leading-none">MM</span>
            </div>
            <div className = "flex flex-col ml-2">
                <h1 className="text-2xl font-black italic uppercase leading-none">
                    Millionaire Mindset
                </h1>
                <p className="text-xs text-gray-500 italic">
                    "We all have it... let's find it together"
                </p>
                </div>
            </div>
        {/*Placeholder for potential search or profile icon */}
        <div className = "hidden md:block">
            <input 
                type = "text"
                placeholder= "Search..."
                className = "bg-gray-100 px-4 py-1 rounded-full text-sm border focus:outline-none focus:ring-1 focus:ring-black"
                />
        </div>
    </nav>
    );
}