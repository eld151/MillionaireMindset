import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white py-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        {/* Links Section */}
        <div className="flex gap-8 mb-4 font-semibold text-lg">
          <Link href="/our-story" className="hover:text-yellow-400 transition-colors">
            Our Story
          </Link>
          <Link href="/our-mission" className="hover:text-yellow-400 transition-colors">
            Our Mission
          </Link>
        </div>
        
        {/* Copyright Section */}
        <div className="text-gray-400 text-sm">
          Ryan Eldridge | 2025
        </div>
      </div>
    </footer>
  );
}