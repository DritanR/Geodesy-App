import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styling/SearchBar.css'
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io'

const SearchBar = ({ searchQuery, setSearchQuery, idQueryList, setIdQueryList, searchResults, setSearchResults, searchClient, idQuery, setIdQuery, enterIdMsg, setEnterIdMsg, error, setError, setClient }) => {
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setIdQueryList([]);
            return;
        }

        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/search/${searchQuery}`);
                setSearchResults(response.data.data);
                setIdQueryList(response.data.ids);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setSearchResults([]);
                setIdQueryList([]);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    function handleNameClick(query) {
        setSearchQuery(query)
    }

    function handleBack () {
        setError(null)
        setEnterIdMsg(null)
        setClient([])
    }

    return (
        <>
        <h2 className='search-bar-title'>Search for client:</h2>
        <div className='search-bar'>
            <div className='search-bar-container'>
                <div className='search-bar-right'>
                    <div className='sb-right-1'>
                <input
                className='sb-right-1-input'
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                {searchResults.length > 0  && ( 
                <div className='sb-right-2'>
                {searchQuery.trim() !== '' && (
                    <ul className='sb-right-2-container'>
                        {searchResults.map((result) => (
                            <li className='sb-right-2-element' key={result._id} onClick={() => handleNameClick(result.imeIPrezime)}>{result.imeIPrezime}</li>
                        ))}
                    </ul>
                )}
                </div>
                )}
                </div>
                <div className='sb-left'>
                <select className='sb-left-container' onChange={(e) => setIdQuery(e.target.value)}>
                    <option className='sb-left-element' value={idQuery}>ID</option>
                    {idQueryList.map((id) => (
                        <option className='sb-left-element' key={id} value={id}>{id}</option>
                    ))}
                </select>
                </div>
            </div>
            <div className='search-bar-buttons'>
            <button className='search-bar-button' onClick={searchClient}>Search</button>
            <Link to='/search'><button className='search-bar-button-2' onClick={handleBack}><IoMdArrowRoundBack className='back-icon' /></button></Link>
            </div>
        </div>
        <p className='search-txt'>{enterIdMsg && enterIdMsg}</p>
        <p className='search-txt'>{error && error}</p>
        </>
    );
};

export default SearchBar;
