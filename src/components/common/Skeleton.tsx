import React from 'react';

export default function Skeleton({ itemCount = 5 }) {
    return (
        <div>
            <div className="mb-4 h-4 rounded animate-pulse">
            </div>
            <ul className="space-y-4">
                {Array.from({ length: itemCount }).map((_, index) => (
                    <li key={index} className="flex items-center p-4 pt-5 border border-gray-500 rounded-lg shadow-sm">
                        <div className="pr-6">
                            <div className="w-12 h-12 rounded-lg bg-gray-500/70 animate-pulse"></div>
                        </div>
                        <div className="flex-grow">
                            <div className="w-3/5 h-5 bg-gray-500/70 rounded animate-pulse"></div>
                            <div className="w-2/5 h-4 mt-1.5 bg-gray-500/70 rounded animate-pulse"></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}