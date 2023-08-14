import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar';
import '../styling/pages-styling/Search.css';

const Search = () => {
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [client, setClient] = useState([]);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [idQuery, setIdQuery] = useState('');
  const [idQueryList, setIdQueryList] = useState([])
  const [enterIdMsg, setEnterIdMsg] = useState(null);

const handleSearch = async (query) => {
    try {
      const response = await axios.get(`http://localhost:5000/search/${query}`);
      setSearchResults(response.data.data);
      setIdQueryList(response.data.ids);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setIdQueryList([]);
    }
  };
  


  const searchClient = async () => {

    if (idQuery !== '') {
        try {
          const response = await axios.get(`http://localhost:5000/get/client`, {
            params: {
                name: searchQuery.toLowerCase(),
                id: idQuery
            }
          });
          setClient(response.data);
          setError('');
          setEnterIdMsg(null)
          setSearchQuery('');
          setIdQuery('');
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setError('This client does not exist!');
            setShowSearchResults(false)
            setEnterIdMsg(null);
          } else {
            console.error('Error fetching client:', error);
          }
          setClient([]);
        }
    } else {
        setShowSearchResults(false)
        setError(null)
        setEnterIdMsg('Please enter an ID')
    }
  };

  const deleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/client/${id}`);
      setClient((prevClients) => prevClients.filter((person) => person._id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };
  

  const handleResultClick = (name) => {
    setSearchQuery(name);
    setShowSearchResults(false)
}

  return (
    <div className="search">
      <SearchBar idQueryList={idQueryList} searchClient={searchClient} onSearch={handleSearch} setShowSearchResults={setShowSearchResults} searchQuery={searchQuery} setSearchQuery={setSearchQuery} idQuery={idQuery} setIdQuery={setIdQuery} showSearchResults={showSearchResults} searchResults={searchResults} handleResultClick={handleResultClick} />

      {enterIdMsg && <p>{enterIdMsg}</p>}
      {error && <p>{error}</p>}
      {client.length > 0 &&
        <div className='client-container'>
          {client.map((person) => (
            <div className='client-data-container' key={person._id}>
              <button onClick={() => deleteClient(person._id)}>Delete</button>
              <p className='client-data'>Broj na baranje: {person.id}</p>
              <p className='client-data'>{person.broj.length > 1 && 'Broj: ' + person.broj}</p>
              <p className='client-data'>Ime i Prezime: {person.name}</p>
              <p className='client-data'>{person.city.length > 1 && 'City: ' + person.city}</p>
              <p className='client-data'>{person.province.length > 1 && 'Province: ' + person.province}</p>
              <p className='client-data'>{person.streetAdress.length > 1 && 'Street Address: ' + person.streetAdress}</p>
              <p className='client-data'>{person.postalCode !== null && 'Postal Code: ' + person.postalCode}</p>
              <p className='client-data'>{person.phoneNumber !== '' && 'Telefonski Broj: ' + person.phoneNumber}</p>
              <p className='client-data'>{person.vid.length > 1 && 'Vid: ' + person.vid}</p>
              <p className='client-data'>{person.ko.length > 1 && 'KO: ' + person.ko}</p>
              <p className='client-data'>{person.kp.length > 1 && 'KP: ' + person.kp}</p>
              <p className='client-data'>{person.date.length > 1 && 'Date: ' + person.date}</p>
              <br></br>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default Search;
