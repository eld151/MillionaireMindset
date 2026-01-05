import React from 'react';

export default function NewsCard({ title }: {title: string}) {
    return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className = "h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">
                Image Placeholder
            </div>
            <h4 className = "font-bold text-lg leading-tight">{title}</h4>
            <p className="text-sm text-gray-500 mt-2">5 min read - Market News</p>
        </div>
    );
}