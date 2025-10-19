// components/podcasts/SearchBar.tsx
'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Search for podcasts..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default SearchBar;