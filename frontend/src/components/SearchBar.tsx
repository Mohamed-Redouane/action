import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border bg-white  border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Start typing...."
        />
        <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    )
}