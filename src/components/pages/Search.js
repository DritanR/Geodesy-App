import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar';
import '../styling/pages-styling/Search.css';
import { BsFillTrashFill, BsThreeDots, BsTrash } from 'react-icons/bs'


const Search = ({ client, setClient, clientFiles, setClientFiles }) => {
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
    const [confirmDeleteClientId, setConfirmDeleteClientId] = useState(null);
    const [confirmDeleteItem, setConfirmDeleteItem] = useState({
        clientId: null,
        field: null
    });

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

    const searchClient = async () => {
        if (idQuery !== '') {
            try {
                const response = await axios.get(`http://localhost:5000/get/client`, {
                    params: {
                        imeIPrezime: searchQuery.toLowerCase(),
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
                setShowSearchResults={setShowSearchResults}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                idQuery={idQuery}
                setIdQuery={setIdQuery}
                setIdQueryList={setIdQueryList}
                showSearchResults={showSearchResults}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                handleResultClick={handleResultClick}
                deleteMessage={deleteMessage}
                dltItem={dltItem}
                setClient={setClient}
                enterIdMsg={enterIdMsg}
                setEnterIdMsg={setEnterIdMsg}
                error={error}
                setError={setError}
            />
            
            {client.length > 0 &&
                <div className='client-container'>
                    {client.map((person) => (
                        <div className='client-data-container' key={person._id}>
                            {editingClients.includes(person._id) ? (
                                <div className='update-container'>
                                    <h2 className='update-title'>Updating the client: </h2>
                                    <p className='update-msg'>{updateMsg}</p>
                                    <div className='update-data-container'>
                                        <div className='client-update-each'>
                                            <p className='update-text'>Id:</p>
                                            <input
                                                className='input-update'
                                                type="number"
                                                placeholder="Id"
                                                value={updatedData.id}
                                                onChange={(e) => setUpdatedData({ ...updatedData, id: e.target.value })}
                                            />
                                        </div>
                                        <div className='client-update-each'>
                                            <p className='update-text'>Broj Na Baranje:</p>
                                            <input
                                                className='input-update'
                                                type="text"
                                                placeholder="Broj Na Baranje"
                                                value={updatedData.brojNaBaranje}
                                                onChange={(e) => setUpdatedData({ ...updatedData, brojNaBaranje: e.target.value })}
                                            />
                                        </div>
                                        <div className='client-update-each'>
                                            <p className='update-text'>Ime I Prezime:</p>
                                            <input
                                                className='input-update'
                                                type="text"
                                                value={updatedData.imeIPrezime}
                                                onChange={(e) => setUpdatedData({ ...updatedData, imeIPrezime: e.target.value })}
                                                placeholder='Ime I Prezime'
                                            />
                                        </div>
                                        <div className='client-update-each'>
                                            <p className='update-text'>Adresa</p>
                                            <input
                                                className='input-update'
                                                type="text"
                                                value={updatedData.adresa}
                                                onChange={(e) => setUpdatedData({ ...updatedData, adresa: e.target.value })}
                                                placeholder='Adresa'
                                            />
                                        </div>
                                        <div className='client-update-each'>
                                            <p className='update-text'>Telefonski Broj:</p>
                                            <input
                                                className='input-update'
                                                type="number"
                                                value={updatedData.telefonskiBroj}
                                                onChange={(e) => setUpdatedData({ ...updatedData, telefonskiBroj: e.target.value })}
                                                placeholder='Telefonski Broj'
                                            />
                                        </div>
                                        <div className='client-update-each'>
                                            <p className='update-text'>Vid Na Usloga:</p>
                                            <input
                                                className='input-update'
                                                type="text"
                                                value={updatedData.vidNaUsloga}
                                                onChange={(e) => setUpdatedData({ ...updatedData, vidNaUsloga: e.target.value })}
                                                placeholder='Vid Na Usloga'
                                            />
                                        </div>
                                        <div className='client-update-each'>
                                            <p className='update-text'>KO:</p>
                                            <input
                                                className='input-update'
                                                type="text"
                                                value={updatedData.ko}
                                                onChange={(e) => setUpdatedData({ ...updatedData, ko: e.target.value })}
                                                placeholder='KO'
                                            />
                                        </div>
                                        <div className='client-update-each'>
                                            <p className='update-text'>KP:</p>
                                            <input
                                                className='input-update'
                                                type="text"
                                                value={updatedData.kp}
                                                onChange={(e) => setUpdatedData({ ...updatedData, kp: e.target.value })}
                                                placeholder='KP'
                                            />
                                        </div>
                                        <div className='client-update-each'>
                                            <p className='update-text'>Date:</p>
                                            <input
                                                className='input-update'
                                                type="date"
                                                value={updatedData.date}
                                                onChange={(e) => setUpdatedData({ ...updatedData, date: e.target.value })}
                                                placeholder="Data"
                                            />
                                        </div>
                                        <div className='update-clients-buttons'>
                                            <button className='update-clients-button' onClick={() => handleUpdateClient(person._id, updatedData)}>Update</button>
                                            <button className='update-clients-button' onClick={() => handleCancelEdit(person._id)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='client-container'>
                                    <h2 className='client-title'>The client:</h2>
                                    <p className='delete-item-msg'>{dltItem}</p>
                                    <p className='delete-file-msg'>{fileMessage}</p>
                                    <div className='client-container-data'>
                                        <div className='client-data-buttons'>
                                            <button className='client-top-buttons' onClick={() => handleEditClient(person._id)}><BsThreeDots /></button>
                                            <button className='client-top-buttons' onClick={() => setConfirmDeleteClientId(person._id)}><BsTrash /></button>
                                        </div>
                                        {confirmDeleteClientId === person._id && (
                                            <div className='delete-client-item-cont'>
                                                <p className='dltit-text'>Are you sure you want to delete this client?</p>
                                                <div className='dltit-buttons'>
                                                    <button className='yes-dltit' onClick={() => {
                                                        deleteClient(person._id)
                                                        setConfirmDeleteClientId(null);
                                                    }}>Yes</button>
                                                    <button className='no-dltit' onClick={() => setConfirmDeleteClientId(null)}>No</button>
                                                </div>
                                            </div>
                                        )}

                                        <div className='client-cont-nb'>
                                            <p className='client-key'>Id: </p>
                                            <p className='client-value'>{person.id}</p>
                                        </div>
                                        {person.brojNaBaranje !== '' && (
                                            <div className='client-cont'>
                                                <div className='client-cont-flex'>
                                                    <p className='client-key'>Broj Na Baranje: </p>
                                                    <p className='client-value'>{person.brojNaBaranje}</p>
                                                    <button
                                                        className='client-bt'
                                                        onClick={() => setConfirmDeleteItem({
                                                            clientId: person._id,
                                                            field: 'brojNaBaranje' // Replace 'brojNaBaranje' with the actual field you're dealing with
                                                        })}
                                                    >
                                                        <BsFillTrashFill />
                                                    </button>
                                                </div>
                                                {confirmDeleteItem.clientId === person._id && confirmDeleteItem.field === 'brojNaBaranje' && (
                                                    <div className='delete-client-item-cont'>
                                                        <p className='dltit-text'>Are you sure you want to delete this item?</p>
                                                        <div className='dltit-buttons'>
                                                            <button className='yes-dltit' onClick={() => {
                                                                clearValue(person._id, 'brojNaBaranje');
                                                                setConfirmDeleteItem({ clientId: null, field: null }); // Clear the state after deletion
                                                            }}>Yes</button>
                                                            <button className='no-dltit' onClick={() => setConfirmDeleteItem({ clientId: null, field: null })}>No</button>

                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        )}
                                        <div className='client-cont-nb'>
                                            <p className='client-key'>Ime I Prezime:</p>
                                            <p className='client-value'>{person.imeIPrezime}</p>
                                        </div>
                                        {person.adresa !== '' && (
                                            <div className='client-cont'>
                                                <div className='client-cont-flex'>
                                                    <p className='client-key'>Adresa: </p>
                                                    <p className='client-value'>{person.adresa}</p>
                                                    <button
                                                        className='client-bt'
                                                        onClick={() => setConfirmDeleteItem({
                                                            clientId: person._id,
                                                            field: 'adresa' // Replace 'brojNaBaranje' with the actual field you're dealing with
                                                        })}
                                                    >
                                                        <BsFillTrashFill />
                                                    </button>

                                                </div>
                                                {confirmDeleteItem.clientId === person._id && confirmDeleteItem.field === 'adresa' && (
                                                    <div className='delete-client-item-cont'>
                                                        <p className='dltit-text'>Are you sure you want to delete this item?</p>
                                                        <div className='dltit-buttons'>
                                                            <button className='yes-dltit' onClick={() => {
                                                                clearValue(person._id, 'adresa');
                                                                setConfirmDeleteItem({ clientId: null, field: null }); // Clear the state after deletion
                                                            }}>Yes</button>
                                                            <button className='no-dltit' onClick={() => setConfirmDeleteItem({ clientId: null, field: null })}>No</button>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {(person.telefonskiBroj !== '' && person.telefonskiBroj !== undefined) && (
                                            <div className='client-cont'>
                                                <div className='client-cont-flex'>
                                                    <p className='client-key'>Telefonski Broj: </p>
                                                    <p className='client-value'>{person.telefonskiBroj}</p>
                                                    <button
                                                        className='client-bt'
                                                        onClick={() => setConfirmDeleteItem({
                                                            clientId: person._id,
                                                            field: 'telefonskiBroj' // Replace 'brojNaBaranje' with the actual field you're dealing with
                                                        })}
                                                    >
                                                        <BsFillTrashFill />
                                                    </button>

                                                </div>
                                                {confirmDeleteItem.clientId === person._id && confirmDeleteItem.field === 'telefonskiBroj' && (
                                                    <div className='delete-client-item-cont'>
                                                        <p className='dltit-text'>Are you sure you want to delete this item?</p>
                                                        <div className='dltit-buttons'>
                                                            <button className='yes-dltit' onClick={() => {
                                                                clearValue(person._id, 'telefonskiBroj');
                                                                setConfirmDeleteItem({ clientId: null, field: null }); // Clear the state after deletion
                                                            }}>Yes</button>
                                                            <button className='no-dltit' onClick={() => setConfirmDeleteItem({ clientId: null, field: null })}>No</button>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {(person.vidNaUsloga !== '' && person.vidNaUsloga !== undefined) && (
                                            <div className='client-cont'>
                                                <div className='client-cont-flex'>
                                                    <p className='client-key'>Vid Na Usloga: </p>
                                                    <p className='client-value'>{person.vidNaUsloga}</p>
                                                    <button
                                                        className='client-bt'
                                                        onClick={() => setConfirmDeleteItem({
                                                            clientId: person._id,
                                                            field: 'vidNaUsloga' // Replace 'brojNaBaranje' with the actual field you're dealing with
                                                        })}
                                                    >
                                                        <BsFillTrashFill />
                                                    </button>

                                                </div>
                                                {confirmDeleteItem.clientId === person._id && confirmDeleteItem.field === 'vidNaUsloga' && (
                                                    <div className='delete-client-item-cont'>
                                                        <p className='dltit-text'>Are you sure you want to delete this item?</p>
                                                        <div className='dltit-buttons'>
                                                            <button className='yes-dltit' onClick={() => {
                                                                clearValue(person._id, 'vidNaUsloga');
                                                                setConfirmDeleteItem({ clientId: null, field: null }); // Clear the state after deletion
                                                            }}>Yes</button>
                                                            <button className='no-dltit' onClick={() => setConfirmDeleteItem({ clientId: null, field: null })}>No</button>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {person.ko !== '' && (
                                            <div className='client-cont'>
                                                <div className='client-cont-flex'>
                                                    <p className='client-key'>KO: </p>
                                                    <p className='client-value'>{person.ko}</p>
                                                    <button
                                                        className='client-bt'
                                                        onClick={() => setConfirmDeleteItem({
                                                            clientId: person._id,
                                                            field: 'ko' // Replace 'brojNaBaranje' with the actual field you're dealing with
                                                        })}
                                                    >
                                                        <BsFillTrashFill />
                                                    </button>
                                                </div>
                                                {confirmDeleteItem.clientId === person._id && confirmDeleteItem.field === 'ko' && (
                                                    <div className='delete-client-item-cont'>
                                                        <p className='dltit-text'>Are you sure you want to delete this item?</p>
                                                        <div className='dltit-buttons'>
                                                            <button className='yes-dltit' onClick={() => {
                                                                clearValue(person._id, 'ko');
                                                                setConfirmDeleteItem({ clientId: null, field: null }); // Clear the state after deletion
                                                            }}>Yes</button>
                                                            <button className='no-dltit' onClick={() => setConfirmDeleteItem({ clientId: null, field: null })}>No</button>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {person.kp !== '' && (
                                            <div className='client-cont'>
                                                <div className='client-cont-flex'>
                                                    <p className='client-key'>KP: </p>
                                                    <p className='client-value'>{person.kp}</p>
                                                    <button
                                                        className='client-bt'
                                                        onClick={() => setConfirmDeleteItem({
                                                            clientId: person._id,
                                                            field: 'kp' // Replace 'brojNaBaranje' with the actual field you're dealing with
                                                        })}
                                                    >
                                                        <BsFillTrashFill />
                                                    </button>
                                                </div>
                                                {confirmDeleteItem.clientId === person._id && confirmDeleteItem.field === 'kp' && (
                                                    <div className='delete-client-item-cont'>
                                                        <p className='dltit-text'>Are you sure you want to delete this item?</p>
                                                        <div className='dltit-buttons'>
                                                            <button className='yes-dltit' onClick={() => {
                                                                clearValue(person._id, 'kp');
                                                                setConfirmDeleteItem({ clientId: null, field: null }); // Clear the state after deletion
                                                            }}>Yes</button>
                                                            <button className='no-dltit' onClick={() => setConfirmDeleteItem({ clientId: null, field: null })}>No</button>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {(person.date !== '' && person.date !== undefined) && (
                                            <div className='client-cont'>
                                                <div className='client-cont-flex'>
                                                    <p className='client-key'>Data: </p>
                                                    <p className='client-value'>{person.date}</p>
                                                    <button
                                                        className='client-bt'
                                                        onClick={() => setConfirmDeleteItem({
                                                            clientId: person._id,
                                                            field: 'date' // Replace 'brojNaBaranje' with the actual field you're dealing with
                                                        })}
                                                    >
                                                        <BsFillTrashFill />
                                                    </button>
                                                </div>
                                                {confirmDeleteItem.clientId === person._id && confirmDeleteItem.field === 'date' && (
                                                    <div className='delete-client-item-cont'>
                                                        <p className='dltit-text'>Are you sure you want to delete this item?</p>
                                                        <div className='dltit-buttons'>
                                                            <button className='yes-dltit' onClick={() => {
                                                                clearValue(person._id, 'date');
                                                                setConfirmDeleteItem({ clientId: null, field: null }); // Clear the state after deletion
                                                            }}>Yes</button>
                                                            <button className='no-dltit' onClick={() => setConfirmDeleteItem({ clientId: null, field: null })}>No</button>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {clientFiles.length > 0 && (
                                            <div className="file-container">
                                                <h3 className='file-title'>Files:</h3>
                                                <ul className='file-list'>
                                                    {clientFiles.map((file, index) => (
                                                        <li key={index} className='file-list-cont'>
                                                            <div className='client-cont-flex'>
                                                                <a className='file-name' href={`http://localhost:5000/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">
                                                                    {file.originalName}
                                                                </a>
                                                                <button className='file-button' onClick={() => setShowFileDeleteConfirmation({ clientId: person._id, filename: file.filename })}><BsFillTrashFill /></button>
                                                            </div>
                                                            {showFileDeleteConfirmation && showFileDeleteConfirmation.clientId === person._id && showFileDeleteConfirmation.filename === file.filename && (
                                                                <div className='delete-client-item-cont'>
                                                                    <p className='dltit-text'>Are you sure you want to delete this file?</p>
                                                                    <div className='dltit-buttons'>
                                                                        <button className='yes-dltit' onClick={() => handleDeleteFile(person._id, file.filename)}>Yes</button>
                                                                        <button className='no-dltit' onClick={() => setShowFileDeleteConfirmation(null)}>No</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}


                                        <input
                                            className='input-file'
                                            type="file"
                                            onChange={(e) => handleFileUpload(person._id, e.target.files)}
                                            multiple
                                            ref={fileInputRef}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            }
        </div >
    );
};
export default Search;
