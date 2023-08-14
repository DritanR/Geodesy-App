import React, { useState } from 'react';
import './styling/SearchBar.css'

const SearchBar = ({ idQueryList, onSearch, searchQuery, setSearchQuery, searchClient, idQuery, setIdQuery, showSearchResults, setShowSearchResults, searchResults, handleResultClick }) => {

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
        setShowSearchResults(true)
    };

    if (searchQuery.length < 1) {
        setShowSearchResults(false)
    }

    return (
        <div>
            <div>
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleInputChange}
            />

            <ul className='search-results'>
                {showSearchResults && searchResults.map((result) => (
                    <li key={result._id} onClick={() => handleResultClick(result.name)}>
                        {result.name}
                    </li>
                ))}
            </ul>

            <input
                type="number"
                placeholder="Search by ID"
                value={idQuery}
                onChange={(e) => setIdQuery(e.target.value)}
                list='id-options'
            />

            <datalist id="id-options">
                {idQueryList.map((id) => (
                    <option key={id} value={id} />
                ))}
            </datalist>
            </div>

            <button className='search-button' onClick={searchClient}>Search</button>
        </div>
    );
};

export default SearchBar;