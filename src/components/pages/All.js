import React from 'react'
import { useState } from 'react';
import axios from 'axios';

export default function All({client, setClient}) {

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

    const handleUpdateClient = async (id, updatedData) => {
        if ( (updatedData.id !== '' && updatedData.id !== undefined) && updatedData.imeIPrezime !== '') {
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

    const deleteClient = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete/client/${id}`);
            setClient((prevClients) => prevClients.filter((person) => person._id !== id));
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const clearValue = (clientId, field) => {
        axios.post(`http://localhost:5000/clearValue/${clientId}`, { field: field })
          .then(response => {
            console.log(`Value for field ${field} cleared successfully for client ${clientId}`);
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
      

  return (
    <div className='all'>
        {client.length > 0 &&
                <div className='client-container'>
                    {client.map((person) => (
                        <div className='client-data-container' key={person._id}>
                            {editingClients.includes(person._id) ? (
                                <>
                                    Id: <input
                                        type="number"
                                        placeholder="Id"
                                        value={updatedData.id}
                                        onChange={(e) => setUpdatedData({ ...updatedData, id: e.target.value })}
                                    />
                                    Broj Na Baranje: <input
                                        type="text"
                                        placeholder="Broj Na Baranje"
                                        value={updatedData.brojNaBaranje}
                                        onChange={(e) => setUpdatedData({ ...updatedData, brojNaBaranje: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.imeIPrezime}
                                        onChange={(e) => setUpdatedData({ ...updatedData, imeIPrezime: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.adresa}
                                        onChange={(e) => setUpdatedData({ ...updatedData, adresa: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        value={updatedData.telefonskiBroj}
                                        onChange={(e) => setUpdatedData({ ...updatedData, telefonskiBroj: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.vidNaUsloga}
                                        onChange={(e) => setUpdatedData({ ...updatedData, vidNaUsloga: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.ko}
                                        onChange={(e) => setUpdatedData({ ...updatedData, ko: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.kp}
                                        onChange={(e) => setUpdatedData({ ...updatedData, kp: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        value={updatedData.date}
                                        onChange={(e) => setUpdatedData({ ...updatedData, date: e.target.value })}
                                    />
                                    <button onClick={() => handleUpdateClient(person._id, updatedData)}>Update</button>
                                    <button onClick={() => handleCancelEdit(person._id)}>Cancel</button>
                                    {updateMsg}
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEditClient(person._id)}>Edit</button>
                                    <button onClick={() => deleteClient(person._id)}>Delete client</button>
                                    <p className='client-data'>Id: {person.id}</p>
                                    <div className='client-data'>{person.brojNaBaranje !== '' && 'Broj Na Baranje: ' + person.brojNaBaranje} {person.brojNaBaranje !== '' && <button onClick={() => clearValue(person._id, 'brojNaBaranje')}>Delete</button>}</div>
                                    <p className='client-data'>Ime i Prezime: {person.imeIPrezime}</p>
                                    <p className='client-data'>{person.adresa !== '' && 'Adresa: ' + person.adresa}</p>
                                    <p className='client-data'>{(person.telefonskiBroj !== '' && person.telefonskiBroj !== undefined) && 'Telefonski Broj: ' + person.telefonskiBroj}</p>
                                    <p className='client-data'>{person.vidNaUsloga !== '' && 'Vid Na Usloga: ' + person.vidNaUsloga}</p>
                                    <p className='client-data'>{person.ko !== '' && 'KO: ' + person.ko}</p>
                                    <p className='client-data'>{person.kp !== '' && 'KP: ' + person.kp}</p>
                                    <p className='client-data'>{(person.date !== undefined && person.date !== '') && 'Data: ' + person.date}</p>
                                    <br></br>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            }
    </div>
  )
}
