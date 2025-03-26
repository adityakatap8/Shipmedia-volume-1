import React, { useState } from 'react'
import './SearchFestivals.css'; // Import the specific CSS for this component

function SearchFestivals() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // You can replace this with actual search functionality
  };

  return (
    <div className="search-festivals-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search festivals"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update the state with input value
      />
      <button
        className="search-button"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  )
}

export default SearchFestivals
