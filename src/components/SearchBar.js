import React, { useState } from 'react';
import './styling/SearchBar.css'

const SearchBar = ({ onSearch, setShowSearchResults, searchQuery, setSearchQuery, searchByName }) => {

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
      };

    if (searchQuery.length < 1) {
        setShowSearchResults(false)
    } else {
        setShowSearchResults(true)
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleInputChange}
            />
            <button className='search-button' onClick={searchByName}></button>
        </div>
    );
};

export default SearchBar;
