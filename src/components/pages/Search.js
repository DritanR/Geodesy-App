import { useState } from 'react';
import '../styling/pages-styling/Search.css'
import axios from 'axios'
import SearchBar from '../SearchBar';
import { findAllByDisplayValue } from '@testing-library/react';

const Search = () => {
    const [showSearchResults, setShowSearchResults] = useState(true)
    const [client, setClient] = useState([])
    const [error, setError] = useState(null)
    const [showError, setShowError] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async (query) => {
        const response = await fetch(`http://localhost:5000/search/${query.toLowerCase()}`)
        const data = await response.json();
        setSearchResults(data);
    };

    const searchByNameSearchResults = async (name) => {
        setSearchQuery('')
        try {
            const response = await axios.get(`http://localhost:5000/get/client/${name}`)
            setClient(response.data)
            setError('')
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setShowError(true)
                setError('Client not found')
            } else {
                console.error('Error fetching client:', error)
            }
            setClient([]);
        }
    }

    const searchByName = async () => {
        setSearchQuery('')
        try {
            const response = await axios.get(`http://localhost:5000/get/client/${searchQuery}`)
            setClient(response.data)
            setError('')
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Client not found')
            } else {
                console.error('Error fetching client:', error)
            }
            setClient([]);
        }
    }

    const deleteClient = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete/client/${id}`)
            searchByName()
            searchByNameSearchResults()
            setShowError(false)
        } catch (error) {
            console.error('Error deleting client:', error)
        }
    }

    const handleResultClick = (name) => {
        setSearchQuery(name);
        searchByNameSearchResults(name)
    };


    return (
        <div className="search">
        <SearchBar searchByName={searchByName} onSearch={handleSearch} setShowSearchResults={setShowSearchResults} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ul className='search-results'>
                {showSearchResults && searchResults.map((result) => (
                    <li key={result._id} onClick={() => handleResultClick(result.name)}>
                        {result.name}
                    </li>
                ))}
            </ul>

            {(showError && error) && <p>{error}</p>}
            {client.length > 0 &&
                <div className='client-container'>
                    {client.map((person) => (
                        <div className='client-data-container' key={person._id}>
                            <button onClick={() => deleteClient(person._id)}>Delete</button>
                            <p className='client-data'>Name: {person.name}</p>
                            <br></br>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default Search;