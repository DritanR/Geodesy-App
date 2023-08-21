import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar';
import '../styling/pages-styling/Search.css';


const Search = ({ client, setClient }) => {
    const [showSearchResults, setShowSearchResults] = useState(true);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [idQuery, setIdQuery] = useState('');
    const [idQueryList, setIdQueryList] = useState([]);
    const [enterIdMsg, setEnterIdMsg] = useState(null);
    const [editingClients, setEditingClients] = useState([]);
    const [updatedData, setUpdatedData] = useState({
        id: '',
        brojNaBaranje: '',
        imeIPrezime: '',
        adresa: '',
        telefonskiBroj: '',
        vidNaUsloga: '',
        ko: '',
        kp: '',
        date: ''
    });
    const [updateMsg, setUpdateMsg] = useState(null)
    const fileInputRef = useRef(null);
    const [dltClient, setDltClient] = useState(false)
    const [deleteMessage, setDeleteMessage] = useState(null)
    const [showClearConfirmation, setShowClearConfirmation] = useState(null)
    const [dltItem, setDltItem] = useState(null)
    const [showFileDeleteConfirmation, setShowFileDeleteConfirmation] = useState(null);
    const [fileMessage, setFileMessage] = useState(null)

    useEffect(() => {
        if (deleteMessage || dltItem || fileMessage) {
            const timeout = setTimeout(() => {
                setDeleteMessage(null);
                setDltItem(null)
                setFileMessage(null)
            }, 3000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [deleteMessage, dltItem, fileMessage]);


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
                setEnterIdMsg(null);
                setSearchQuery('');
                setIdQuery('');

                if (response.data.length > 0) {
                    fetchClientFiles(response.data[0]._id); // Assuming you want to fetch files for the first matching client
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('This client does not exist!');
                    setShowSearchResults(false);
                    setEnterIdMsg(null);
                } else {
                    console.error('Error fetching client:', error);
                    setEnterIdMsg(null)
                }
                setClient([]);
                setClientFiles([]);
            }
        } else {
            setShowSearchResults(false);
            setError(null);
            setEnterIdMsg('Please enter an ID');
            setClientFiles([]);
        }
    };

    const deleteClient = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete/client/${id}`);
            setClient((prevClients) => prevClients.filter((person) => person._id !== id));
            setDltClient(false)

            setDeleteMessage('Client deleted successfully!');
        } catch (error) {
            console.error('Error deleting client:', error);
            setDltClient(false)
        }
    };

    const handleResultClick = (name) => {
        setSearchQuery(name);
        setShowSearchResults(false);
    };

    const handleEditClient = (id) => {
        const clientToEdit = client.find(person => person._id === id);

        setEditingClients((prevEditingClients) => [...prevEditingClients, id]);
        setUpdatedData({
            id: clientToEdit.id,
            brojNaBaranje: clientToEdit.brojNaBaranje,
            imeIPrezime: clientToEdit.imeIPrezime,
            adresa: clientToEdit.adresa,
            telefonskiBroj: clientToEdit.telefonskiBroj,
            vidNaUsloga: clientToEdit.vidNaUsloga,
            ko: clientToEdit.ko,
            kp: clientToEdit.kp,
            date: clientToEdit.date,
        });
    };

    const handleUpdateClient = async (id, updatedData) => {
        if ((updatedData.id !== '' && updatedData.id !== undefined) && updatedData.imeIPrezime !== '') {
            try {
                await axios.put(`http://localhost:5000/update/client/${id}`, updatedData);
                setEditingClients((prevEditingClients) =>
                    prevEditingClients.filter((clientId) => clientId !== id)
                );

                setClient((prevClients) =>
                    prevClients.map((person) => {
                        if (person._id === id) {
                            return { ...person, ...updatedData };
                        }
                        return person;
                    })
                );
                setUpdateMsg(null)
                setDltItem('Updated successfully!')
            } catch (error) {
                console.error('Error updating client:', error);
                setUpdateMsg(null)
            }
        } else if ((updatedData.id === '' || updatedData.id === undefined) && updatedData.imeIPrezime !== '') {
            setUpdateMsg('Please fill the empty ID field to update client data!')
        } else if ((updatedData.id !== '' && updatedData.id !== undefined) && updatedData.imeIPrezime === '') {
            setUpdateMsg('Please fill the empty Name field to update client data!')
        } else {
            setUpdateMsg('Please fill the empty ID and Name field to update client data!')
        }
    };

    const handleCancelEdit = (id) => {
        setUpdateMsg(null)
        setEditingClients((prevEditingClients) =>
            prevEditingClients.filter((clientId) => clientId !== id)
        );
    };
    const clearValue = (clientId, field) => {
        axios.post(`http://localhost:5000/clearValue/${clientId}`, { field: field })
            .then(response => {
                console.log(`Value for field ${field} cleared successfully for client ${clientId}`);
                setShowClearConfirmation(null)
                setDltItem('Item deleted successfully!')
                setClient(prevClients => {
                    return prevClients.map(person => {
                        if (person._id === clientId) {
                            return { ...person, [field]: '' };
                        }
                        return person;
                    });
                });
            })
            .catch(error => {
                console.error('Error clearing value:', error);
            });
    };

    const handleFileUpload = async (clientId, files) => {
        try {
            const formData = new FormData();

            for (const file of files) {
                formData.append('files', file);
            }

            await axios.post(`http://localhost:5000/upload/${clientId}`, formData);

            fetchClientFiles(clientId);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset the input's value
            }
            setFileMessage('File added successfully!')
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const [clientFiles, setClientFiles] = useState([]);

    const fetchClientFiles = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:5000/get/files/${clientId}`);
            setClientFiles(response.data.files);
        } catch (error) {
            console.error('Error fetching client files:', error);
        }
    };

    const handleDeleteFile = async (clientId, filename) => {
        try {
            await axios.delete(`http://localhost:5000/delete/file/${clientId}/${filename}`);
            setFileMessage('File deleted successfully!');

            setClientFiles(prevFiles => prevFiles.filter(file => file.filename !== filename));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };


    return (
        <div className="search">
            <SearchBar
                idQueryList={idQueryList}
                searchClient={searchClient}
                onSearch={handleSearch}
                setShowSearchResults={setShowSearchResults}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                idQuery={idQuery}
                setIdQuery={setIdQuery}
                showSearchResults={showSearchResults}
                searchResults={searchResults}
                handleResultClick={handleResultClick}
                deleteMessage={deleteMessage}
                dltItem={dltItem}
            />

            {enterIdMsg && <p>{enterIdMsg}</p>}
            {error && <p>{error}</p>}
            {client.length > 0 &&
                <div className='client-container'>
                    {client.map((person) => (
                        <div className='client-data-container' key={person._id}>
                            {editingClients.includes(person._id) ? (
                                <>
                                    <div>
                                        <p className='update-text'>Id:</p>
                                        <input
                                            type="number"
                                            placeholder="Id"
                                            value={updatedData.id}
                                            onChange={(e) => setUpdatedData({ ...updatedData, id: e.target.value })}
                                            placeholder='Id'
                                        />
                                    </div>
                                    <div>
                                        <p className='update-text'>Broj Na Baranje:</p>
                                        <input
                                            type="text"
                                            placeholder="Broj Na Baranje"
                                            value={updatedData.brojNaBaranje}
                                            onChange={(e) => setUpdatedData({ ...updatedData, brojNaBaranje: e.target.value })}
                                            placeholder='Broj Na Baranje'
                                        />
                                    </div>
                                    <div>
                                        <p className='update-text'>Ime I Prezime:</p>
                                        <input
                                            type="text"
                                            value={updatedData.imeIPrezime}
                                            onChange={(e) => setUpdatedData({ ...updatedData, imeIPrezime: e.target.value })}
                                            placeholder='Ime I Prezime'
                                        />
                                    </div>
                                    <div>
                                        <p className='update-text'>Adresa</p>
                                        <input
                                            type="text"
                                            value={updatedData.adresa}
                                            onChange={(e) => setUpdatedData({ ...updatedData, adresa: e.target.value })}
                                            placeholder='Adresa'
                                        />
                                    </div>
                                    <div>
                                        <p className='update-text'>Telefonski Broj:</p>
                                        <input
                                            type="number"
                                            value={updatedData.telefonskiBroj}
                                            onChange={(e) => setUpdatedData({ ...updatedData, telefonskiBroj: e.target.value })}
                                            placeholder='Telefonski Broj'
                                        />
                                    </div>
                                    <div className='update-text'>
                                        <p>Vid Na Usloga:</p>
                                        <input
                                            type="text"
                                            value={updatedData.vidNaUsloga}
                                            onChange={(e) => setUpdatedData({ ...updatedData, vidNaUsloga: e.target.value })}
                                            placeholder='Vid Na Usloga'
                                        />
                                    </div>
                                    <div>
                                        <p className='update-text'>KO:</p>
                                        <input
                                            type="text"
                                            value={updatedData.ko}
                                            onChange={(e) => setUpdatedData({ ...updatedData, ko: e.target.value })}
                                            placeholder='KO'
                                        />
                                    </div>
                                    <div>
                                        <p className='update-text'>KP:</p>
                                        <input
                                            type="text"
                                            value={updatedData.kp}
                                            onChange={(e) => setUpdatedData({ ...updatedData, kp: e.target.value })}
                                            placeholder='KP'
                                        />
                                    </div>
                                    <div>
                                        <p className='update-text'>Date:</p>
                                        <input
                                            type="date"
                                            value={updatedData.date}
                                            onChange={(e) => setUpdatedData({ ...updatedData, date: e.target.value })}
                                            placeholder="Data"
                                        />
                                    </div>
                                    <button onClick={() => handleUpdateClient(person._id, updatedData)}>Update</button>
                                    <button onClick={() => handleCancelEdit(person._id)}>Cancel</button>
                                    {updateMsg}
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEditClient(person._id)}>Edit</button>
                                    <button onClick={() => setDltClient(true)}>Delete client</button>
                                    {dltClient && <div className='delete-client'>
                                        <p>Are you sure you want to delete this client ?</p>
                                        <button className='yes' onClick={() => deleteClient(person._id)}>Yes</button>
                                        <button className='no' onClick={() => setDltClient(false)}>No</button>
                                    </div>}
                                    <div>
                                        <p>Id: </p>
                                        <p>{person.id}</p>
                                    </div>
                                    {person.brojNaBaranje !== '' && (
                                        <div>
                                            <p>Broj Na Baranje: </p>
                                            <p>{person.brojNaBaranje}</p>
                                            <button onClick={() => setShowClearConfirmation('brojNaBaranje')}>Delete</button>
                                            {showClearConfirmation === 'brojNaBaranje' && (
                                                <div className='delete-client'>
                                                    <p>Are you sure you want to delete this item?</p>
                                                    <button className='yes' onClick={() => clearValue(person._id, 'brojNaBaranje')}>Yes</button>
                                                    <button className='no' onClick={() => setShowClearConfirmation(null)}>No</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <p>Ime I Prezime:</p>
                                        <p>{person.imeIPrezime}</p>
                                    </div>
                                    {person.adresa !== '' && (
                                        <div>
                                            <p>Adresa: </p>
                                            <p>{person.adresa}</p>
                                            <button onClick={() => setShowClearConfirmation('adresa')}>Delete</button>
                                            {showClearConfirmation === 'adresa' && (
                                                <div className='delete-client'>
                                                    <p>Are you sure you want to delete this item?</p>
                                                    <button className='yes' onClick={() => clearValue(person._id, 'adresa')}>Yes</button>
                                                    <button className='no' onClick={() => setShowClearConfirmation(null)}>No</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {(person.telefonskiBroj !== '' && person.telefonskiBroj !== undefined) && (
                                        <div>
                                            <p>Telefonski Broj: </p>
                                            <p>{person.telefonskiBroj}</p>
                                            <button onClick={() => setShowClearConfirmation('telefonskiBroj')}>Delete</button>
                                            {showClearConfirmation === 'telefonskiBroj' && (
                                                <div className='delete-client'>
                                                    <p>Are you sure you want to delete this item?</p>
                                                    <button className='yes' onClick={() => clearValue(person._id, 'telefonskiBroj')}>Yes</button>
                                                    <button className='no' onClick={() => setShowClearConfirmation(null)}>No</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {(person.vidNaUsloga !== '' && person.vidNaUsloga !== undefined) && (
                                        <div>
                                            <p>Vid Na Usloga: </p>
                                            <p>{person.vidNaUsloga}</p>
                                            <button onClick={() => setShowClearConfirmation('vidNaUsloga')}>Delete</button>
                                            {showClearConfirmation === 'vidNaUsloga' && (
                                                <div className='delete-client'>
                                                    <p>Are you sure you want to delete this item?</p>
                                                    <button className='yes' onClick={() => clearValue(person._id, 'vidNaUsloga')}>Yes</button>
                                                    <button className='no' onClick={() => setShowClearConfirmation(null)}>No</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {person.ko !== '' && (
                                        <div>
                                            <p>KO: </p>
                                            <p>{person.ko}</p>
                                            <button onClick={() => setShowClearConfirmation('ko')}>Delete</button>
                                            {showClearConfirmation === 'ko' && (
                                                <div className='delete-client'>
                                                    <p>Are you sure you want to delete this item?</p>
                                                    <button className='yes' onClick={() => clearValue(person._id, 'ko')}>Yes</button>
                                                    <button className='no' onClick={() => setShowClearConfirmation(null)}>No</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {person.kp !== '' && (
                                        <div>
                                            <p>KP: </p>
                                            <p>{person.kp}</p>
                                            <button onClick={() => setShowClearConfirmation('kp')}>Delete</button>
                                            {showClearConfirmation === 'kp' && (
                                                <div className='delete-client'>
                                                    <p>Are you sure you want to delete this item?</p>
                                                    <button className='yes' onClick={() => clearValue(person._id, 'kp')}>Yes</button>
                                                    <button className='no' onClick={() => setShowClearConfirmation(null)}>No</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {(person.date !== '' && person.date !== undefined) && (
                                        <div>
                                            <p>Data: </p>
                                            <p>{person.date}</p>
                                            <button onClick={() => setShowClearConfirmation('date')}>Delete</button>
                                            {showClearConfirmation === 'date' && (
                                                <div className='delete-client'>
                                                    <p>Are you sure you want to delete this item?</p>
                                                    <button className='yes' onClick={() => clearValue(person._id, 'date')}>Yes</button>
                                                    <button className='no' onClick={() => setShowClearConfirmation(null)}>No</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {clientFiles.length > 0 && (
                                        <div className="file-list">
                                            <h3>Files:</h3>
                                            <ul>
                                                {clientFiles.map((file, index) => (
                                                    <li key={index}>
                                                        <a href={`http://localhost:5000/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">
                                                            {file.originalName}
                                                        </a>
                                                        <button onClick={() => setShowFileDeleteConfirmation({ clientId: person._id, filename: file.filename })}>Delete</button>
                                                        {showFileDeleteConfirmation && showFileDeleteConfirmation.clientId === person._id && showFileDeleteConfirmation.filename === file.filename && (
                                                            <div className='delete-client'>
                                                                <p>Are you sure you want to delete this file?</p>
                                                                <button className='yes' onClick={() => handleDeleteFile(person._id, file.filename)}>Yes</button>
                                                                <button className='no' onClick={() => setShowFileDeleteConfirmation(null)}>No</button>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}


                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(person._id, e.target.files)}
                                        multiple
                                        ref={fileInputRef}
                                    />
                                    {fileMessage}
                                    <br></br>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            }
        </div >
    );
};
export default Search;
