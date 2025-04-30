'use client';

import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (location: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(location);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name (e.g., London, Tokyo, New York)"
            className="input input-primary w-full"
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          Search
        </button>
      </div>
    </form>
  );
}
